import React, { useState, useMemo } from 'react'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react'
import type { Trip } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { getDateLocale } from '../lib/i18n'
import {
  findEarliestEntryDate,
  getTripDuration,
  simulateTrip,
  toDateString,
} from '../lib/schengen'
import { format, parseISO } from 'date-fns'

interface PlannerViewProps {
  trips: Trip[]
  lang: Language
  t: TranslationDictionary
  onAddPlannedTrip: (entryDate: string, exitDate: string, title: string) => void
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  trips,
  lang,
  t,
  onAddPlannedTrip,
}) => {
  const [mode, setMode] = useState<'find-earliest' | 'check-dates'>('find-earliest')
  const dateLocale = getDateLocale(lang)

  // Find earliest state
  const [desiredDays, setDesiredDays] = useState<number>(14)
  const [searchFromDate, setSearchFromDate] = useState<string>(
    toDateString(new Date())
  )

  // Check specific dates state
  const [checkEntry, setCheckEntry] = useState<string>(
    toDateString(new Date())
  )
  const [checkExit, setCheckExit] = useState<string>(
    toDateString(new Date())
  )

  // Earliest search calculation (memoized to keep main thread at 60fps)
  const earliestResult = useMemo(() => {
    if (mode !== 'find-earliest') return { found: false }
    return findEarliestEntryDate(trips, desiredDays, searchFromDate)
  }, [mode, trips, desiredDays, searchFromDate])

  // Specific dates calculation (memoized)
  const isDateOrderValid = checkEntry && checkExit && checkEntry <= checkExit
  const checkDuration = isDateOrderValid ? getTripDuration(checkEntry, checkExit) : 0
  const checkSimulation = useMemo(() => {
    if (mode !== 'check-dates' || !isDateOrderValid || checkDuration <= 0) return null
    return simulateTrip(trips, checkEntry, checkExit)
  }, [mode, isDateOrderValid, checkDuration, trips, checkEntry, checkExit])

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setMode('find-earliest')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all min-h-[40px] ${
            mode === 'find-earliest'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.plannerModeEarliest}
        </button>
        <button
          onClick={() => setMode('check-dates')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all min-h-[40px] ${
            mode === 'check-dates'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.plannerModeCheck}
        </button>
      </div>

      {mode === 'find-earliest' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.earliestSearchTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.earliestSearchDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center min-h-[32px] sm:min-h-[36px]">
                {t.desiredDaysLabel}
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={desiredDays}
                  onChange={(e) => setDesiredDays(Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
                  className="w-full min-w-0 h-11 bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-14 text-sm font-semibold text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <span className="absolute right-3.5 text-xs text-slate-400 pointer-events-none font-medium">
                  {t.days}
                </span>
              </div>
              {/* Quick pills */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[7, 14, 30, 45, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDesiredDays(d)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all active:scale-95 ${
                      desiredDays === d
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {d} {t.days}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center min-h-[32px] sm:min-h-[36px]">
                {t.searchFromDateLabel}
              </label>
              <input
                type="date"
                value={searchFromDate}
                onChange={(e) => setSearchFromDate(e.target.value)}
                className="w-full min-w-0 h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Search Result Box */}
          {earliestResult.found && earliestResult.entryDate && earliestResult.exitDate ? (
            <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 text-emerald-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    {t.tripPossibleTitle}
                  </h4>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {format(parseISO(earliestResult.entryDate), 'd MMMM yyyy', { locale: dateLocale })} —{' '}
                    {format(parseISO(earliestResult.exitDate), 'd MMMM yyyy', { locale: dateLocale })}
                  </p>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    {t.tripPossibleDesc(desiredDays)}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  onAddPlannedTrip(
                    earliestResult.entryDate!,
                    earliestResult.exitDate!,
                    lang === 'ru'
                      ? `Запланированная поездка (${desiredDays} дн.)`
                      : `Planned trip (${desiredDays} days)`
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-700/20 active:scale-98 transition-all min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                {t.addAsPlanBtn}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">
                  {t.noDatesFoundTitle(desiredDays)}
                </span>
              </div>
              <p className="text-amber-300/80 mt-1 text-[11px]">
                {t.noDatesFoundDesc}
              </p>
            </div>
          )}
        </div>
      )}

      {mode === 'check-dates' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.checkDatesTitle}</h3>
              <p className="text-[11px] text-slate-400">
                {t.checkDatesDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center min-h-[24px]">
                {t.entryDateLabel}
              </label>
              <input
                type="date"
                value={checkEntry}
                onChange={(e) => setCheckEntry(e.target.value)}
                className="w-full min-w-0 h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center min-h-[24px]">
                {t.exitDateLabel}
              </label>
              <input
                type="date"
                value={checkExit}
                onChange={(e) => setCheckExit(e.target.value)}
                className="w-full min-w-0 h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Result of Check */}
          {checkSimulation ? (
            <div
              className={`p-4 rounded-2xl border ${
                checkSimulation.isValid
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              } space-y-3`}
            >
              <div className="flex items-start gap-2.5">
                {checkSimulation.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {checkSimulation.isValid ? t.tripLegalTitle : t.tripViolationTitle}
                  </h4>
                  <p className="text-xs mt-1 text-slate-300">
                    {t.durationDays(checkDuration)} | {t.maxUsedDuringTrip(checkSimulation.maxDaysUsedDuringTrip)}
                  </p>
                  {!checkSimulation.isValid && checkSimulation.firstViolationDate && (
                    <p className="text-xs text-rose-300 mt-1 font-semibold">
                      {t.violationStartsFrom(
                        format(parseISO(checkSimulation.firstViolationDate), 'd MMMM yyyy', {
                          locale: dateLocale,
                        })
                      )}
                    </p>
                  )}
                </div>
              </div>

              {checkSimulation.isValid && (
                <button
                  onClick={() =>
                    onAddPlannedTrip(
                      checkEntry,
                      checkExit,
                      lang === 'ru'
                        ? `Проверенная поездка (${checkDuration} дн.)`
                        : `Verified trip (${checkDuration} days)`
                    )
                  }
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-blue-600/30 active:scale-98 transition-all min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  {t.addAsPlanBtn}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center">
              {t.selectValidDatesHint}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
