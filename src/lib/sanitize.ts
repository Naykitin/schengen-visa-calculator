/**
 * Input sanitization and data validation helper
 * Protects against XSS, Prototype Pollution, and malformed inputs
 */

/**
 * Strips HTML tags and script elements from user-provided strings
 */
export function sanitizeString(input: unknown, maxLength: number = 200): string {
  if (typeof input !== 'string') return ''
  
  // Strip control characters, script tags, and HTML brackets
  const cleaned = input
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '"': return '&quot;'
        case "'": return '&#39;'
        case '&': return '&amp;'
        default: return ''
      }
    })
    .trim()

  return cleaned.slice(0, maxLength)
}

/**
 * Validates ISO date string format (YYYY-MM-DD) with calendar boundary checks
 */
export function isValidDateString(dateStr: unknown): boolean {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false
  }

  const [y, m, d] = dateStr.split('-').map(Number)
  if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
    return false
  }

  const date = new Date(y, m - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  )
}

/**
 * Prototype pollution safe JSON parser
 */
export function safeJsonParse<T = any>(jsonString: string): T {
  return JSON.parse(jsonString, (key, value) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return undefined // Drop prototype poisoning attempts
    }
    return value
  })
}
