import React from 'react'
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Clock,
  Compass,
  Sparkles,
} from 'lucide-react'
import type { SchengenSummary } from '../lib/schengen'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface StatusCardProps {
  summary: SchengenSummary
  referenceDate: string
  onReferenceDateChange: (date: string) => void
  onResetReferenceDate: () => void
}

export const StatusCard: React.FC<StatusCardProps> = ({
  summary,
  referenceDate,
  onReferenceDateChange,
  onResetReferenceDate,
}) => {
  const percentUsed = Math.min(100, Math.round((summary.daysUsedInWindow / 90) * 100))
  const isToday = referenceDate === new Date().toISOString().slice(0, 10)

  // Status color styling
  let statusBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  let gaugeColor = 'from-blue-500 to-indigo-500'
  if (summary.daysUsedInWindow >= 90) {
    statusBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    gaugeColor = 'from-rose-500 to-red-600'
  } else if (summary.daysUsedInWindow >= 75) {
    statusBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    gaugeColor = 'from-amber-500 to-orange-500'
  }

  const formattedRefDate = format(parseISO(referenceDate), 'd MMMM yyyy', { locale: ru })

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Date selector row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          <span>Контрольная дата:</span>
          <span className="font-semibold text-slate-200">{formattedRefDate}</span>
          {!isToday && (
            <button
              onClick={onResetReferenceDate}
              className="text-[11px] text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1"
            >
              Вернуть сегодня
            </button>
          )}
        </div>

        <input
          type="date"
          value={referenceDate}
          onChange={(e) => e.target.value && onReferenceDateChange(e.target.value)}
          className="bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Overstay warning alert */}
      {summary.hasOverstay && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-300">Внимание: зафиксировано превышение лимита!</p>
            <p className="text-rose-200/80 mt-0.5">
              В истории поездок есть дни, где лимит 90/180 был превышен
              {summary.firstOverstayDate && ` (первое нарушение: ${summary.firstOverstayDate})`}.
            </p>
          </div>
        </div>
      )}

      {/* Primary stats */}
      <div className="grid grid-cols-2 gap-4 my-2">
        {/* Remaining Days Block */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Осталось дней</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {summary.daysRemainingToday}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">из 90</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {summary.currentlyInSchengen ? (
              <span className="text-emerald-400 font-medium">
                Непрерывно еще: {summary.maxContinuousStayRemaining} дн.
              </span>
            ) : summary.daysRemainingToday > 0 ? (
              <span>Можно въехать на {summary.maxContinuousStayRemaining} дн. подряд</span>
            ) : (
              <span className="text-rose-400 font-medium">Лимит исчерпан</span>
            )}
          </div>
        </div>

        {/* Used Days Block */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Использовано</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-200">
              {summary.daysUsedInWindow}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">дней</span>
          </div>
          <div className="text-[11px] text-slate-400">
            За последние 180 дней
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5 font-medium">
          <span>Заполненность 90-дневного лимита</span>
          <span>{percentUsed}%</span>
        </div>
        <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gaugeColor} transition-all duration-500`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Current presence indicator */}
      <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {summary.currentlyInSchengen ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-slate-500"></span>
          )}
          <span className="text-slate-300">
            {summary.currentlyInSchengen ? 'Сейчас в зоне Шенгена' : 'Сейчас вне зоны Шенгена'}
          </span>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeColor}`}>
          {summary.daysUsedInWindow >= 90
            ? 'Лимит исчерпан'
            : summary.currentlyInSchengen
            ? 'Пребывание разрешено'
            : 'Въезд открыт'}
        </span>
      </div>

      {/* Recovery dates banner */}
      {summary.recoveryDates.length > 0 && summary.daysUsedInWindow > 0 && (
        <div className="mt-4 p-3 bg-blue-950/30 border border-blue-900/40 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1.5">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>Когда начнут возвращаться дни:</span>
          </div>
          <div className="space-y-1">
            {summary.recoveryDates.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px] text-slate-300">
                <span className="text-slate-400">
                  {format(parseISO(item.date), 'd MMM yyyy', { locale: ru })}:
                </span>
                <span className="font-semibold text-emerald-400">+{item.daysGained} дн.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
