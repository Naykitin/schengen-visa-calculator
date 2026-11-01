import { useState, useEffect } from 'react'

export function useServiceWorker() {
  const [hasUpdate, setHasUpdate] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        setRegistration(reg)

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setHasUpdate(true)
            }
          })
        })
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err)
      })

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  const reloadApp = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    } else {
      window.location.reload()
    }
  }

  return { hasUpdate, reloadApp }
}
