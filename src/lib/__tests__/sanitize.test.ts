import { describe, expect, it } from 'vitest'
import { isValidDateString, safeJsonParse, sanitizeString } from '../sanitize'

describe('Security & Sanitization Helpers', () => {
  it('strips malicious script tags and HTML brackets from strings', () => {
    const malicious = '<script>alert("xss")</script>Hello & welcome!'
    const cleaned = sanitizeString(malicious)
    expect(cleaned).not.toContain('<script>')
    expect(cleaned).toContain('Hello')
  })

  it('validates strictly formatted calendar date strings', () => {
    expect(isValidDateString('2026-05-15')).toBe(true)
    expect(isValidDateString('2026-02-28')).toBe(true)
    expect(isValidDateString('2026-02-29')).toBe(false) // 2026 is not a leap year
    expect(isValidDateString('invalid')).toBe(false)
    expect(isValidDateString('2026-13-01')).toBe(false)
    expect(isValidDateString(null)).toBe(false)
  })

  it('neutralizes prototype pollution payloads in JSON parsing', () => {
    const maliciousJson = '{"__proto__": {"isAdmin": true}, "name": "Traveler"}'
    const parsed = safeJsonParse(maliciousJson)
    expect(parsed.name).toBe('Traveler')
    expect((({} as any).isAdmin)).toBeUndefined()
  })
})
