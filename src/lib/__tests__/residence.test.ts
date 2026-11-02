import { describe, it, expect } from 'vitest'
import {
  calculateResidenceYearSummary,
  calculatePermanentResidenceSummary,
  simulateResidenceTrip,
} from '../residence'
import type { Trip } from '../schengen'

describe('EU Residence & Tax Calculation Engine', () => {
  const userTrips2026: Trip[] = [
    {
      id: 'trip_1',
      entryDate: '2026-03-06',
      exitDate: '2026-05-05', // 61 days
      title: 'Alicante — Paderborn',
    },
    {
      id: 'trip_2',
      entryDate: '2026-05-12',
      exitDate: '2026-06-08', // 28 days
      title: 'Alicante — Weeze',
    },
    {
      id: 'trip_3',
      entryDate: '2026-07-02',
      exitDate: '2026-08-28', // 58 days
      title: 'Alicante — Cologne',
    },
  ]

  it('correctly calculates user 2026 trips for Spanish Autónomo & Tax residency', () => {
    const summary = calculateResidenceYearSummary(userTrips2026, 2026, 183)

    expect(summary.totalDaysInYear).toBe(365) // 2026 is non-leap year
    expect(summary.daysOutside).toBe(147)     // 61 + 28 + 58 = 147
    expect(summary.daysInside).toBe(218)      // 365 - 147 = 218
    expect(summary.isTaxResidentSecured).toBe(true) // 218 >= 183
    expect(summary.daysNeededForTax).toBe(0)
    expect(summary.maxAllowedAbsence).toBe(182) // 365 - 183 = 182
    expect(summary.safeRemainingAbsenceDays).toBe(35) // 182 - 147 = 35
    expect(summary.hasSingleTripViolation).toBe(false)
  })

  it('correctly handles leap years (e.g. 2024)', () => {
    const summary = calculateResidenceYearSummary([], 2024, 183)
    expect(summary.totalDaysInYear).toBe(366)
    expect(summary.daysInside).toBe(366)
    expect(summary.maxAllowedAbsence).toBe(183) // 366 - 183 = 183
  })

  it('accurately clips trips that span across calendar year boundaries', () => {
    const crossYearTrip: Trip[] = [
      {
        id: 'cross_trip',
        entryDate: '2025-12-20',
        exitDate: '2026-01-10', // 12 days in 2025 (Dec 20-31), 10 days in 2026 (Jan 1-10)
      },
    ]

    const summary2025 = calculateResidenceYearSummary(crossYearTrip, 2025)
    expect(summary2025.daysOutside).toBe(12)
    expect(summary2025.daysInside).toBe(353)

    const summary2026 = calculateResidenceYearSummary(crossYearTrip, 2026)
    expect(summary2026.daysOutside).toBe(10)
    expect(summary2026.daysInside).toBe(355)
  })

  it('correctly calculates 5-year EU Permanent Residence (10-month limit)', () => {
    const permSummary = calculatePermanentResidenceSummary(userTrips2026, '2026-11-02')

    expect(permSummary.fiveYearAbsenceLimitDays).toBe(300)
    expect(permSummary.totalAbsenceLast5Years).toBe(147)
    expect(permSummary.has5YearOverstay).toBe(false)
    expect(permSummary.remaining5YearAbsenceAllowance).toBe(153) // 300 - 147 = 153
    expect(permSummary.has5YearSingleTripViolation).toBe(false)
  })

  it('detects single trip exceeding 6 months continuous absence', () => {
    const longTrip: Trip[] = [
      {
        id: 'long',
        entryDate: '2026-01-01',
        exitDate: '2026-07-15', // 196 days (> 183)
      },
    ]

    const summary = calculateResidenceYearSummary(longTrip, 2026)
    expect(summary.hasSingleTripViolation).toBe(true)
    expect(summary.isTaxResidentSecured).toBe(false)
  })

  it('simulates proposed trips against annual tax residency allowance', () => {
    // 35 days remaining. Proposed 30-day trip should be valid.
    const simSafe = simulateResidenceTrip(userTrips2026, '2026-10-01', '2026-10-30', 2026, 183)
    expect(simSafe.isValid).toBe(true)
    expect(simSafe.exceedsTaxAbsenceLimit).toBe(false)

    // Proposed 50-day trip exceeds remaining 35 days
    const simExceed = simulateResidenceTrip(userTrips2026, '2026-10-01', '2026-11-19', 2026, 183)
    expect(simExceed.isValid).toBe(false)
    expect(simExceed.exceedsTaxAbsenceLimit).toBe(true)
  })
})
