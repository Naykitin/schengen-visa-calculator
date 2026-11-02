import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, AlertTriangle, Check, Clock, Plane, RefreshCw, X } from 'lucide-react'
import type { Trip } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { getTripDuration, simulateTrip } from '../lib/schengen'
import { triggerHaptic } from '../lib/haptics'

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
  const [isSaving, setIsSaving] = useState(false)
  const [isSavedSuccess, setIsSavedSuccess] = useState(false)

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
    setIsSaving(false)
    setIsSavedSuccess(false)
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

  // Live simulation & calculation memoization (zero UI freeze)
  const isDateOrderValid = entryDate && exitDate && entryDate <= exitDate
  const duration = useMemo(() => {
    return isDateOrderValid ? getTripDuration(entryDate, exitDate) : 0
  }, [isDateOrderValid, entryDate, exitDate])

  const simulation = useMemo(() => {
    return !isResidentMode && isDateOrderValid
      ? simulateTrip(existingTrips, entryDate, exitDate, initialTrip?.id)
      : null
  }, [isResidentMode, isDateOrderValid, existingTrips, entryDate, exitDate, initialTrip?.id])

  if (!isOpen) return null

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

    setIsSaving(true)
    triggerHaptic('medium')

    const trip: Trip = {
      id: initialTrip?.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryDate,
      exitDate,
      title: title.trim() || undefined,
      notes: notes.trim() || undefined,
      isPlanned,
    }

    // Micro-delay gives the user immediate visual confirmation of the save action
    setTimeout(() => {
      setIsSaving(false)
      setIsSavedSuccess(true)
      triggerHaptic('success')
      setTimeout(() => {
        onSave(trip)
        setIsSavedSuccess(false)
      }, 250)
    }, 200)
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
                    : lang === 'de'
                    ? `Auslandsaufenthalt außerhalb von ${countryName}`
                    : lang === 'fr'
                    ? `Absence hors de ${countryName}`
                    : lang === 'pl'
                    ? `Wyjazd poza ${countryName}`
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center min-h-[20px]">
                {isResidentMode
                  ? lang === 'ru'
                    ? 'Дата выезда'
                    : lang === 'de'
                    ? 'Abreisedatum'
                    : lang === 'fr'
                    ? 'Date de départ'
                    : lang === 'pl'
                    ? 'Data wyjazdu'
                    : 'Departure Date'
                  : t.entryDateLabel}
              </label>
              <input
                type="date"
                required
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full min-w-0 max-w-full block h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center min-h-[20px]">
                {isResidentMode
                  ? lang === 'ru'
                    ? 'Дата возврата'
                    : lang === 'de'
                    ? 'Rückreisedatum'
                    : lang === 'fr'
                    ? 'Date de retour'
                    : lang === 'pl'
                    ? 'Data powrotu'
                    : 'Return Date'
                  : t.exitDateLabel}
              </label>
              <input
                type="date"
                required
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                className="w-full min-w-0 max-w-full block h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Duration Badge & Live Warning */}
          {duration > 0 && (
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs animate-fade-in transition-all">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {isResidentMode
                  ? lang === 'ru'
                    ? 'Срок отсутствия:'
                    : lang === 'de'
                    ? 'Abwesenheitsdauer:'
                    : lang === 'fr'
                    ? 'Durée de l\'absence :'
                    : lang === 'pl'
                    ? 'Czas nieobecności:'
                    : 'Absence duration:'
                  : lang === 'ru'
                  ? 'Длительность пребывания:'
                  : 'Stay duration:'}
              </span>
              <span className="font-bold text-slate-100 flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300">
                <Check className="w-3 h-3 text-emerald-400" />
                {isResidentMode ? t.abroadDuration(duration) : t.durationDays(duration)}
              </span>
            </div>
          )}

          {/* EU Resident Mode: Alert if single trip exceeds 6 continuous months (> 183 days) */}
          {isResidentMode && duration > 183 && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 animate-fade-in space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {lang === 'ru'
                    ? 'Внимание: выезд длится более 6 месяцев (183 дней)!'
                    : lang === 'de'
                    ? 'Achtung: Einzelabwesenheit überschreitet 6 Monate (183 Tage)!'
                    : lang === 'fr'
                    ? 'Attention : le séjour dépasse 6 mois consécutifs (183 jours) !'
                    : lang === 'pl'
                    ? 'Uwaga: wyjazd trwa dłużej niż 6 miesięcy (183 dni)!'
                    : 'Warning: Single absence exceeds 6 continuous months (183 days)!'}
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                {lang === 'ru'
                  ? 'Непрерывное отсутствие более 6 месяцев подряд может поставить под угрозу статус ПМЖ ЕС (Директива 2003/109/EC) или национальный вид на жительство.'
                  : 'Continuous absence exceeding 6 consecutive months can jeopardize EU long-term residency status (Directive 2003/109/EC).'}
              </p>
            </div>
          )}

          {/* Overstay Warning in Schengen mode */}
          {simulation && !simulation.isValid && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 animate-fade-in">
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
              disabled={isSaving || isSavedSuccess}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 active:scale-95 transition-all min-h-[44px] disabled:opacity-50"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isSaving || isSavedSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg transition-all min-h-[44px] ${
                isSavedSuccess
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 active:scale-95'
              } disabled:opacity-90`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {lang === 'ru'
                      ? 'Сохранение...'
                      : lang === 'de'
                      ? 'Speichern...'
                      : lang === 'fr'
                      ? 'Enregistrement...'
                      : lang === 'pl'
                      ? 'Zapisywanie...'
                      : 'Saving...'}
                  </span>
                </>
              ) : isSavedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>
                    {lang === 'ru'
                      ? 'Сохранено!'
                      : lang === 'de'
                      ? 'Gespeichert!'
                      : lang === 'fr'
                      ? 'Enregistré !'
                      : lang === 'pl'
                      ? 'Zapisano!'
                      : 'Saved!'}
                  </span>
                </>
              ) : (
                <span>{t.saveBtn}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
