import { describe, expect, it } from 'vitest'
import {
  calculateSchengenSummary,
  countDaysIn180Window,
  findEarliestEntryDate,
  getTripDuration,
  simulateTrip,
  buildSchengenDaysMap,
  type Trip,
} from '../schengen'

describe('Schengen 90/180 calculation engine', () => {
  it('correctly calculates single-day trip duration as 1 day', () => {
    expect(getTripDuration('2026-06-01', '2026-06-01')).toBe(1)
  })

  it('correctly calculates multi-day trip duration inclusive of entry and exit', () => {
    // 2026-06-01 to 2026-06-10 is 10 days
    expect(getTripDuration('2026-06-01', '2026-06-10')).toBe(10)
  })

  it('correctly handles empty trips list', () => {
    const summary = calculateSchengenSummary([], '2026-07-01')
    expect(summary.daysUsedInWindow).toBe(0)
    expect(summary.daysRemainingToday).toBe(90)
    expect(summary.currentlyInSchengen).toBe(false)
    expect(summary.hasOverstay).toBe(false)
  })

  it('accurately counts exactly 90 days of continuous stay', () => {
    const trips: Trip[] = [
      {
        id: '1',
        entryDate: '2026-01-01',
        exitDate: '2026-03-31', // Jan 31 + Feb 28 + Mar 31 = 90 days in 2026
      },
    ]
    expect(getTripDuration('2026-01-01', '2026-03-31')).toBe(90)

    const summary = calculateSchengenSummary(trips, '2026-03-31')
    expect(summary.daysUsedInWindow).toBe(90)
    expect(summary.daysRemainingToday).toBe(0)
    expect(summary.hasOverstay).toBe(false)
  })

  it('flags overstay when continuous stay exceeds 90 days', () => {
    const trips: Trip[] = [
      {
        id: '1',
        entryDate: '2026-01-01',
        exitDate: '2026-04-01', // 91 days
      },
    ]
    const summary = calculateSchengenSummary(trips, '2026-04-01')
    expect(summary.hasOverstay).toBe(true)
    expect(summary.firstOverstayDate).toBe('2026-04-01')
  })

  it('restores days when older trips fall outside 180-day sliding window', () => {
    // Trip from 200 days ago (30 days long)
    // 2026-01-01 to 2026-01-30 is 30 days
    const trips: Trip[] = [
      {
        id: 'old_trip',
        entryDate: '2026-01-01',
        exitDate: '2026-01-30',
      },
    ]

    // Reference date 2026-08-01:
    // 180-day window ending on 2026-08-01 starts on 2026-02-03
    // The January trip is completely outside the 180-day window!
    const summary = calculateSchengenSummary(trips, '2026-08-01')
    expect(summary.daysUsedInWindow).toBe(0)
    expect(summary.daysRemainingToday).toBe(90)
  })

  it('simulates proposed trip and reports legality accurately', () => {
    const existingTrips: Trip[] = [
      {
        id: '1',
        entryDate: '2026-05-01',
        exitDate: '2026-05-30', // 30 days
      },
    ]

    // Proposed trip: 2026-06-15 to 2026-07-14 (30 days) -> total 60 days in window -> valid
    const validSim = simulateTrip(existingTrips, '2026-06-15', '2026-07-14')
    expect(validSim.isValid).toBe(true)
    expect(validSim.maxDaysUsedDuringTrip).toBe(60)

    // Proposed trip: 70 days -> total 30 + 70 = 100 days -> invalid overstay
    const invalidSim = simulateTrip(existingTrips, '2026-06-15', '2026-08-23')
    expect(invalidSim.isValid).toBe(false)
    expect(invalidSim.firstViolationDate).toBeDefined()
  })

  it('finds earliest entry date for planned duration', () => {
    // User already spent 90 days: 2026-01-01 to 2026-03-31
    const trips: Trip[] = [
      {
        id: '1',
        entryDate: '2026-01-01',
        exitDate: '2026-03-31', // 90 days
      },
    ]

    // If user wants to enter for 10 days starting from 2026-04-01
    // The earliest date will be when at least 10 days roll out of the 180-day window
    const earliest = findEarliestEntryDate(trips, 10, '2026-04-01')
    expect(earliest.found).toBe(true)
    expect(earliest.entryDate).toBeDefined()
    expect(earliest.entryDate! >= '2026-06-30').toBe(true)
  })
})
