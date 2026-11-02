import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isEqual,
  max,
  min,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'

export interface Trip {
  id: string
  entryDate: string // YYYY-MM-DD
  exitDate: string // YYYY-MM-DD
  title?: string
  notes?: string
  isPlanned?: boolean // Planned future trips vs actual past trips
  ongoing?: boolean // Currently abroad / currently in Schengen (open-ended stay)
}

export interface DayStatus {
  date: string // YYYY-MM-DD
  inSchengen: boolean
  daysUsedIn180: number
  isOverstay: boolean
  remainingDays: number
  tripId?: string
}

export interface SchengenSummary {
  referenceDate: string // YYYY-MM-DD
  currentlyInSchengen: boolean
  currentTrip?: Trip
  daysUsedInWindow: number // in [referenceDate - 179, referenceDate]
  daysRemainingToday: number // max(0, 90 - daysUsedInWindow)
  maxContinuousStayRemaining: number // if in Schengen or entering today
  totalTripsCount: number
  hasOverstay: boolean
  firstOverstayDate?: string
  recoveryDates: Array<{
    date: string
    daysGained: number
    explanation: string
  }>
}

export interface SimulationResult {
  isValid: boolean
  entryDate: string
  exitDate: string
  durationDays: number
  firstViolationDate?: string
  maxDaysUsedDuringTrip: number
  dayDetails: Array<{
    date: string
    daysUsed: number
    overstay: boolean
  }>
}

/**
 * Format Date object to YYYY-MM-DD
 */
export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Parse YYYY-MM-DD to Date at midnight UTC/local
 */
export function fromDateString(str: string): Date {
  return startOfDay(parseISO(str))
}

/**
 * Calculates duration of a trip in days (inclusive of both entry and exit dates).
 * If the trip is ongoing, duration is dynamically calculated up to referenceDate (or today).
 */
export function getTripDuration(
  entryDate: string,
  exitDate: string,
  ongoing?: boolean,
  referenceDateStr?: string
): number {
  const start = fromDateString(entryDate)
  let end: Date
  if (ongoing) {
    const today = referenceDateStr ? fromDateString(referenceDateStr) : startOfDay(new Date())
    end = isAfter(start, today) ? start : today
  } else {
    end = fromDateString(exitDate)
  }
  if (isAfter(start, end)) return 0
  return differenceInCalendarDays(end, start) + 1
}

/**
 * Builds a fast lookup Set of all dates (YYYY-MM-DD) spent in Schengen.
 * Handles overlaps cleanly (each day counts once).
 * For ongoing trips, days are dynamically expanded up to referenceDate (or today).
 */
export function buildSchengenDaysMap(
  trips: Trip[],
  referenceDateStr?: string
): Map<string, string> {
  const map = new Map<string, string>() // dateString -> tripId
  const today = referenceDateStr ? fromDateString(referenceDateStr) : startOfDay(new Date())

  for (const trip of trips) {
    if (!trip.entryDate) continue
    const start = fromDateString(trip.entryDate)
    
    let end: Date
    if (trip.ongoing) {
      end = isAfter(start, today) ? start : today
    } else {
      if (!trip.exitDate) continue
      end = fromDateString(trip.exitDate)
    }

    if (isAfter(start, end)) continue

    let curr = start
    while (!isAfter(curr, end)) {
      const dateStr = toDateString(curr)
      map.set(dateStr, trip.id)
      curr = addDays(curr, 1)
    }
  }

  return map
}

/**
 * Calculates how many days were spent in Schengen within the 180-day period
 * ending on `referenceDate`: [referenceDate - 179, referenceDate]
 */
export function countDaysIn180Window(
  referenceDate: string,
  schengenDaysMap: Map<string, string>
): number {
  const refDate = fromDateString(referenceDate)
  const startDate = subDays(refDate, 179) // 180-day window: [refDate - 179, refDate]
  let count = 0

  let curr = startDate
  while (!isAfter(curr, refDate)) {
    if (schengenDaysMap.has(toDateString(curr))) {
      count++
    }
    curr = addDays(curr, 1)
  }

  return count
}

/**
 * Calculate complete status for a given reference date (usually today).
 * Optimized with sliding window $O(1)$ calculations.
 */
