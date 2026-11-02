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
import type { Language, TranslationDictionary } from '../lib/i18n'
import { getDateLocale } from '../lib/i18n'
import { getTripDuration } from '../lib/schengen'
import { format, parseISO } from 'date-fns'

interface TripListProps {
  trips: Trip[]
  lang: Language
  t: TranslationDictionary
  isResidentMode?: boolean
  countryName?: string
  onAddTrip: () => void
  onEditTrip: (trip: Trip) => void
  onDeleteTrip: (tripId: string) => void
  onLoadSampleData: () => void
  onEndOngoingTrip?: (tripId: string) => void
}

export const TripList: React.FC<TripListProps> = ({
  trips,
  lang,
  t,
  isResidentMode = false,
  countryName = 'Spain',
  onAddTrip,
  onEditTrip,
  onDeleteTrip,
  onLoadSampleData,
  onEndOngoingTrip,
}) => {
  const dateLocale = getDateLocale(lang)
  // Sort trips: ongoing trips first, then descending by entryDate
  const sortedTrips = [...trips].sort((a, b) => {
    if (a.ongoing && !b.ongoing) return -1
    if (!a.ongoing && b.ongoing) return 1
    return b.entryDate.localeCompare(a.entryDate)
  })

  if (trips.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center backdrop-blur-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
          <Plane className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">{t.noTripsTitle}</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          {t.noTripsDesc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAddTrip}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            {isResidentMode ? t.logAbroadTripBtn : t.addFirstTrip}
          </button>
          <button
            onClick={onLoadSampleData}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-all active:scale-95 min-h-[44px]"
          >
            <UploadCloud className="w-4 h-4" />
            {t.loadSamples}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-200">
            {isResidentMode ? t.abroadTripListTitle : t.tripsHistoryTitle}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
            {trips.length}
          </span>
        </div>

        <button
          onClick={onAddTrip}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 active:scale-95 transition-all py-1 px-2"
        >
          <Plus className="w-3.5 h-3.5" />
          {isResidentMode ? t.logAbroadTripBtn : t.addTrip}
        </button>
      </div>

      <div className="space-y-2.5">
        {sortedTrips.map((trip) => {
          const duration = getTripDuration(trip.entryDate, trip.exitDate, trip.ongoing)
          const formattedEntry = format(parseISO(trip.entryDate), 'd MMM yyyy', { locale: dateLocale })
          const formattedExit = trip.ongoing
            ? t.presentDate
            : format(parseISO(trip.exitDate), 'd MMM yyyy', { locale: dateLocale })
          const isSingleDay = !trip.ongoing && trip.entryDate === trip.exitDate

          return (
            <div
              key={trip.id}
              className={`group bg-slate-900/80 hover:bg-slate-800/80 border ${
                trip.ongoing
                  ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : trip.isPlanned
                  ? 'border-indigo-500/30 bg-indigo-950/20'
                  : 'border-slate-800'
              } rounded-2xl p-4 transition-all duration-200 shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      trip.ongoing
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : trip.isPlanned
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : isResidentMode
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-100">
                        {trip.title || (isResidentMode ? `Trip outside ${countryName}` : lang === 'uk' ? 'Поїздка в Шенген' : 'Schengen Trip')}
                      </h4>
                      {trip.ongoing ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                          {t.ongoingTripBadge}
                        </span>
                      ) : trip.isPlanned ? (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {t.plannedBadge}
                        </span>
                      ) : null}
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
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                      trip.ongoing
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'text-slate-200 bg-slate-800/80 border-slate-700/60'
                    }`}>
                      {isResidentMode ? t.abroadDuration(duration) : t.durationDays(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    {trip.ongoing && onEndOngoingTrip && (
                      <button
                        onClick={() => onEndOngoingTrip(trip.id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                        title={isResidentMode ? t.returnedTodayBtn : t.departedSchengenTodayBtn}
                      >
                        {isResidentMode ? t.returnedTodayBtn : t.departedSchengenTodayBtn}
                      </button>
                    )}
                    <button
                      onClick={() => onEditTrip(trip)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/80 transition-colors"
                      title={t.editTrip}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/80 transition-colors"
                      title={t.deleteTrip}
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
