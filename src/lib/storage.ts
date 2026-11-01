import { get, set } from 'idb-keyval'
import type { Trip } from './schengen'

export interface Profile {
  id: string
  name: string
  color: string // Tailwind color key, e.g. 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple'
  trips: Trip[]
}

export interface AppStorageData {
  version: string
  activeProfileId: string
  profiles: Profile[]
}

const STORAGE_PROFILES_KEY = 'schengen_profiles_v2'
const LEGACY_TRIPS_KEY = 'schengen_trips_v1'

const DEFAULT_PROFILE_ID = 'default_profile'

export const PROFILE_COLORS = [
  { id: 'blue', name: 'Blue', bg: 'bg-blue-600', ring: 'ring-blue-500' },
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-500' },
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-600', ring: 'ring-amber-500' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-600', ring: 'ring-purple-500' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-600', ring: 'ring-rose-500' },
]

/**
 * Request persistent storage from browser if available
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false
  }

  try {
    const isPersisted = await navigator.storage.persisted()
    if (!isPersisted) {
      return await navigator.storage.persist()
    }
    return true
  } catch (err) {
    console.warn('Could not request persistent storage:', err)
    return false
  }
}

/**
 * Load app storage data with multi-profile and legacy migration
 */
export async function loadAppStorage(defaultName: string = 'My Passport'): Promise<AppStorageData> {
  try {
    // 1. Try to load v2 multi-profile data from IndexedDB
    const data = await get<AppStorageData>(STORAGE_PROFILES_KEY)
    if (data && Array.isArray(data.profiles) && data.profiles.length > 0) {
      return data
    }

    // 2. Try localStorage for v2
    const localV2 = localStorage.getItem(STORAGE_PROFILES_KEY)
    if (localV2) {
      const parsed = JSON.parse(localV2)
      if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        await set(STORAGE_PROFILES_KEY, parsed)
        return parsed
      }
    }

    // 3. Migrate from legacy v1 trips if available
    const legacyTrips = await get<Trip[]>(LEGACY_TRIPS_KEY)
    const localLegacy = localStorage.getItem(LEGACY_TRIPS_KEY)
    const tripsToMigrate: Trip[] = Array.isArray(legacyTrips)
      ? legacyTrips
      : localLegacy
      ? JSON.parse(localLegacy)
      : []

    const initialData: AppStorageData = {
      version: '2.0',
      activeProfileId: DEFAULT_PROFILE_ID,
      profiles: [
        {
          id: DEFAULT_PROFILE_ID,
          name: defaultName,
          color: 'blue',
          trips: Array.isArray(tripsToMigrate) ? tripsToMigrate : [],
        },
      ],
    }

    await saveAppStorage(initialData)
    return initialData
  } catch (err) {
    console.error('Failed to load storage, returning default state:', err)
    return {
      version: '2.0',
      activeProfileId: DEFAULT_PROFILE_ID,
      profiles: [
        {
          id: DEFAULT_PROFILE_ID,
          name: defaultName,
          color: 'blue',
          trips: [],
        },
      ],
    }
  }
}

/**
 * Save app storage data to both IndexedDB and localStorage
 */
export async function saveAppStorage(data: AppStorageData): Promise<void> {
  try {
    await set(STORAGE_PROFILES_KEY, data)
  } catch (err) {
    console.warn('Failed to save to IndexedDB:', err)
  }

  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(data))
  } catch (err) {
    console.warn('Failed to save to localStorage:', err)
  }
}

/**
 * Export full backup containing all profiles
 */
export function exportAllDataToJson(data: AppStorageData): void {
  const exportPayload = {
    ...data,
    exportDate: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `schengen-full-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse and validate JSON content for backup import (supports v1 and v2 formats)
 */
export function parseBackupJson(jsonContent: string, currentData: AppStorageData): AppStorageData {
  const parsed = JSON.parse(jsonContent)

  // Case A: Full v2 backup format
  if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
    const validProfiles: Profile[] = []
    for (const p of parsed.profiles) {
      if (typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.trips)) {
        validProfiles.push({
          id: p.id,
          name: p.name,
          color: p.color || 'blue',
          trips: sanitizeTripsList(p.trips),
        })
      }
    }

    if (validProfiles.length > 0) {
      return {
        version: '2.0',
        activeProfileId: validProfiles[0].id,
        profiles: validProfiles,
      }
    }
  }

  // Case B: Legacy v1 trip list (import into active profile)
  const rawList = Array.isArray(parsed) ? parsed : parsed.trips
  if (Array.isArray(rawList)) {
    const sanitizedTrips = sanitizeTripsList(rawList)
    const updatedProfiles = currentData.profiles.map((p) =>
      p.id === currentData.activeProfileId ? { ...p, trips: sanitizedTrips } : p
    )

    return {
      ...currentData,
      profiles: updatedProfiles,
    }
  }

  throw new Error('File does not contain valid Schengen trip or profile data')
}

function sanitizeTripsList(rawList: any[]): Trip[] {
  const validTrips: Trip[] = []
  for (const item of rawList) {
    if (
      typeof item.entryDate === 'string' &&
      typeof item.exitDate === 'string' &&
      item.entryDate.length === 10 &&
      item.exitDate.length === 10
    ) {
      validTrips.push({
        id: item.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        entryDate: item.entryDate,
        exitDate: item.exitDate,
        title: item.title || '',
        notes: item.notes || '',
        isPlanned: Boolean(item.isPlanned),
      })
    }
  }
  return validTrips
}
