import React, { useState, useEffect } from 'react'
import { AlertCircle, Plane, X } from 'lucide-react'
import type { Trip } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { getTripDuration, simulateTrip } from '../lib/schengen'

interface TripModalProps {
  isOpen: boolean
  initialTrip?: Trip | null
  existingTrips: Trip[]
  lang: Language
  t: TranslationDictionary
  isResidentMode?: boolean
  countryName?: string
  onClose: () => void
  onSave: (trip: Trip) => void
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  initialTrip,
  existingTrips,
  lang,
  t,
  isResidentMode = false,
  countryName = 'Spain',
  onClose,
  onSave,
}) => {
  const [entryDate, setEntryDate] = useState('')
  const [exitDate, setExitDate] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [isPlanned, setIsPlanned] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialTrip) {
      setEntryDate(initialTrip.entryDate)
      setExitDate(initialTrip.exitDate)
      setTitle(initialTrip.title || '')
      setNotes(initialTrip.notes || '')
      setIsPlanned(Boolean(initialTrip.isPlanned))
    } else {
      const today = new Date().toISOString().slice(0, 10)
      setEntryDate(today)
      setExitDate(today)
      setTitle('')
      setNotes('')
      setIsPlanned(false)
    }
    setError(null)
  }, [initialTrip, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Live simulation for feedback
  const duration = entryDate && exitDate && entryDate <= exitDate
    ? getTripDuration(entryDate, exitDate)
    : 0

  const simulation = !isResidentMode && entryDate && exitDate && entryDate <= exitDate
    ? simulateTrip(existingTrips, entryDate, exitDate, initialTrip?.id)
    : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!entryDate || !exitDate) {
      setError(t.errSelectDates)
      return
    }

    if (exitDate < entryDate) {
      setError(t.errExitBeforeEntry)
      return
    }

    const trip: Trip = {
      id: initialTrip?.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryDate,
      exitDate,
      title: title.trim() || undefined,
      notes: notes.trim() || undefined,
      isPlanned,
    }

    onSave(trip)
  }

  const modalHeading = isResidentMode
    ? initialTrip
      ? t.abroadTripEditModalTitle
      : t.abroadTripModalTitle
    : initialTrip
    ? t.modalEditTripTitle
    : t.modalNewTripTitle

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isResidentMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {modalHeading}
              </h3>
              <p className="text-xs text-slate-400">
                {isResidentMode
                  ? lang === 'ru'
                    ? `Выезд за пределы страны проживания (${countryName})`
                    : `Absence outside home country (${countryName})`
                  : 'Schengen Area stay duration'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isResidentMode
                  ? lang === 'ru'
                    ? 'Дата выезда'
                    : 'Departure Date'
                  : t.entryDateLabel}
              </label>
              <input
                type="date"
                required
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isResidentMode
                  ? lang === 'ru'
                    ? 'Дата возврата'
                    : 'Return Date'
                  : t.exitDateLabel}
              </label>
              <input
                type="date"
                required
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Duration Badge & Live Warning */}
          {duration > 0 && (
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {isResidentMode ? 'Total absence duration:' : 'Stay duration:'}
              </span>
              <span className="font-bold text-slate-100">
                {isResidentMode ? t.abroadDuration(duration) : t.durationDays(duration)}
              </span>
            </div>
          )}

          {/* Overstay Warning in Schengen mode */}
          {simulation && !simulation.isValid && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200">
              <p className="font-bold">{t.overstayAlert}</p>
              {simulation.firstViolationDate && (
                <p className="mt-0.5 text-rose-300">
                  {t.overstayStartsFrom(simulation.firstViolationDate)}
                </p>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.titleLabel}
            </label>
            <input
              type="text"
              placeholder={
                isResidentMode
                  ? lang === 'ru'
                    ? 'Например: Германия (Берлин), Отпуск в Риме'
                    : 'e.g. Germany visit, Vacation in Italy'
                  : t.titlePlaceholder
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.notesLabel}
            </label>
            <textarea
              rows={2}
              placeholder={t.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Planned trip checkbox */}
          <label className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/40 transition-colors">
            <input
              type="checkbox"
              checked={isPlanned}
              onChange={(e) => setIsPlanned(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-900 mt-0.5"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200 block">
                {t.plannedCheckboxTitle}
              </span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                {isResidentMode
                  ? lang === 'ru'
                    ? 'Позволяет смоделировать влияние выезда на 183 дня налогового резидентства'
                    : 'Forecasts impact on 183-day tax residency without affecting historical records'
                  : t.plannedCheckboxSubtitle}
              </span>
            </div>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 active:scale-95 transition-all min-h-[44px]"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all min-h-[44px]"
            >
              {t.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
