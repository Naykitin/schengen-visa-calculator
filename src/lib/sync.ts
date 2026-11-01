import type { AppStorageData } from './storage'

const SYNC_KEY_STORAGE = 'schengen_sync_key_v1'
const LAST_SYNC_STORAGE = 'schengen_last_sync_timestamp'
const AUTO_SYNC_STORAGE = 'schengen_auto_sync_enabled'

export interface SyncStatus {
  enabled: boolean
  syncKey: string | null
  lastSyncTime: number | null
  isSyncing: boolean
  error: string | null
}

/**
 * Generate a random, cryptographically strong sync key
 */
export function generateSyncKey(): string {
  const bytes = new Uint8Array(12)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < 12; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `vg_${hex}`
}

/**
 * Load stored sync preferences
 */
export function loadSyncPreferences(): {
  syncKey: string | null
  autoSync: boolean
  lastSyncTime: number | null
} {
  if (typeof window === 'undefined') {
    return { syncKey: null, autoSync: false, lastSyncTime: null }
  }

  const syncKey = localStorage.getItem(SYNC_KEY_STORAGE)
  const autoSync = localStorage.getItem(AUTO_SYNC_STORAGE) !== 'false'
  const lastSyncStr = localStorage.getItem(LAST_SYNC_STORAGE)
  const lastSyncTime = lastSyncStr ? parseInt(lastSyncStr, 10) : null

  return { syncKey, autoSync, lastSyncTime }
}

/**
 * Save sync preferences
 */
export function saveSyncPreferences(
  syncKey: string | null,
  autoSync: boolean,
  lastSyncTime?: number
): void {
  if (typeof window === 'undefined') return

  if (syncKey) {
    localStorage.setItem(SYNC_KEY_STORAGE, syncKey)
    localStorage.setItem(AUTO_SYNC_STORAGE, autoSync ? 'true' : 'false')
    if (lastSyncTime) {
      localStorage.setItem(LAST_SYNC_STORAGE, lastSyncTime.toString())
    }
  } else {
    localStorage.removeItem(SYNC_KEY_STORAGE)
    localStorage.removeItem(AUTO_SYNC_STORAGE)
    localStorage.removeItem(LAST_SYNC_STORAGE)
  }
}

/**
 * Pull vault data from Cloudflare D1
 */
export async function fetchRemoteVault(
  syncKey: string
): Promise<{ payload: AppStorageData; updatedAt: number }> {
  const response = await fetch(`/api/sync/${encodeURIComponent(syncKey)}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Vault not found on server')
    }
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Server error (${response.status})`)
  }

  const result = await response.json()
  return result
}

/**
 * Push local data to Cloudflare D1
 */
export async function pushLocalVault(
  syncKey: string,
  payload: AppStorageData,
  updatedAt: number = Date.now()
): Promise<{ success: boolean; conflict?: boolean; remoteData?: AppStorageData; remoteUpdatedAt?: number }> {
  const response = await fetch(`/api/sync/${encodeURIComponent(syncKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, updatedAt }),
  })

  if (response.status === 409) {
    // Conflict: remote version is newer
    const conflictResult = await response.json().catch(() => ({}))
    return {
      success: false,
      conflict: true,
      remoteData: conflictResult.payload,
      remoteUpdatedAt: conflictResult.updatedAt,
    }
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Sync error (${response.status})`)
  }

  return { success: true }
}

/**
 * Check if the current URL has a pairing sync token (?sync=...)
 */
export function extractSyncKeyFromUrl(): string | null {
  if (typeof window === 'undefined') return null

  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('sync')
  if (token && token.length >= 10) {
    // Remove token from query parameters to keep address bar clean
    urlParams.delete('sync')
    const newQuery = urlParams.toString()
    const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash
    window.history.replaceState({}, '', newUrl)
    return token
  }

  return null
}

/**
 * Build shareable pairing URL
 */
export function buildPairingUrl(syncKey: string, baseUrl?: string): string {
  if (baseUrl) {
    return `${baseUrl}?sync=${encodeURIComponent(syncKey)}`
  }
  if (typeof window === 'undefined') {
    return `/?sync=${encodeURIComponent(syncKey)}`
  }
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}?sync=${encodeURIComponent(syncKey)}`
}
