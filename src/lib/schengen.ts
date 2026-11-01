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
 * Calculates duration of a trip in days (inclusive of both entry and exit dates)
 */
export function getTripDuration(entryDate: string, exitDate: string): number {
  const start = fromDateString(entryDate)
  const end = fromDateString(exitDate)
  if (isAfter(start, end)) return 0
  return differenceInCalendarDays(end, start) + 1
}

/**
 * Builds a fast lookup Set of all dates (YYYY-MM-DD) spent in Schengen.
 * Handles overlaps cleanly (each day counts once).
 */
export function buildSchengenDaysMap(trips: Trip[]): Map<string, string> {
  const map = new Map<string, string>() // dateString -> tripId

  for (const trip of trips) {
    if (!trip.entryDate || !trip.exitDate) continue
    const start = fromDateString(trip.entryDate)
    const end = fromDateString(trip.exitDate)
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
 */
export function calculateSchengenSummary(
  trips: Trip[],
  referenceDateStr: string = toDateString(new Date())
): SchengenSummary {
  const refDate = fromDateString(referenceDateStr)
  const daysMap = buildSchengenDaysMap(trips)

  // Current window count
  const daysUsedInWindow = countDaysIn180Window(referenceDateStr, daysMap)
  const daysRemainingToday = Math.max(0, 90 - daysUsedInWindow)
  const currentlyInSchengen = daysMap.has(referenceDateStr)

  const currentTrip = currentlyInSchengen
    ? trips.find(t => {
        const start = fromDateString(t.entryDate)
        const end = fromDateString(t.exitDate)
        return (
          (isEqual(refDate, start) || isAfter(refDate, start)) &&
          (isEqual(refDate, end) || isBefore(refDate, end))
        )
      })
    : undefined

  // Check if any overstay occurred historically or in planned trips
  let hasOverstay = false
  let firstOverstayDate: string | undefined

  // Look through all trip dates to verify if 90 limit was exceeded anywhere
  if (trips.length > 0) {
    const allStartDates = trips.map(t => fromDateString(t.entryDate))
    const allEndDates = trips.map(t => fromDateString(t.exitDate))
    const minDate = min(allStartDates)
    const maxDate = max(allEndDates)

    let scanDate = minDate
    while (!isAfter(scanDate, maxDate)) {
      const scanDateStr = toDateString(scanDate)
      const used = countDaysIn180Window(scanDateStr, daysMap)
      if (used > 90) {
        hasOverstay = true
        if (!firstOverstayDate) {
          firstOverstayDate = scanDateStr
        }
        break
      }
      scanDate = addDays(scanDate, 1)
    }
  }

  // Calculate maximum continuous stay starting today (or remaining in current stay)
  let maxContinuousStayRemaining = 0
  if (daysRemainingToday > 0) {
    // Simulate staying day by day from reference date forward
    const simulatedDaysMap = new Map(daysMap)
    let simDate = refDate

    while (maxContinuousStayRemaining < 90) {
      const simDateStr = toDateString(simDate)
      simulatedDaysMap.set(simDateStr, 'simulation')
      const windowCount = countDaysIn180Window(simDateStr, simulatedDaysMap)
      if (windowCount > 90) {
        break
      }
      maxContinuousStayRemaining++
      simDate = addDays(simDate, 1)
    }
  }

  // Calculate recovery dates: when old days drop out of the 180-day window
  // Looking up to 180 days ahead
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
    recoveryDates: recoveryDates.slice(0, 5), // top 5 upcoming days
  }
}

/**
 * Simulate a proposed trip to see if it violates the 90/180 rule.
 */
export function simulateTrip(
  existingTrips: Trip[],
  proposedEntryDate: string,
  proposedExitDate: string,
  excludeTripId?: string
): SimulationResult {
  const filteredTrips = excludeTripId
    ? existingTrips.filter(t => t.id !== excludeTripId)
    : existingTrips

  const proposedTrip: Trip = {
    id: '__simulation__',
    entryDate: proposedEntryDate,
    exitDate: proposedExitDate,
  }

  const allTrips = [...filteredTrips, proposedTrip]
  const daysMap = buildSchengenDaysMap(allTrips)

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

  let curr = start
  while (!isAfter(curr, end)) {
    const dateStr = toDateString(curr)
    const daysUsed = countDaysIn180Window(dateStr, daysMap)
    maxDaysUsedDuringTrip = Math.max(maxDaysUsedDuringTrip, daysUsed)

    const overstay = daysUsed > 90
    if (overstay) {
      isValid = false
      if (!firstViolationDate) {
        firstViolationDate = dateStr
      }
    }

    dayDetails.push({
      date: dateStr,
      daysUsed,
      overstay,
    })

    curr = addDays(curr, 1)
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
 * Find the earliest entry date for a stay of `durationDays` starting search from `startDate`.
 * Scans forward up to 365 days.
 */
export function findEarliestEntryDate(
  trips: Trip[],
  durationDays: number,
  startDateStr: string = toDateString(new Date())
): { found: boolean; entryDate?: string; exitDate?: string } {
  if (durationDays <= 0 || durationDays > 90) {
    return { found: false }
  }

  let candidateDate = fromDateString(startDateStr)
  const limitDate = addDays(candidateDate, 365)

  while (!isAfter(candidateDate, limitDate)) {
    const entryStr = toDateString(candidateDate)
    const exitStr = toDateString(addDays(candidateDate, durationDays - 1))

    const sim = simulateTrip(trips, entryStr, exitStr)
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