export function calculateSchengenSummary(
  trips: Trip[],
  referenceDateStr: string = toDateString(new Date())
): SchengenSummary {
  const refDate = fromDateString(referenceDateStr)
  const daysMap = buildSchengenDaysMap(trips, referenceDateStr)

  // Current window count
  const daysUsedInWindow = countDaysIn180Window(referenceDateStr, daysMap)
  const daysRemainingToday = Math.max(0, 90 - daysUsedInWindow)
  const currentlyInSchengen = daysMap.has(referenceDateStr)

  const currentTrip = currentlyInSchengen
    ? trips.find(t => {
        const start = fromDateString(t.entryDate)
        const end = t.ongoing
          ? (isAfter(start, refDate) ? start : refDate)
          : fromDateString(t.exitDate)
        return (
          (isEqual(refDate, start) || isAfter(refDate, start)) &&
          (isEqual(refDate, end) || isBefore(refDate, end))
        )
      })
    : undefined

  // Check if any overstay occurred historically
  let hasOverstay = false
  let firstOverstayDate: string | undefined

  if (trips.length > 0) {
    const allStartDates = trips.map(t => fromDateString(t.entryDate))
    const allEndDates = trips.map(t => {
      if (t.ongoing) {
        const start = fromDateString(t.entryDate)
        return isAfter(start, refDate) ? start : refDate
      }
      return fromDateString(t.exitDate)
    })
    const minDate = min(allStartDates)
    const maxDate = max(allEndDates)

    let scanDate = minDate
    let currentWindowCount = countDaysIn180Window(toDateString(scanDate), daysMap)

    while (!isAfter(scanDate, maxDate)) {
      if (currentWindowCount > 90) {
        hasOverstay = true
        if (!firstOverstayDate) {
          firstOverstayDate = toDateString(scanDate)
        }
        break
      }

      // Slide window forward by 1 day: O(1) step
      const nextDate = addDays(scanDate, 1)
      const droppingDate = subDays(nextDate, 180)
      if (daysMap.has(toDateString(nextDate))) currentWindowCount++
      if (daysMap.has(toDateString(droppingDate))) currentWindowCount--

      scanDate = nextDate
    }
  }

  // Calculate maximum continuous stay starting today using O(1) sliding window
  let maxContinuousStayRemaining = 0
  if (daysRemainingToday > 0) {
    const simulatedDaysMap = new Map(daysMap)
    let simDate = refDate
    let runningWindow = daysUsedInWindow

    // If today is not in Schengen, staying today adds 1
    if (!daysMap.has(referenceDateStr)) {
      runningWindow++
      simulatedDaysMap.set(referenceDateStr, 'simulation')
    }

    if (runningWindow <= 90) {
      maxContinuousStayRemaining = 1
      let nextSimDate = addDays(simDate, 1)

      while (maxContinuousStayRemaining < 90) {
        const nextSimStr = toDateString(nextSimDate)
        const droppingDateStr = toDateString(subDays(nextSimDate, 180))

        simulatedDaysMap.set(nextSimStr, 'simulation')
        runningWindow++ // nextSimDate is in stay
        if (simulatedDaysMap.has(droppingDateStr)) {
          runningWindow--
        }

        if (runningWindow > 90) {
          break
        }

        maxContinuousStayRemaining++
        nextSimDate = addDays(nextSimDate, 1)
      }
    }
  }

  // Calculate recovery dates: when old days drop out of the 180-day window
  const recoveryDates: Array<{
    date: string
    daysGained: number
    explanation: string
  }> = []

  const maxFuture = addDays(refDate, 180)

  // Map of date -> drop date (date + 180)
  for (const [stayDateStr] of daysMap) {
    const stayDate = fromDateString(stayDateStr)
    const dropDate = addDays(stayDate, 180)
    if (isAfter(dropDate, refDate) && !isAfter(dropDate, maxFuture)) {
      const dropDateStr = toDateString(dropDate)
      const existing = recoveryDates.find(r => r.date === dropDateStr)
      if (existing) {
        existing.daysGained += 1
      } else {
        recoveryDates.push({
          date: dropDateStr,
          daysGained: 1,
          explanation: `Day from ${stayDateStr} drops out of the 180-day window`,
        })
      }
    }
  }

  recoveryDates.sort((a, b) => a.date.localeCompare(b.date))

  return {
    referenceDate: referenceDateStr,
    currentlyInSchengen,
    currentTrip,
    daysUsedInWindow,
    daysRemainingToday,
    maxContinuousStayRemaining,
    totalTripsCount: trips.length,
    hasOverstay,
    firstOverstayDate,
    recoveryDates: recoveryDates.slice(0, 5),
  }
}

