import React, { useState, useEffect } from 'react'
import { Calendar, Check, Compass, Globe, Plane, X } from 'lucide-react'
import type { Trip } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { EU_COUNTRIES } from '../lib/storage'
import { triggerHaptic } from '../lib/haptics'
import { format, parseISO, subDays } from 'date-fns'
import { getDateLocale } from '../lib/i18n'

// Popular world destinations outside EU for residents
export const POPULAR_WORLD_DESTINATIONS = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'OTHER', name: 'Other / Custom destination', flag: '🌍' },
]

interface StartOngoingTripModalProps {
  isOpen: boolean
  isResidentMode: boolean
  homeCountryCode?: string
  lang: Language
  t: TranslationDictionary
  onClose: () => void
  onStart: (entryDate: string, title: string, notes: string) => void
}

export const StartOngoingTripModal: React.FC<StartOngoingTripModalProps> = ({
  isOpen,
  isResidentMode,
  homeCountryCode = 'ES',
  lang,
  t,
  onClose,
  onStart,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  const yesterdayStr = subDays(new Date(), 1).toISOString().slice(0, 10)

  // Filter countries
  const availableCountries = isResidentMode
    ? [
        ...EU_COUNTRIES.filter((c) => c.code !== homeCountryCode),
        ...POPULAR_WORLD_DESTINATIONS,
      ]
    : EU_COUNTRIES // Schengen destinations

  const [selectedCountry, setSelectedCountry] = useState<string>(
    availableCountries[0]?.name || ''
  )
  const [customTitle, setCustomTitle] = useState('')
  const [entryDate, setEntryDate] = useState(todayStr)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setEntryDate(todayStr)
      setSelectedCountry(availableCountries[0]?.name || '')
      setCustomTitle('')
      setNotes('')
    }
  }, [isOpen, homeCountryCode])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!entryDate) return

    const finalTitle = customTitle.trim() || selectedCountry
    triggerHaptic('success')
    onStart(entryDate, finalTitle, notes.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in">
        {/* Mobile Pull Bar Grabber */}
        <div className="w-10 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${isResidentMode ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
              <Plane className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight truncate">
                {isResidentMode ? t.quickStartAbroadTitle : t.quickStartSchengenTitle}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {isResidentMode ? t.quickStartAbroadDesc : t.quickStartSchengenDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="start-ongoing-trip-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {/* Destination Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.destinationCountryLabel}</span>
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {availableCountries.map((c) => (
                <option key={c.code} value={`${c.flag} ${c.name}`}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Optional custom city / title */}
          <div>
            <input
              type="text"
              placeholder={
                lang === 'uk'
                  ? 'Конкретне місто або мета (необовʼязково)'
                  : 'City or purpose (optional, e.g. Berlin, Holiday)'
              }
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full h-10 bg-slate-950/70 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Departure / Entry Date with Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isResidentMode ? (lang === 'uk' ? 'Дата виїзду' : 'Departure Date') : t.entryDateLabel}</span>
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setEntryDate(todayStr)}
                className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  entryDate === todayStr
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'uk' ? 'Сьогодні' : 'Today'}
              </button>
              <button
                type="button"
                onClick={() => setEntryDate(yesterdayStr)}
                className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  entryDate === yesterdayStr
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'uk' ? 'Вчора' : 'Yesterday'}
              </button>
            </div>
            <input
              type="date"
              required
              max={todayStr}
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full min-w-0 max-w-full block h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </form>

        {/* Sticky Action Footer with Safe Bottom */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-md pb-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 active:scale-95 transition-all min-h-[44px] cursor-pointer"
          >
            {t.cancelBtn}
          </button>
          <button
            type="submit"
            form="start-ongoing-trip-form"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all min-h-[44px] cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>{t.startTrackingBtn}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface PickReturnDateModalProps {
  isOpen: boolean
  isResidentMode: boolean
  ongoingTrip: Trip | null
  lang: Language
  t: TranslationDictionary
  onClose: () => void
  onConfirm: (tripId: string, returnDate: string) => void
}

export const PickReturnDateModal: React.FC<PickReturnDateModalProps> = ({
  isOpen,
  isResidentMode,
  ongoingTrip,
  lang,
  t,
  onClose,
  onConfirm,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  const yesterdayStr = subDays(new Date(), 1).toISOString().slice(0, 10)
  const [returnDate, setReturnDate] = useState(todayStr)
  const dateLocale = getDateLocale(lang)

  useEffect(() => {
    if (isOpen) {
      setReturnDate(todayStr)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !ongoingTrip) return null

  const minDate = ongoingTrip.entryDate
  const formattedEntry = format(parseISO(ongoingTrip.entryDate), 'd MMMM yyyy', { locale: dateLocale })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!returnDate || returnDate < minDate) return
    triggerHaptic('success')
    onConfirm(ongoingTrip.id, returnDate)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in">
        {/* Mobile Pull Bar Grabber */}
        <div className="w-10 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight truncate">
                {t.returnDateModalTitle}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {isResidentMode
                  ? lang === 'uk'
                    ? `Поїздка розпочалася: ${formattedEntry}`
                    : `Trip started: ${formattedEntry}`
                  : `Entered Schengen: ${formattedEntry}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="pick-return-date-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isResidentMode
                ? lang === 'uk'
                  ? 'Коли ви повернулися до країни проживання?'
                  : 'When did you return to your residence country?'
                : 'When did you depart Schengen?'}
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setReturnDate(todayStr)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  returnDate === todayStr
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'uk' ? 'Сьогодні' : 'Today'}
              </button>
              {yesterdayStr >= minDate && (
                <button
                  type="button"
                  onClick={() => setReturnDate(yesterdayStr)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    returnDate === yesterdayStr
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lang === 'uk' ? 'Вчора' : 'Yesterday'}
                </button>
              )}
            </div>
            <input
              type="date"
              required
              min={minDate}
              max={todayStr}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full min-w-0 max-w-full block h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </form>

        {/* Sticky Action Footer with Safe Bottom */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-md pb-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 active:scale-95 transition-all min-h-[44px] cursor-pointer"
          >
            {t.cancelBtn}
          </button>
          <button
            type="submit"
            form="pick-return-date-form"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 active:scale-95 transition-all min-h-[44px] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.confirmReturnBtn}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
