import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Compass,
  ListFilter,
  Plus,
} from 'lucide-react'
import { Header } from './components/Header'
import { StatusCard } from './components/StatusCard'
import { TripList } from './components/TripList'
import { TripModal } from './components/TripModal'
import { PlannerView } from './components/PlannerView'
import { CalendarView } from './components/CalendarView'
import { InfoModal } from './components/InfoModal'
import { BackupModal } from './components/BackupModal'
import type { Trip } from './lib/schengen'
import {
  calculateSchengenSummary,
  toDateString,
} from './lib/schengen'
import {
  loadTrips,
  requestPersistentStorage,
  saveTrips,
} from './lib/storage'
import { subDays } from 'date-fns'

export function App() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Navigation tabs (Mobile / Tablet active tab)
  const [activeTab, setActiveTab] = useState<'trips' | 'planner' | 'calendar'>('trips')
  // Desktop secondary panel tab
  const [desktopSideTab, setDesktopSideTab] = useState<'planner' | 'calendar'>('planner')

  // Reference date for calculation (defaults to today)
  const [referenceDate, setReferenceDate] = useState<string>(
    toDateString(new Date())
  )

  // Modals state
  const [isTripModalOpen, setIsTripModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  // Initialize storage & auto-request persistence
  useEffect(() => {
    async function init() {
      const storedTrips = await loadTrips()
      setTrips(storedTrips)
      setIsLoaded(true)
      requestPersistentStorage().catch(() => {})
    }
    init()
  }, [])

  // Auto-save whenever trips change
  useEffect(() => {
    if (isLoaded) {
      saveTrips(trips)
    }
  }, [trips, isLoaded])

  // Desktop keyboard shortcuts: 'N' for new trip, '1'/'2'/'3' for tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        isTripModalOpen ||
        isBackupModalOpen ||
        isInfoModalOpen
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
  }, [isTripModalOpen, isBackupModalOpen, isInfoModalOpen])

  // Calculate live summary
  const summary = calculateSchengenSummary(trips, referenceDate)

  // Handlers
  const handleSaveTrip = (trip: Trip) => {
    if (editingTrip) {
      setTrips((prev) => prev.map((t) => (t.id === trip.id ? trip : t)))
    } else {
      setTrips((prev) => [...prev, trip])
    }
    setEditingTrip(null)
  }

  const handleDeleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId))
  }

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setIsTripModalOpen(true)
  }

  const handleAddTrip = () => {
    setEditingTrip(null)
    setIsTripModalOpen(true)
  }

  const handleAddPlannedTrip = (entryDate: string, exitDate: string, title: string) => {
    const newTrip: Trip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryDate,
      exitDate,
      title,
      isPlanned: true,
    }
    setTrips((prev) => [...prev, newTrip])
    setActiveTab('trips')
  }

  const handleLoadSampleData = () => {
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
        title: 'Италия (Рим, Флоренция)',
        notes: 'Отпуск 15 дней',
        isPlanned: false,
      },
      {
        id: 'sample_2',
        entryDate: toDateString(trip2Start),
        exitDate: toDateString(trip2End),
        title: 'Германия (Берлин)',
        notes: 'Конференция и выходные 21 день',
        isPlanned: false,
      },
    ]

    setTrips(sampleTrips)
  }

  const handleClearAll = () => {
    setTrips([])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-24 sm:pb-8 selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Header */}
      <Header
        onOpenAddModal={handleAddTrip}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Main Layout Container (Handles Mobile, Tablet, Desktop & Dual-Screen) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 dual-screen-layout">
        
        {/* =========================================================================
            DESKTOP & DUAL-SCREEN LAYOUT (>= 1024px or Foldable Dual-Screen)
           ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 items-start dual-screen-layout w-full">
          {/* Left Column (Dual-Screen Left Screen / Desktop Main): Status Card & Trip List */}
          <div className="lg:col-span-7 space-y-5 dual-screen-left">
            <StatusCard
              summary={summary}
              referenceDate={referenceDate}
              onReferenceDateChange={setReferenceDate}
              onResetReferenceDate={() => setReferenceDate(toDateString(new Date()))}
            />

            <TripList
              trips={trips}
              onAddTrip={handleAddTrip}
              onEditTrip={handleEditTrip}
              onDeleteTrip={handleDeleteTrip}
              onLoadSampleData={handleLoadSampleData}
            />
          </div>

          {/* Right Column (Dual-Screen Right Screen / Desktop Sidebar): Planner & Calendar */}
          <div className="lg:col-span-5 space-y-4 dual-screen-right sticky top-20">
            {/* Desktop side panel tab switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <button
                onClick={() => setDesktopSideTab('planner')}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                  desktopSideTab === 'planner'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Планировщик</span>
              </button>

              <button
                onClick={() => setDesktopSideTab('calendar')}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                  desktopSideTab === 'calendar'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Календарь</span>
              </button>
            </div>

            <div className="animate-fade-in">
              {desktopSideTab === 'planner' ? (
                <PlannerView
                  trips={trips}
                  onAddPlannedTrip={handleAddPlannedTrip}
                />
              ) : (
                <CalendarView
                  trips={trips}
                  selectedDate={referenceDate}
                  onSelectDate={(date) => setReferenceDate(date)}
                />
              )}
            </div>

            {/* Desktop hotkeys hint */}
            <div className="text-[11px] text-slate-500 text-center pt-2">
              Горячие клавиши: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">N</kbd> — новая поездка, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Esc</kbd> — закрыть
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
            onReferenceDateChange={setReferenceDate}
            onResetReferenceDate={() => setReferenceDate(toDateString(new Date()))}
          />

          {/* Tablet & Mobile Tab Switcher */}
          <div className="grid grid-cols-3 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                activeTab === 'trips'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-4 h-4 shrink-0" />
              <span>Поездки</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                activeTab === 'planner'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Планировщик</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>Календарь</span>
            </button>
          </div>

          {/* Tab Views */}
          <div className="animate-fade-in">
            {activeTab === 'trips' && (
              <TripList
                trips={trips}
                onAddTrip={handleAddTrip}
                onEditTrip={handleEditTrip}
                onDeleteTrip={handleDeleteTrip}
                onLoadSampleData={handleLoadSampleData}
              />
            )}

            {activeTab === 'planner' && (
              <PlannerView
                trips={trips}
                onAddPlannedTrip={handleAddPlannedTrip}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                trips={trips}
                selectedDate={referenceDate}
                onSelectDate={(date) => setReferenceDate(date)}
              />
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          MOBILE BOTTOM FLOATING ACTION BUTTON & BOTTOM NAVIGATION BAR
         ========================================================================= */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40 safe-mb-bottom">
        <button
          onClick={handleAddTrip}
          className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center border border-blue-400/30 active:scale-95 transition-all"
          aria-label="Добавить поездку"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modals */}
      <TripModal
        isOpen={isTripModalOpen}
        initialTrip={editingTrip}
        existingTrips={trips}
        onClose={() => {
          setIsTripModalOpen(false)
          setEditingTrip(null)
        }}
        onSave={handleSaveTrip}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        trips={trips}
        onClose={() => setIsBackupModalOpen(false)}
        onImportTrips={(importedTrips) => setTrips(importedTrips)}
        onClearAll={handleClearAll}
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  )
}

export default App