/**
 * Simulate a proposed trip using O(1) sliding window progression.
 */
export function simulateTrip(
  existingTrips: Trip[],
  proposedEntryDate: string,
  proposedExitDate: string,
  excludeTripId?: string,
  prebuiltDaysMap?: Map<string, string>
): SimulationResult {
  let daysMap: Map<string, string>

  if (prebuiltDaysMap && !excludeTripId) {
    daysMap = new Map(prebuiltDaysMap)
    let d = fromDateString(proposedEntryDate)
    const end = fromDateString(proposedExitDate)
    while (!isAfter(d, end)) {
      daysMap.set(toDateString(d), '__simulation__')
      d = addDays(d, 1)
    }
  } else {
    const filteredTrips = excludeTripId
      ? existingTrips.filter(t => t.id !== excludeTripId)
      : existingTrips

    const proposedTrip: Trip = {
      id: '__simulation__',
      entryDate: proposedEntryDate,
      exitDate: proposedExitDate,
    }

    const allTrips = [...filteredTrips, proposedTrip]
    daysMap = buildSchengenDaysMap(allTrips)
  }

  const start = fromDateString(proposedEntryDate)
  const end = fromDateString(proposedExitDate)
  const duration = getTripDuration(proposedEntryDate, proposedExitDate)

  let isValid = true
  let firstViolationDate: string | undefined
  let maxDaysUsedDuringTrip = 0
  const dayDetails: Array<{
    date: string
    daysUsed: number
    overstay: boolean
  }> = []

  // Initialize count for first day
  let curr = start
  let currentWindowCount = countDaysIn180Window(toDateString(curr), daysMap)

  while (!isAfter(curr, end)) {
    const dateStr = toDateString(curr)
    maxDaysUsedDuringTrip = Math.max(maxDaysUsedDuringTrip, currentWindowCount)

    const overstay = currentWindowCount > 90
    if (overstay) {
      isValid = false
      if (!firstViolationDate) {
        firstViolationDate = dateStr
      }
    }

    dayDetails.push({
      date: dateStr,
      daysUsed: currentWindowCount,
      overstay,
    })

    // Advance to next day using O(1) sliding window
    const nextDate = addDays(curr, 1)
    if (!isAfter(nextDate, end)) {
      const dropDateStr = toDateString(subDays(nextDate, 180))
      const nextDateStr = toDateString(nextDate)

      if (daysMap.has(nextDateStr)) currentWindowCount++
      if (daysMap.has(dropDateStr)) currentWindowCount--
    }

    curr = nextDate
  }

  return {
    isValid,
    entryDate: proposedEntryDate,
    exitDate: proposedExitDate,
    durationDays: duration,
    firstViolationDate,
    maxDaysUsedDuringTrip,
    dayDetails,
  }
}

/**
 * Find earliest entry date for a stay of `durationDays` starting search from `startDate`.
 * Scans forward up to 365 days with rapid early-exit verification.
 */
export function findEarliestEntryDate(
  trips: Trip[],
  durationDays: number,
  startDateStr: string = toDateString(new Date())
): { found: boolean; entryDate?: string; exitDate?: string } {
  if (durationDays <= 0 || durationDays > 90) {
    return { found: false }
  }

  const existingDaysMap = buildSchengenDaysMap(trips)
  let candidateDate = fromDateString(startDateStr)
  const limitDate = addDays(candidateDate, 365)

  while (!isAfter(candidateDate, limitDate)) {
    const entryStr = toDateString(candidateDate)
    const exitStr = toDateString(addDays(candidateDate, durationDays - 1))

    const sim = simulateTrip(trips, entryStr, exitStr, undefined, existingDaysMap)
    if (sim.isValid) {
      return {
        found: true,
        entryDate: entryStr,
        exitDate: exitStr,
      }
    }

    candidateDate = addDays(candidateDate, 1)
  }

  return { found: false }
}
