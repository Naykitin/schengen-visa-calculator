import React, { useState, useEffect } from 'react'
import { AlertCircle, Check, Plane, X } from 'lucide-react'
import type { Trip } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { getTripDuration, simulateTrip } from '../lib/schengen'

interface TripModalProps {
  isOpen: boolean
  initialTrip?: Trip | null
  existingTrips: Trip[]
  lang: Language
  t: TranslationDictionary
  onClose: () => void
  onSave: (trip: Trip) => void
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  initialTrip,
  existingTrips,
  lang,
  t,
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

  const duration = entryDate && exitDate ? getTripDuration(entryDate, exitDate) : 0
  const isDateOrderValid = entryDate && exitDate && entryDate <= exitDate

  // Real-time simulation of adding/editing this trip
  const simulation =
    isDateOrderValid && duration > 0
      ? simulateTrip(existingTrips, entryDate, exitDate, initialTrip?.id)
      : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!entryDate || !exitDate) {
      setError(t.errSelectDates)
      return
    }
    if (entryDate > exitDate) {
      setError(t.errExitBeforeEntry)
      return
    }

    const savedTrip: Trip = {
      id: initialTrip ? initialTrip.id : `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryDate,
      exitDate,
      title: title.trim() || (lang === 'ru' ? 'Поездка в Шенген' : 'Schengen Trip'),
      notes: notes.trim(),
      isPlanned,
    }

    onSave(savedTrip)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-fade-in safe-bottom z-10">
        {/* Mobile drag handle indicator */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {initialTrip ? t.modalEditTripTitle : t.modalNewTripTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.entryDateLabel}
              </label>
              <input
                type="date"
                required
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.exitDateLabel}
              </label>
              <input
                type="date"
                required
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick duration indicator & 90/180 check */}
          {duration > 0 && simulation && (
            <div
              className={`p-3.5 rounded-2xl border text-xs ${
                simulation.isValid
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{t.durationDays(duration)}</span>
                <span>
                  {simulation.isValid
                    ? t.maxUsedDuringTrip(simulation.maxDaysUsedDuringTrip)
                    : t.overstayAlert}
                </span>
              </div>
              {!simulation.isValid && simulation.firstViolationDate && (
                <p className="mt-1 text-[11px] text-rose-300/90">
                  {t.overstayStartsFrom(simulation.firstViolationDate)}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.titleLabel}
            </label>
            <input
              type="text"
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.notesLabel}
            </label>
            <textarea
              rows={2}
              placeholder={t.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-950 transition-colors">
            <input
              type="checkbox"
              checked={isPlanned}
              onChange={(e) => setIsPlanned(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200 block">{t.plannedCheckboxTitle}</span>
              <span className="text-slate-500 text-[11px]">
                {t.plannedCheckboxSubtitle}
              </span>
            </div>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {t.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
