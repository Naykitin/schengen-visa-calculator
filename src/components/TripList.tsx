import React from 'react'
import {
  CalendarDays,
  Edit2,
  Plane,
  Plus,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import type { Trip } from '../lib/schengen'
import { getTripDuration } from '../lib/schengen'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface TripListProps {
  trips: Trip[]
  onAddTrip: () => void
  onEditTrip: (trip: Trip) => void
  onDeleteTrip: (tripId: string) => void
  onLoadSampleData: () => void
}

export const TripList: React.FC<TripListProps> = ({
  trips,
  onAddTrip,
  onEditTrip,
  onDeleteTrip,
  onLoadSampleData,
}) => {
  // Sort trips descending by entryDate
  const sortedTrips = [...trips].sort((a, b) => b.entryDate.localeCompare(a.entryDate))

  if (trips.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center backdrop-blur-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
          <Plane className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Пока нет добавленных поездок</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Добавьте ваши прошлые поездки в страны Шенгенской зоны или запланируйте будущие, чтобы рассчитать доступные дни.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAddTrip}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Добавить первую поездку
          </button>
          <button
            onClick={onLoadSampleData}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-all active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            Загрузить примеры
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-200">История и планы поездок</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold">
            {trips.length}
          </span>
        </div>

        <button
          onClick={onAddTrip}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить
        </button>
      </div>

      <div className="space-y-2.5">
        {sortedTrips.map((trip) => {
          const duration = getTripDuration(trip.entryDate, trip.exitDate)
          const formattedEntry = format(parseISO(trip.entryDate), 'd MMM yyyy', { locale: ru })
          const formattedExit = format(parseISO(trip.exitDate), 'd MMM yyyy', { locale: ru })
          const isSingleDay = trip.entryDate === trip.exitDate

          return (
            <div
              key={trip.id}
              className={`group bg-slate-900/80 hover:bg-slate-800/80 border ${
                trip.isPlanned
                  ? 'border-indigo-500/30 bg-indigo-950/20'
                  : 'border-slate-800'
              } rounded-2xl p-4 transition-all duration-200 shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      trip.isPlanned
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-100">
                        {trip.title || 'Поездка в Шенген'}
                      </h4>
                      {trip.isPlanned && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          План
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>
                        {isSingleDay ? formattedEntry : `${formattedEntry} — ${formattedExit}`}
                      </span>
                    </div>

                    {trip.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                        {trip.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <span className="text-xs font-bold text-slate-200 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-xl">
                    {duration} {getDaysLabel(duration)}
                  </span>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTrip(trip)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Редактировать"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getDaysLabel(days: number): string {
  const mod10 = days % 10
  const mod100 = days % 100
  if (mod100 >= 11 && mod100 <= 19) return 'дней'
  if (mod10 === 1) return 'день'
  if (mod10 >= 2 && mod10 <= 4) return 'дня'
  return 'дней'
}
