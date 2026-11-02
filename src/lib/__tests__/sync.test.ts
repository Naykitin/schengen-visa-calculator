import { describe, expect, it } from 'vitest'
import { generateSyncKey, buildPairingUrl } from '../sync'

describe('Cloudflare Sync Utilities', () => {
  it('generates valid sync key matching expected pattern', () => {
    const key = generateSyncKey()
    expect(key).toBeDefined()
    expect(key.startsWith('vg_')).toBe(true)
    expect(key.length).toBe(27) // 'vg_' + 24 hex characters
    expect(/^[a-zA-Z0-9_-]{10,64}$/.test(key)).toBe(true)
  })

  it('generates unique sync keys on consecutive calls', () => {
    const key1 = generateSyncKey()
    const key2 = generateSyncKey()
    expect(key1).not.toBe(key2)
  })

  it('constructs correct pairing URL with token', () => {
    const key = 'vg_1234567890abcdef12345678'
    const pairingUrl = buildPairingUrl(key)
    expect(pairingUrl).toContain(`?sync=${key}`)
  })

  it('validates sync key length and alphanumeric constraints', () => {
    const validKey = 'vg_840d1dd48cc4910feccd009b'
    const shortKey = 'vg_123'
    const invalidCharKey = 'vg_840d1dd48cc4910feccd009b<script>'

    const pattern = /^[a-zA-Z0-9_-]{10,64}$/
    expect(pattern.test(validKey)).toBe(true)
    expect(pattern.test(shortKey)).toBe(false)
    expect(pattern.test(invalidCharKey)).toBe(false)
  })
})
