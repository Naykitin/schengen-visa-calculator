import { get, set } from 'idb-keyval'
import type { Trip } from './schengen'

const STORAGE_KEY = 'schengen_trips_v1'

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
 * Load trips from IndexedDB with localStorage fallback
 */
export async function loadTrips(): Promise<Trip[]> {
  try {
    const data = await get<Trip[]>(STORAGE_KEY)
    if (Array.isArray(data)) {
      return data
    }

    // Fallback to localStorage
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      const parsed = JSON.parse(local)
      if (Array.isArray(parsed)) {
        // Migrate to IndexedDB
        await set(STORAGE_KEY, parsed)
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to load trips from IndexedDB, trying localStorage:', err)
    try {
      const local = localStorage.getItem(STORAGE_KEY)
      if (local) return JSON.parse(local)
    } catch {
      // ignore
    }
  }

  return []
}

/**
 * Save trips to both IndexedDB and localStorage for maximum resilience
 */
export async function saveTrips(trips: Trip[]): Promise<void> {
  try {
    await set(STORAGE_KEY, trips)
  } catch (err) {
    console.warn('Failed to save to IndexedDB:', err)
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  } catch (err) {
    console.warn('Failed to save to localStorage:', err)
  }
}

/**
 * Export trips to a downloadable JSON file
 */
export function exportTripsToJson(trips: Trip[]): void {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    trips,
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `schengen-trips-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse and validate JSON content for trip import
 */
export function parseTripsJson(jsonContent: string): Trip[] {
  const parsed = JSON.parse(jsonContent)
  const rawList = Array.isArray(parsed) ? parsed : parsed.trips

  if (!Array.isArray(rawList)) {
    throw new Error('Файл не содержит списка поездок')
  }

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
