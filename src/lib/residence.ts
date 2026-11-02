import {
  differenceInCalendarDays,
  isAfter,
  isBefore,
  subYears,
  isLeapYear,
} from 'date-fns'
import type { Trip } from './schengen'
import { fromDateString, toDateString } from './schengen'

export interface ResidenceYearSummary {
  year: number
  totalDaysInYear: number
  daysInside: number
  daysOutside: number
  taxTargetDays: number // Default: 183 days
  isTaxResidentSecured: boolean // daysInside >= taxTargetDays
  daysNeededForTax: number // max(0, taxTargetDays - daysInside)
  maxAllowedAbsence: number // totalDaysInYear - taxTargetDays (e.g. 182 days)
  safeRemainingAbsenceDays: number // max(0, maxAllowedAbsence - daysOutside)
  quotaPercent: number // percentage of allowed absence consumed (0-100)
  longestSingleTripDays: number
  hasSingleTripViolation: boolean // Single trip > 183 days (violates 6-month continuous residency)
  tripsInYear: Array<{
    trip: Trip
    daysInThisYear: number
  }>
}

export interface PermanentResidenceSummary {
  fiveYearAbsenceLimitDays: number // 300 days (10 months under EU Directive 2003/109/EC)
  totalAbsenceLast5Years: number
  has5YearOverstay: boolean
  remaining5YearAbsenceAllowance: number
  longestSingleTripLast5Years: number
  has5YearSingleTripViolation: boolean
}

/**
 * Calculate Residence & Tax Residency summary for a given calendar year
 */
export function calculateResidenceYearSummary(
  trips: Trip[],
  year: number = new Date().getFullYear(),
  taxTargetDays: number = 183
): ResidenceYearSummary {
  const isLeap = isLeapYear(new Date(year, 0, 1))
  const totalDaysInYear = isLeap ? 366 : 365
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)

  const abroadDaysInYear = new Set<string>()
  const tripsInYear: Array<{ trip: Trip; daysInThisYear: number }> = []
  let longestSingleTripDays = 0

  for (const trip of trips) {
    const tripStart = fromDateString(trip.entryDate)
    const tripEnd = fromDateString(trip.exitDate)
    const totalTripDuration = differenceInCalendarDays(tripEnd, tripStart) + 1
    if (totalTripDuration > longestSingleTripDays) {
      longestSingleTripDays = totalTripDuration
    }

    // Check overlap with target year
    const overlapStart = isBefore(tripStart, yearStart) ? yearStart : tripStart
    const overlapEnd = isAfter(tripEnd, yearEnd) ? yearEnd : tripEnd

    if (!isAfter(overlapStart, overlapEnd)) {
      const daysCount = differenceInCalendarDays(overlapEnd, overlapStart) + 1
      tripsInYear.push({ trip, daysInThisYear: daysCount })

      let curr = overlapStart
      while (!isAfter(curr, overlapEnd)) {
        abroadDaysInYear.add(toDateString(curr))
        curr = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 1)
      }
    }
  }

  const daysOutside = abroadDaysInYear.size
  const daysInside = Math.max(0, totalDaysInYear - daysOutside)
  const isTaxResidentSecured = daysInside >= taxTargetDays
  const daysNeededForTax = Math.max(0, taxTargetDays - daysInside)
  const maxAllowedAbsence = Math.max(0, totalDaysInYear - taxTargetDays)
  const safeRemainingAbsenceDays = Math.max(0, maxAllowedAbsence - daysOutside)
  const quotaPercent = maxAllowedAbsence > 0
    ? Math.min(100, Math.round((daysOutside / maxAllowedAbsence) * 100))
    : 100

  const hasSingleTripViolation = longestSingleTripDays > 183

  return {
    year,
    totalDaysInYear,
    daysInside,
    daysOutside,
    taxTargetDays,
    isTaxResidentSecured,
    daysNeededForTax,
    maxAllowedAbsence,
    safeRemainingAbsenceDays,
    quotaPercent,
    longestSingleTripDays,
    hasSingleTripViolation,
    tripsInYear,
  }
}

/**
 * Calculate 5-Year Permanent Residence (Larga Duración - EU Directive 2003/109/EC)
 * Max 10 months (300 days) of absence across 5 years, and max 6 months (183 days) per trip.
 */
export function calculatePermanentResidenceSummary(
  trips: Trip[],
  referenceDateStr: string = toDateString(new Date())
): PermanentResidenceSummary {
  const refDate = fromDateString(referenceDateStr)
  const fiveYearsAgo = subYears(refDate, 5)
  const abroadDaysIn5Years = new Set<string>()
  let longestSingleTripLast5Years = 0

  for (const trip of trips) {
    const tripStart = fromDateString(trip.entryDate)
    const tripEnd = fromDateString(trip.exitDate)

    const overlapStart = isBefore(tripStart, fiveYearsAgo) ? fiveYearsAgo : tripStart
    const overlapEnd = isAfter(tripEnd, refDate) ? refDate : tripEnd

    if (!isAfter(overlapStart, overlapEnd)) {
      const tripDuration = differenceInCalendarDays(overlapEnd, overlapStart) + 1
      if (tripDuration > longestSingleTripLast5Years) {
        longestSingleTripLast5Years = tripDuration
      }

      let curr = overlapStart
      while (!isAfter(curr, overlapEnd)) {
        abroadDaysIn5Years.add(toDateString(curr))
        curr = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 1)
      }
    }
  }

  const fiveYearAbsenceLimitDays = 300 // 10 months
  const totalAbsenceLast5Years = abroadDaysIn5Years.size
  const has5YearOverstay = totalAbsenceLast5Years > fiveYearAbsenceLimitDays
  const remaining5YearAbsenceAllowance = Math.max(0, fiveYearAbsenceLimitDays - totalAbsenceLast5Years)
  const has5YearSingleTripViolation = longestSingleTripLast5Years > 183

  return {
    fiveYearAbsenceLimitDays,
    totalAbsenceLast5Years,
    has5YearOverstay,
    remaining5YearAbsenceAllowance,
    longestSingleTripLast5Years,
    has5YearSingleTripViolation,
  }
}

/**
 * Simulate a proposed trip abroad and verify if it respects the tax residency threshold
 */
export function simulateResidenceTrip(
  existingTrips: Trip[],
  proposedEntryDate: string,
  proposedExitDate: string,
  year: number,
  taxTargetDays: number = 183
): {
  isValid: boolean
  durationDays: number
  projectedDaysInside: number
  projectedDaysOutside: number
  exceedsTaxAbsenceLimit: boolean
  exceedsSingleTripLimit: boolean
} {
  const start = fromDateString(proposedEntryDate)
  const end = fromDateString(proposedExitDate)
  const durationDays = differenceInCalendarDays(end, start) + 1

  const simulatedTrip: Trip = {
    id: '__sim__',
    entryDate: proposedEntryDate,
    exitDate: proposedExitDate,
    isPlanned: true,
  }

  const allTrips = [...existingTrips, simulatedTrip]
  const summary = calculateResidenceYearSummary(allTrips, year, taxTargetDays)

  const exceedsTaxAbsenceLimit = !summary.isTaxResidentSecured
  const exceedsSingleTripLimit = durationDays > 183
  const isValid = !exceedsTaxAbsenceLimit && !exceedsSingleTripLimit

  return {
    isValid,
    durationDays,
    projectedDaysInside: summary.daysInside,
    projectedDaysOutside: summary.daysOutside,
    exceedsTaxAbsenceLimit,
    exceedsSingleTripLimit,
  }
}
