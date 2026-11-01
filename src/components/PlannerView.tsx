import React, { useState } from 'react'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react'
import type { Trip } from '../lib/schengen'
import {
  findEarliestEntryDate,
  getTripDuration,
  simulateTrip,
  toDateString,
} from '../lib/schengen'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface PlannerViewProps {
  trips: Trip[]
  onAddPlannedTrip: (entryDate: string, exitDate: string, title: string) => void
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  trips,
  onAddPlannedTrip,
}) => {
  const [mode, setMode] = useState<'find-earliest' | 'check-dates'>('find-earliest')

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

  // Earliest search calculation
  const earliestResult = findEarliestEntryDate(
    trips,
    desiredDays,
    searchFromDate
  )

  // Specific dates calculation
  const isDateOrderValid = checkEntry && checkExit && checkEntry <= checkExit
  const checkDuration = isDateOrderValid ? getTripDuration(checkEntry, checkExit) : 0
  const checkSimulation =
    isDateOrderValid && checkDuration > 0
      ? simulateTrip(trips, checkEntry, checkExit)
      : null

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setMode('find-earliest')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            mode === 'find-earliest'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Когда можно поехать?
        </button>
        <button
          onClick={() => setMode('check-dates')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            mode === 'check-dates'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Проверить мои даты
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
                Поиск ближайшей доступной даты
              </h3>
              <p className="text-[11px] text-slate-400">
                Калькулятор найдёт день, когда лимит позволит совершить поездку
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Сколько дней хотите пробыть?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={desiredDays}
                  onChange={(e) => setDesiredDays(Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <span className="text-xs text-slate-400 shrink-0 font-medium">дней</span>
              </div>
              {/* Quick pills */}
              <div className="flex gap-1.5 mt-2">
                {[7, 14, 30, 45, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDesiredDays(d)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                      desiredDays === d
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {d} дн
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Искать начиная с даты:
              </label>
              <input
                type="date"
                value={searchFromDate}
                onChange={(e) => setSearchFromDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
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
                    Поездка возможна!
                  </h4>
                  <p className="text-sm font-bold text-white mt-0.5">
                    С {format(parseISO(earliestResult.entryDate), 'd MMMM yyyy', { locale: ru })} по{' '}
                    {format(parseISO(earliestResult.exitDate), 'd MMMM yyyy', { locale: ru })}
                  </p>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    Длительность: <span className="font-semibold">{desiredDays} дней</span> без каких-либо нарушений правила 90/180.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  onAddPlannedTrip(
                    earliestResult.entryDate!,
                    earliestResult.exitDate!,
                    `Запланированная поездка (${desiredDays} дн.)`
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-700/20 active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" />
                Добавить в запланированные поездки
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">
                  В ближайшие 365 дней невозможно непрерывно провести {desiredDays} дней
                </span>
              </div>
              <p className="text-amber-300/80 mt-1 text-[11px]">
                Попробуйте уменьшить желаемое количество дней или проверьте существующие поездки.
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
              <h3 className="text-sm font-bold text-white">Проверка конкретных дат</h3>
              <p className="text-[11px] text-slate-400">
                Укажите планируемые даты въезда и выезда для проверки соответствия
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Дата въезда
              </label>
              <input
                type="date"
                value={checkEntry}
                onChange={(e) => setCheckEntry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Дата выезда
              </label>
              <input
                type="date"
                value={checkExit}
                onChange={(e) => setCheckExit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
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
                    {checkSimulation.isValid ? 'Поездка легальна' : 'Нарушение правила 90/180!'}
                  </h4>
                  <p className="text-xs mt-1 text-slate-300">
                    Длительность: <span className="font-semibold text-white">{checkDuration} дн.</span> |
                    Макс. дней в 180-дневном окне:{' '}
                    <span className="font-semibold text-white">
                      {checkSimulation.maxDaysUsedDuringTrip} / 90
                    </span>
                  </p>
                  {!checkSimulation.isValid && checkSimulation.firstViolationDate && (
                    <p className="text-xs text-rose-300 mt-1 font-semibold">
                      Превышение лимита начинается с даты{' '}
                      {format(parseISO(checkSimulation.firstViolationDate), 'd MMMM yyyy', {
                        locale: ru,
                      })}.
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
                      `Проверенная поездка (${checkDuration} дн.)`
                    )
                  }
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-blue-600/30 active:scale-98 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Сохранить как план
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center">
              Выберите корректные даты (выезд позже или равен въезду)
            </p>
          )}
        </div>
      )}
    </div>
  )
}
