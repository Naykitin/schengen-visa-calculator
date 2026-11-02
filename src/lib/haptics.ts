/**
 * Web Vibration API helper for touch feedback on mobile devices
 */
export type HapticType = 'light' | 'medium' | 'heavy' | 'warning' | 'error' | 'success'

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined' || !navigator.vibrate) return

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(15)
        break
      case 'medium':
        navigator.vibrate(25)
        break
      case 'heavy':
        navigator.vibrate(40)
        break
      case 'success':
        navigator.vibrate([15, 30, 20])
        break
      case 'warning':
        navigator.vibrate([30, 40, 30])
        break
      case 'error':
        navigator.vibrate([50, 60, 50, 60, 50])
        break
    }
  } catch {
    // Gracefully ignore if browser prohibits vibration
  }
}
