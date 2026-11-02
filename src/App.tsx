import { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react'
import {
  CalendarDays,
  Compass,
  ExternalLink,
  ListFilter,
  Plus,
} from 'lucide-react'
import { Header } from './components/Header'
import { StatusCard } from './components/StatusCard'
import { TripList } from './components/TripList'
import { PlannerView } from './components/PlannerView'
import { CalendarView } from './components/CalendarView'
import type { Trip } from './lib/schengen'
import type { Language } from './lib/i18n'
import { translations } from './lib/i18n'
import {
  calculateSchengenSummary,
  toDateString,
} from './lib/schengen'
import type { AppStorageData, Profile, ProfileMode } from './lib/storage'
import {
  loadAppStorage,
  requestPersistentStorage,
  saveAppStorage,
  EU_COUNTRIES,
} from './lib/storage'
import { triggerHaptic } from './lib/haptics'
import { useNetworkStatus } from './lib/useNetworkStatus'
import { useServiceWorker } from './lib/useServiceWorker'
import {
  extractSyncKeyFromUrl,
  fetchRemoteVault,
  generateSyncKey,
  loadSyncPreferences,
  pushLocalVault,
  saveSyncPreferences,
} from './lib/sync'
import { subDays } from 'date-fns'

// Lazy-loaded modal components for maximum initial load performance (Core Web Vitals)
const TripModal = lazy(() => import('./components/TripModal').then((m) => ({ default: m.TripModal })))
const BackupModal = lazy(() => import('./components/BackupModal').then((m) => ({ default: m.BackupModal })))
const ProfileModal = lazy(() => import('./components/ProfileModal').then((m) => ({ default: m.ProfileModal })))
const SyncModal = lazy(() => import('./components/SyncModal').then((m) => ({ default: m.SyncModal })))
const InfoModal = lazy(() => import('./components/InfoModal').then((m) => ({ default: m.InfoModal })))

const INITIAL_STORAGE: AppStorageData = {
  version: '2.1',
  activeProfileId: 'default_profile',
  profiles: [
    {
      id: 'default_profile',
      name: 'My Passport',
      color: 'blue',
      mode: 'schengen',
      country: 'ES',
      taxTargetDays: 183,
      customAbsenceLimit: 182,
      trips: [],
    },
  ],
}

export function App() {
  const [appData, setAppData] = useState<AppStorageData>(INITIAL_STORAGE)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Internationalization: persistent language choice with browser fallback
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('schengen_language') as Language
      if (saved && ['en', 'uk', 'de', 'fr', 'pl'].includes(saved)) {
        return saved
      }
      const nav = navigator.language?.toLowerCase() || ''
      if (nav.startsWith('uk')) return 'uk'
      if (nav.startsWith('de')) return 'de'
      if (nav.startsWith('fr')) return 'fr'
      if (nav.startsWith('pl')) return 'pl'
    }
    return 'en'
  })

  const t = translations[lang]

  // Network and Service Worker hooks
  const isOnline = useNetworkStatus()
  const { hasUpdate, reloadApp } = useServiceWorker()

  // Cloudflare Sync state
  const [syncKey, setSyncKey] = useState<string | null>(null)
  const [autoSync, setAutoSync] = useState<boolean>(true)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const autoSyncTimeoutRef = useRef<any>(null)

  // Active view date and state
  const [referenceDate, setReferenceDate] = useState(() => toDateString(new Date()))
  const [activeTab, setActiveTab] = useState<'trips' | 'planner' | 'calendar'>('trips')
  const [desktopSideTab, setDesktopSideTab] = useState<'planner' | 'calendar'>('planner')

  // Modals state
  const [isTripModalOpen, setIsTripModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)

  // Initialize storage & auto-request persistence & sync preferences
  useEffect(() => {
    async function init() {
      const storedData = await loadAppStorage(t.myPassport)
      const prefs = loadSyncPreferences()
      
      setAppData(storedData)
      setSyncKey(prefs.syncKey)
      setAutoSync(prefs.autoSync)
      setLastSyncTime(prefs.lastSyncTime)
      setIsLoaded(true)
      requestPersistentStorage().catch(() => {})

      // Check if URL has ?sync=... pairing key
      const urlSyncKey = extractSyncKeyFromUrl()
      if (urlSyncKey) {
        handleConnectSyncKey(urlSyncKey)
      } else if (prefs.syncKey && prefs.autoSync && navigator.onLine) {
        // Initial background pull from Cloudflare D1
        syncWithCloud(prefs.syncKey, storedData)
      }
    }
    init()
  }, [])

  // Auto-save whenever appData changes
  useEffect(() => {
    if (isLoaded) {
      saveAppStorage(appData)

      // Debounced auto-push to Cloudflare D1 if sync is active
      if (syncKey && autoSync && isOnline) {
        if (autoSyncTimeoutRef.current) clearTimeout(autoSyncTimeoutRef.current)
        autoSyncTimeoutRef.current = setTimeout(() => {
          syncWithCloud(syncKey, appData)
        }, 1500)
      }
    }
  }, [appData, isLoaded, syncKey, autoSync, isOnline])

  // Core Cloudflare Sync handler
  const syncWithCloud = useCallback(
    async (key: string, currentData: AppStorageData) => {
      setIsSyncing(true)
      setSyncError(null)

      try {
        const pushResult = await pushLocalVault(key, currentData)

        if (pushResult.conflict && pushResult.remoteData) {
          // Conflict: Remote database was newer, update local state
          setAppData(pushResult.remoteData)
          setLastSyncTime(pushResult.remoteUpdatedAt || Date.now())
          saveSyncPreferences(key, autoSync, pushResult.remoteUpdatedAt || Date.now())
        } else {
          const now = Date.now()
          setLastSyncTime(now)
          saveSyncPreferences(key, autoSync, now)
        }
      } catch (err: any) {
        console.warn('Sync error:', err)
        setSyncError(err.message || 'Sync failed')
      } finally {
        setIsSyncing(false)
      }
    },
    [autoSync]
  )

  const handleManualSync = () => {
    if (!syncKey) return
    triggerHaptic('light')
    syncWithCloud(syncKey, appData)
  }

  const handleEnableNewSyncKey = async () => {
    const newKey = generateSyncKey()
    setSyncKey(newKey)
    saveSyncPreferences(newKey, true, Date.now())
    triggerHaptic('medium')
    syncWithCloud(newKey, appData)
  }

  const handleConnectSyncKey = async (key: string) => {
    setIsSyncing(true)
    setSyncError(null)
    triggerHaptic('medium')

    try {
      const remoteData = await fetchRemoteVault(key)
      if (remoteData && remoteData.payload) {
        setAppData(remoteData.payload)
        setSyncKey(key)
        setLastSyncTime(remoteData.updatedAt)
        saveSyncPreferences(key, true, remoteData.updatedAt)
      }
    } catch (err: any) {
      setSyncError(err.message || 'Failed to connect sync key')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleToggleAutoSync = (enabled: boolean) => {
    setAutoSync(enabled)
    if (syncKey) {
      saveSyncPreferences(syncKey, enabled, lastSyncTime)
    }
    triggerHaptic('light')
  }

  const handleDisconnectSync = () => {
    setSyncKey(null)
    setLastSyncTime(null)
    saveSyncPreferences(null, false, null)
    triggerHaptic('warning')
  }

  // Active profile trips
  const activeProfile =
    appData.profiles.find((p) => p.id === appData.activeProfileId) || appData.profiles[0]
  const currentTrips = activeProfile.trips || []
  const isResidentMode = activeProfile.mode === 'eu_resident'
  const countryObj = EU_COUNTRIES.find((c) => c.code === (activeProfile.country || 'ES')) || EU_COUNTRIES[0]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isTripModalOpen ||
        isBackupModalOpen ||
        isInfoModalOpen ||
        isProfileModalOpen ||
        isSyncModalOpen
      ) {
        return
      }

      if (e.key === 'n' || e.key === 'N' || e.key === 'т' || e.key === 'Т') {
        e.preventDefault()
        handleAddTrip()
      } else if (e.key === '1') {
        setActiveTab('trips')
      } else if (e.key === '2') {
        setActiveTab('planner')
        setDesktopSideTab('planner')
      } else if (e.key === '3') {
        setActiveTab('calendar')
        setDesktopSideTab('calendar')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTripModalOpen, isBackupModalOpen, isInfoModalOpen, isProfileModalOpen, isSyncModalOpen])

  // Calculate live summary for current active profile trips (Schengen 90/180)
  const summary = calculateSchengenSummary(currentTrips, referenceDate)

  // Trigger warning haptic if an overstay is detected in tourist mode
  useEffect(() => {
    if (!isResidentMode && summary.hasOverstay) {
      triggerHaptic('warning')
    }
  }, [summary.hasOverstay, isResidentMode])

  // Language Selection
  const handleSelectLanguage = (newLang: Language) => {
    setLang(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('schengen_language', newLang)
    }
    triggerHaptic('light')
  }

  // Profile operations
  const handleSelectProfile = (profileId: string) => {
    setAppData((prev) => ({ ...prev, activeProfileId: profileId }))
  }

  const handleAddProfile = (
    name: string,
    color: string,
    mode: ProfileMode = 'schengen',
    country: string = 'ES'
  ) => {
    const newProfile: Profile = {
      id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      color,
      mode,
      country,
      taxTargetDays: 183,
      customAbsenceLimit: 182,
      trips: [],
    }
    setAppData((prev) => ({
      ...prev,
      activeProfileId: newProfile.id,
      profiles: [...prev.profiles, newProfile],
    }))
  }

  const handleUpdateProfile = (profileId: string, updates: Partial<Profile>) => {
    setAppData((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === profileId ? { ...p, ...updates } : p)),
    }))
  }

  const handleDeleteProfile = (profileId: string) => {
    setAppData((prev) => {
      if (prev.profiles.length <= 1) return prev
      const remainingProfiles = prev.profiles.filter((p) => p.id !== profileId)
      const newActiveId =
        prev.activeProfileId === profileId ? remainingProfiles[0].id : prev.activeProfileId
      return {
        ...prev,
        activeProfileId: newActiveId,
        profiles: remainingProfiles,
      }
    })
  }

  // Trip operations on active profile
  const updateCurrentProfileTrips = (updater: (trips: Trip[]) => Trip[]) => {
    setAppData((prev) => {
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === prev.activeProfileId) {
          return { ...p, trips: updater(p.trips) }
        }
        return p
      })
      return { ...prev, profiles: updatedProfiles }
    })
  }

  const handleSaveTrip = (trip: Trip) => {
    triggerHaptic('medium')
    updateCurrentProfileTrips((trips) => {
      const exists = trips.some((t) => t.id === trip.id)
      if (exists) {
        return trips.map((t) => (t.id === trip.id ? trip : t))
      }
      return [...trips, trip]
    })
    setIsTripModalOpen(false)
    setEditingTrip(null)
  }

  const handleDeleteTrip = (tripId: string) => {
    triggerHaptic('medium')
    updateCurrentProfileTrips((trips) => trips.filter((t) => t.id !== tripId))
  }

  const handleEditTrip = (trip: Trip) => {
    triggerHaptic('light')
    setEditingTrip(trip)
    setIsTripModalOpen(true)
  }

  const handleAddTrip = () => {
    triggerHaptic('light')
    setEditingTrip(null)
    setIsTripModalOpen(true)
  }

  const handleStartOngoingTrip = (entryDate: string, title: string, notes: string) => {
    triggerHaptic('success')
    const todayStr = toDateString(new Date())
    const effectiveExit = entryDate > todayStr ? entryDate : todayStr

    const newTrip: Trip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryDate,
      exitDate: effectiveExit,
      title: title || undefined,
      notes: notes || undefined,
      isPlanned: false,
      ongoing: true,
    }

    // End any previously active ongoing trip, and append new active one
    updateCurrentProfileTrips((trips) => [
      ...trips.map((t) => (t.ongoing ? { ...t, ongoing: false, exitDate: effectiveExit } : t)),
      newTrip,
    ])
  }

  const handleEndOngoingTrip = (tripId: string, returnDate?: string) => {
    triggerHaptic('success')
    const finalReturnDate = returnDate || toDateString(new Date())

    updateCurrentProfileTrips((trips) =>
      trips.map((t) => {
        if (t.id === tripId) {
          const effectiveReturn =
            returnDate && returnDate >= t.entryDate ? returnDate : finalReturnDate
          return {
            ...t,
            ongoing: false,
            exitDate: effectiveReturn,
          }
        }
        return t
      })
    )
  }

  const handleAddPlannedTrip = (entryDate: string, exitDate: string, title: string) => {
    triggerHaptic('medium')
    const newTrip: Trip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryDate,
      exitDate,
      title,
      isPlanned: true,
    }
    updateCurrentProfileTrips((trips) => [...trips, newTrip])
    setActiveTab('trips')
  }

  const handleLoadSampleData = () => {
    triggerHaptic('medium')
    const today = new Date()
    const trip1End = subDays(today, 80)
    const trip1Start = subDays(trip1End, 14)

    const trip2End = subDays(today, 30)
    const trip2Start = subDays(trip2End, 20)

    const sampleTrips: Trip[] = [
      {
        id: 'sample_1',
        entryDate: toDateString(trip1Start),
        exitDate: toDateString(trip1End),
        title: lang === 'uk' ? 'Італія (Рим, Флоренція)' : 'Italy (Rome, Florence)',
        notes: lang === 'uk' ? 'Відпустка 15 днів' : 'Vacation 15 days',
        isPlanned: false,
      },
      {
        id: 'sample_2',
        entryDate: toDateString(trip2Start),
        exitDate: toDateString(trip2End),
        title: lang === 'uk' ? 'Німеччина (Берлін)' : 'Germany (Berlin)',
        notes: lang === 'uk' ? 'Конференція 21 день' : 'Conference & stay 21 days',
        isPlanned: false,
      },
    ]

    updateCurrentProfileTrips(() => sampleTrips)
  }

  const handleClearAll = () => {
    triggerHaptic('error')
    updateCurrentProfileTrips(() => [])
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col pb-20 sm:pb-8 selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Header */}
      <Header
        lang={lang}
        t={t}
        activeProfile={activeProfile}
        isOnline={isOnline}
        hasUpdate={hasUpdate}
        isSyncActive={Boolean(syncKey)}
        onReloadApp={reloadApp}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onSelectLanguage={handleSelectLanguage}
        onOpenAddModal={handleAddTrip}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Main Layout Container (Handles Mobile, Tablet, Desktop & Dual-Screen) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 pt-3.5 sm:pt-8 pb-8 dual-screen-layout">
        
        {/* =========================================================================
            DESKTOP & DUAL-SCREEN LAYOUT (>= 1024px or Foldable Dual-Screen)
           ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 items-start dual-screen-layout w-full">
          {/* Left Column (Dual-Screen Left Screen / Desktop Main): Status Card & Trip List */}
          <div className="lg:col-span-7 space-y-5 dual-screen-left">
            <StatusCard
              summary={summary}
              referenceDate={referenceDate}
              activeProfile={activeProfile}
              lang={lang}
              t={t}
              onReferenceDateChange={setReferenceDate}
              onResetReferenceDate={() => setReferenceDate(toDateString(new Date()))}
              onToggleProfileMode={() =>
                handleUpdateProfile(activeProfile.id, {
                  mode: isResidentMode ? 'schengen' : 'eu_resident',
                  country: activeProfile.country || 'ES',
                })
              }
              onUpdateCountry={(code) => handleUpdateProfile(activeProfile.id, { country: code })}
              onStartOngoingTrip={handleStartOngoingTrip}
              onEndOngoingTrip={handleEndOngoingTrip}
              onEditTrip={handleEditTrip}
            />

            <TripList
              trips={currentTrips}
              lang={lang}
              t={t}
              isResidentMode={isResidentMode}
              countryName={countryObj.name}
              onAddTrip={handleAddTrip}
              onEditTrip={handleEditTrip}
              onDeleteTrip={handleDeleteTrip}
              onLoadSampleData={handleLoadSampleData}
              onEndOngoingTrip={handleEndOngoingTrip}
            />
          </div>

          {/* Right Column (Dual-Screen Right Screen / Desktop Sidebar): Planner & Calendar */}
          <div className="lg:col-span-5 space-y-4 dual-screen-right sticky top-20">
            {/* Desktop side panel tab switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <button
                onClick={() => {
                  setDesktopSideTab('planner')
                  triggerHaptic('light')
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                  desktopSideTab === 'planner'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{t.tabPlanner}</span>
              </button>

              <button
                onClick={() => {
                  setDesktopSideTab('calendar')
                  triggerHaptic('light')
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                  desktopSideTab === 'calendar'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>{t.tabCalendar}</span>
              </button>
            </div>

            <div className="animate-fade-in">
              {desktopSideTab === 'planner' ? (
                <PlannerView
                  trips={currentTrips}
                  lang={lang}
                  t={t}
                  onAddPlannedTrip={handleAddPlannedTrip}
                />
              ) : (
                <CalendarView
                  trips={currentTrips}
                  selectedDate={referenceDate}
                  lang={lang}
                  t={t}
                  onSelectDate={(date) => setReferenceDate(date)}
                />
              )}
            </div>

            {/* Desktop hotkeys hint */}
            <div className="text-[11px] text-slate-500 text-center pt-2">
              {t.desktopShortcutsHint}
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE & TABLET LAYOUT (< 1024px)
           ========================================================================= */}
        <div className="lg:hidden space-y-4">
          {/* Real-time Status Card */}
          <StatusCard
            summary={summary}
            referenceDate={referenceDate}
            activeProfile={activeProfile}
            lang={lang}
            t={t}
            onReferenceDateChange={setReferenceDate}
            onResetReferenceDate={() => setReferenceDate(toDateString(new Date()))}
            onToggleProfileMode={() =>
              handleUpdateProfile(activeProfile.id, {
                mode: isResidentMode ? 'schengen' : 'eu_resident',
                country: activeProfile.country || 'ES',
              })
            }
            onUpdateCountry={(code) => handleUpdateProfile(activeProfile.id, { country: code })}
            onStartOngoingTrip={handleStartOngoingTrip}
            onEndOngoingTrip={handleEndOngoingTrip}
            onEditTrip={handleEditTrip}
          />

          {/* Tablet & Mobile Tab Switcher */}
          <div className="grid grid-cols-3 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('trips')
                triggerHaptic('light')
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                activeTab === 'trips'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-4 h-4 shrink-0" />
              <span>{t.tabTrips}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('planner')
                triggerHaptic('light')
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                activeTab === 'planner'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>{t.tabPlanner}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('calendar')
                triggerHaptic('light')
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>{t.tabCalendar}</span>
            </button>
          </div>

          {/* Tab Views */}
          <div className="animate-fade-in">
            {activeTab === 'trips' && (
              <TripList
                trips={currentTrips}
                lang={lang}
                t={t}
                isResidentMode={isResidentMode}
                countryName={countryObj.name}
                onAddTrip={handleAddTrip}
                onEditTrip={handleEditTrip}
                onDeleteTrip={handleDeleteTrip}
                onLoadSampleData={handleLoadSampleData}
                onEndOngoingTrip={handleEndOngoingTrip}
              />
            )}

            {activeTab === 'planner' && (
              <PlannerView
                trips={currentTrips}
                lang={lang}
                t={t}
                onAddPlannedTrip={handleAddPlannedTrip}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                trips={currentTrips}
                selectedDate={referenceDate}
                lang={lang}
                t={t}
                onSelectDate={(date) => setReferenceDate(date)}
              />
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          SITE FOOTER & LEGAL DISCLAIMER
         ========================================================================= */}
      <footer className="mt-auto max-w-6xl w-full mx-auto px-4 py-5 sm:py-8 border-t border-slate-900 text-center space-y-2">
        <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
          ⚖️ <span className="text-slate-400 font-medium">{t.disclaimerShort}</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-1">
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {t.disclaimerTitle} & {t.aboutRule}
          </button>
          <span className="text-slate-600 hidden xs:inline">•</span>
          <a
            href="https://ec.europa.eu/assets/home-affairs/schengen-calculator/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 inline-flex items-center gap-1 transition-colors text-slate-400"
          >
            <span>{t.officialEuCalculatorLink}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <span className="text-slate-600 hidden xs:inline">•</span>
          <a
            href="https://github.com/Naykitin/schengen-visa-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 inline-flex items-center gap-1 transition-colors text-slate-400"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>

        <p className="text-[10px] text-slate-500 pt-1">
          NayKit by <a href="https://github.com/Naykitin" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 underline">Naykitin</a> • {t.allRightsReserved}
        </p>
      </footer>

      {/* =========================================================================
          MOBILE BOTTOM FLOATING ACTION BUTTON
         ========================================================================= */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40 safe-mb-bottom">
        <button
          onClick={handleAddTrip}
          className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center border border-blue-400/30 active:scale-95 transition-all"
          aria-label={t.addTrip}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* =========================================================================
          LAZY-LOADED MODALS (Loaded on-demand to optimize bundle size & LCP)
         ========================================================================= */}
      <Suspense fallback={null}>
        {isTripModalOpen && (
          <TripModal
            isOpen={isTripModalOpen}
            initialTrip={editingTrip}
            existingTrips={currentTrips}
            lang={lang}
            t={t}
            isResidentMode={isResidentMode}
            countryName={countryObj.name}
            onClose={() => {
              setIsTripModalOpen(false)
              setEditingTrip(null)
            }}
            onSave={handleSaveTrip}
          />
        )}

        {isBackupModalOpen && (
          <BackupModal
            isOpen={isBackupModalOpen}
            data={appData}
            t={t}
            onClose={() => setIsBackupModalOpen(false)}
            onImportData={(updatedData) => setAppData(updatedData)}
            onClearAll={handleClearAll}
          />
        )}

        {isProfileModalOpen && (
          <ProfileModal
            isOpen={isProfileModalOpen}
            data={appData}
            t={t}
            onClose={() => setIsProfileModalOpen(false)}
            onSelectProfile={handleSelectProfile}
            onAddProfile={handleAddProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
          />
        )}

        {isSyncModalOpen && (
          <SyncModal
            isOpen={isSyncModalOpen}
            syncKey={syncKey}
            autoSync={autoSync}
            lastSyncTime={lastSyncTime}
            isSyncing={isSyncing}
            syncError={syncError}
            t={t}
            onClose={() => setIsSyncModalOpen(false)}
            onEnableNewSyncKey={handleEnableNewSyncKey}
            onConnectSyncKey={handleConnectSyncKey}
            onToggleAutoSync={handleToggleAutoSync}
            onManualSync={handleManualSync}
            onDisconnectSync={handleDisconnectSync}
          />
        )}

        {isInfoModalOpen && (
          <InfoModal
            isOpen={isInfoModalOpen}
            t={t}
            onClose={() => setIsInfoModalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  )
}

export default App
