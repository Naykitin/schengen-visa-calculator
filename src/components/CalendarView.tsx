import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ru, enUS } from 'date-fns/locale'
import type { Trip } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import {
  buildSchengenDaysMap,
  countDaysIn180Window,
  toDateString,
} from '../lib/schengen'

interface CalendarViewProps {
  trips: Trip[]
  selectedDate: string
  lang: Language
  t: TranslationDictionary
  onSelectDate: (date: string) => void
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  trips,
  selectedDate,
  lang,
  t,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ? parseISO(selectedDate) : new Date()
  )

  const dateLocale = lang === 'ru' ? ru : enUS
  const daysMap = buildSchengenDaysMap(trips)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const weekDayNames = lang === 'ru' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Information about currently selected day
  const selectedDateStr = selectedDate
  const isSelectedInSchengen = daysMap.has(selectedDateStr)
  const selectedUsed180 = countDaysIn180Window(selectedDateStr, daysMap)
  const selectedTripId = daysMap.get(selectedDateStr)
  const selectedTrip = selectedTripId ? trips.find(t => t.id === selectedTripId) : null

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
        </h3>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-lg hover:bg-slate-800"
          >
            {t.todayBtn}
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500">
        {weekDayNames.map((name) => (
          <div key={name} className="py-1">
            {name}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dateStr = toDateString(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate === dateStr
          const isToday = isSameDay(day, new Date())

          const isInSchengen = daysMap.has(dateStr)
          const tripId = daysMap.get(dateStr)
          const trip = tripId ? trips.find((t) => t.id === tripId) : null
          const isPlanned = trip?.isPlanned

          const usedIn180 = countDaysIn180Window(dateStr, daysMap)
          const isOverstay = usedIn180 > 90

          let dayStyle = 'text-slate-400 hover:bg-slate-800/60'
          if (!isCurrentMonth) {
            dayStyle = 'text-slate-600 opacity-40'
          }

          let badgeStyle = ''
          if (isInSchengen) {
            if (isOverstay) {
              badgeStyle = 'bg-rose-500 text-white font-bold'
            } else if (isPlanned) {
              badgeStyle = 'bg-indigo-600/70 border border-indigo-400/50 text-indigo-100 font-bold'
            } else {
              badgeStyle = 'bg-blue-600 text-white font-bold'
            }
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs ${dayStyle} ${
                isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 z-10' : ''
              } ${badgeStyle}`}
            >
              <span>{format(day, 'd')}</span>
              {isToday && (
                <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-slate-400 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-blue-600 inline-block" />
          <span>{t.legendTrip}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-indigo-600/70 border border-indigo-400/50 inline-block" />
          <span>{t.legendPlan}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500 inline-block" />
          <span>{t.legendOverstay}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span>{t.legendToday}</span>
        </div>
      </div>

      {/* Day detail popover */}
      {selectedDateStr && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold">
              {format(parseISO(selectedDateStr), 'd MMMM yyyy', { locale: dateLocale })}:
            </span>
            <span
              className={`font-bold ${
                selectedUsed180 > 90 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {selectedUsed180} / 90 {t.days}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {isSelectedInSchengen ? (
              <span className="text-blue-300">
                {t.dayDetailsInSchengen(selectedTrip?.title)}
              </span>
            ) : (
              <span>{t.dayDetailsOutside}</span>
            )}
            {' · '}
            <span>
              {t.remainingAllowance(Math.max(0, 90 - selectedUsed180))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
