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
  const [activeTab, setActiveTab] = useState<'trips' | 'planner' | 'calendar'>('trips')

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20">
      {/* Top Bar */}
      <Header
        onOpenAddModal={handleAddTrip}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Real-time Status Card */}
        <StatusCard
          summary={summary}
          referenceDate={referenceDate}
          onReferenceDateChange={setReferenceDate}
          onResetReferenceDate={() => setReferenceDate(toDateString(new Date()))}
        />

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'trips'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Поездки</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'planner'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Планировщик</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Календарь</span>
          </button>
        </div>

        {/* Active Tab View */}
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
      </main>

      {/* Floating Add Trip Button on Mobile */}
      <button
        onClick={handleAddTrip}
        className="sm:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center border border-blue-400/30 active:scale-95 transition-all"
        aria-label="Добавить поездку"
      >
        <Plus className="w-7 h-7" />
      </button>

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
