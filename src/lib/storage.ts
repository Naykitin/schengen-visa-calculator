import { get, set } from 'idb-keyval'
import type { Trip } from './schengen'
import { isValidDateString, safeJsonParse, sanitizeString } from './sanitize'

export type ProfileMode = 'schengen' | 'eu_resident'

export interface EUCountry {
  code: string
  name: string
  flag: string
}

export const EU_COUNTRIES: EUCountry[] = [
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
]

export interface Profile {
  id: string
  name: string
  color: string // Tailwind color key, e.g. 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple'
  mode?: ProfileMode // 'schengen' | 'eu_resident', defaults to 'schengen'
  country?: string   // 'ES', 'DE', etc., defaults to 'ES' when mode is 'eu_resident'
  taxTargetDays?: number // Default: 183 days
  customAbsenceLimit?: number // Default: 182 days
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
      const sanitizedProfiles: Profile[] = data.profiles.map(p => ({
        ...p,
        mode: (p.mode === 'eu_resident' ? 'eu_resident' : 'schengen') as ProfileMode,
        country: p.country || 'ES',
        taxTargetDays: p.taxTargetDays || 183,
        customAbsenceLimit: p.customAbsenceLimit || 182,
      }))
      return { ...data, profiles: sanitizedProfiles }
    }

    // 2. Try localStorage for v2
    const localV2 = localStorage.getItem(STORAGE_PROFILES_KEY)
    if (localV2) {
      const parsed = safeJsonParse(localV2)
      if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        const sanitizedProfiles: Profile[] = parsed.profiles.map((p: any) => ({
          ...p,
          mode: (p.mode === 'eu_resident' ? 'eu_resident' : 'schengen') as ProfileMode,
          country: p.country || 'ES',
          taxTargetDays: p.taxTargetDays || 183,
          customAbsenceLimit: p.customAbsenceLimit || 182,
        }))
        const completeData = { ...parsed, profiles: sanitizedProfiles }
        await set(STORAGE_PROFILES_KEY, completeData)
        return completeData
      }
    }

    // 3. Migrate from legacy v1 trips if available
    const legacyTrips = await get<Trip[]>(LEGACY_TRIPS_KEY)
    const localLegacy = localStorage.getItem(LEGACY_TRIPS_KEY)
    const tripsToMigrate: Trip[] = Array.isArray(legacyTrips)
      ? legacyTrips
      : localLegacy
      ? safeJsonParse(localLegacy)
      : []

    const initialData: AppStorageData = {
      version: '2.1',
      activeProfileId: DEFAULT_PROFILE_ID,
      profiles: [
        {
          id: DEFAULT_PROFILE_ID,
          name: sanitizeString(defaultName, 50),
          color: 'blue',
          mode: 'schengen',
          country: 'ES',
          taxTargetDays: 183,
          customAbsenceLimit: 182,
          trips: Array.isArray(tripsToMigrate) ? sanitizeTripsList(tripsToMigrate) : [],
        },
      ],
    }

    await saveAppStorage(initialData)
    return initialData
  } catch (err) {
    console.error('Failed to load storage, returning default state:', err)
    return {
      version: '2.1',
      activeProfileId: DEFAULT_PROFILE_ID,
      profiles: [
        {
          id: DEFAULT_PROFILE_ID,
          name: sanitizeString(defaultName, 50),
          color: 'blue',
          mode: 'schengen',
          country: 'ES',
          taxTargetDays: 183,
          customAbsenceLimit: 182,
          trips: [],
        },
      ],
    }
  }
}

/**
 * Save multi-profile app data to both IndexedDB and localStorage mirror
 */
export async function saveAppStorage(data: AppStorageData): Promise<void> {
  try {
    await set(STORAGE_PROFILES_KEY, data)
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save app storage:', err)
  }
}

/**
 * Export complete backup data (all profiles and trips) as a JSON file
 */
export function exportBackupData(data: AppStorageData): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const dateStr = new Date().toISOString().slice(0, 10)
  const link = document.createElement('a')
  link.href = url
  link.download = `schengen-suite-backup-${dateStr}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Alias for BackupModal */
export function exportAllDataToJson(data: AppStorageData): void {
  exportBackupData(data)
}

/**
 * Parse and validate JSON content for backup import (supports v1 and v2 formats)
 * Protected against Prototype Pollution and malformed data
 */
export function parseBackupJson(jsonContent: string, currentData: AppStorageData): AppStorageData {
  const parsed = safeJsonParse(jsonContent)

  // Case A: Full v2 backup format
  if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
    const validProfiles: Profile[] = []
    for (const p of parsed.profiles) {
      if (typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.trips)) {
        const mode: ProfileMode = p.mode === 'eu_resident' ? 'eu_resident' : 'schengen'
        const country = typeof p.country === 'string' ? sanitizeString(p.country, 10) : 'ES'
        const taxTargetDays = typeof p.taxTargetDays === 'number' && p.taxTargetDays > 0 ? p.taxTargetDays : 183
        const customAbsenceLimit = typeof p.customAbsenceLimit === 'number' && p.customAbsenceLimit > 0 ? p.customAbsenceLimit : 182

        validProfiles.push({
          id: sanitizeString(p.id, 50),
          name: sanitizeString(p.name, 50),
          color: sanitizeString(p.color || 'blue', 20),
          mode,
          country,
          taxTargetDays,
          customAbsenceLimit,
          trips: sanitizeTripsList(p.trips),
        })
      }
    }

    if (validProfiles.length > 0) {
      return {
        version: '2.1',
        activeProfileId: validProfiles[0].id,
        profiles: validProfiles,
      }
    }
  }

  // Case B: Legacy v1 trip list (import into active profile)
  const rawList = Array.isArray(parsed) ? parsed : parsed?.trips
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

export function sanitizeTripsList(rawList: any[]): Trip[] {
  const validTrips: Trip[] = []
  const todayStr = new Date().toISOString().slice(0, 10)

  for (const item of rawList) {
    if (!isValidDateString(item.entryDate)) continue

    const isOngoing = Boolean(item.ongoing)
    let exitDate = item.exitDate

    if (isOngoing && (!isValidDateString(exitDate) || exitDate < item.entryDate)) {
      exitDate = item.entryDate > todayStr ? item.entryDate : todayStr
    }

    if (
      isValidDateString(exitDate) &&
      item.entryDate <= exitDate
    ) {
      validTrips.push({
        id: sanitizeString(item.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, 60),
        entryDate: item.entryDate,
        exitDate: exitDate,
        title: item.title ? sanitizeString(item.title, 80) : undefined,
        notes: item.notes ? sanitizeString(item.notes, 200) : undefined,
        isPlanned: Boolean(item.isPlanned),
        ongoing: isOngoing,
      })
    }
  }
  return validTrips
}
