import React, { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Edit2,
  Home,
  Plane,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import type { SchengenSummary, Trip } from '../lib/schengen'
import { getTripDuration } from '../lib/schengen'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { getDateLocale } from '../lib/i18n'
import type { Profile } from '../lib/storage'
import { EU_COUNTRIES } from '../lib/storage'
import { calculateResidenceYearSummary, calculatePermanentResidenceSummary } from '../lib/residence'
import { StartOngoingTripModal, PickReturnDateModal } from './LiveTripModals'
import { format, parseISO } from 'date-fns'

interface StatusCardProps {
  summary: SchengenSummary
  referenceDate: string
  activeProfile: Profile
  lang: Language
  t: TranslationDictionary
  onReferenceDateChange: (date: string) => void
  onResetReferenceDate: () => void
  onToggleProfileMode?: () => void
  onUpdateCountry?: (countryCode: string) => void
  onStartOngoingTrip?: (entryDate: string, title: string, notes: string) => void
  onEndOngoingTrip?: (tripId: string, returnDate?: string) => void
  onEditTrip?: (trip: Trip) => void
}

export const StatusCard: React.FC<StatusCardProps> = ({
  summary,
  referenceDate,
  activeProfile,
  lang,
  t,
  onReferenceDateChange,
  onResetReferenceDate,
  onToggleProfileMode,
  onUpdateCountry,
  onStartOngoingTrip,
  onEndOngoingTrip,
  onEditTrip,
}) => {
  const [isOverstayDismissed, setIsOverstayDismissed] = useState(false)
  const [isStartOngoingModalOpen, setIsStartOngoingModalOpen] = useState(false)
  const [isPickReturnModalOpen, setIsPickReturnModalOpen] = useState(false)

  const isToday = referenceDate === new Date().toISOString().slice(0, 10)
  const dateLocale = getDateLocale(lang)
  const formattedRefDate = format(parseISO(referenceDate), 'd MMMM yyyy', { locale: dateLocale })

  // Active ongoing trip tracking
  const ongoingTrip = activeProfile.trips?.find((t) => t.ongoing) || null
  const ongoingDuration = ongoingTrip
    ? getTripDuration(ongoingTrip.entryDate, ongoingTrip.exitDate, true, referenceDate)
    : 0
  const formattedOngoingStart = ongoingTrip
    ? format(parseISO(ongoingTrip.entryDate), 'd MMM yyyy', { locale: dateLocale })
    : ''

  // Year state for EU Resident mode (defaults to year of referenceDate)
  const refYear = parseISO(referenceDate).getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(refYear)

  const isResidentMode = activeProfile.mode === 'eu_resident'
  const countryObj = EU_COUNTRIES.find((c) => c.code === (activeProfile.country || 'ES')) || EU_COUNTRIES[0]

  // Top-level hooks (must never be called conditionally)
  const resSummary = useMemo(
    () =>
      isResidentMode
        ? calculateResidenceYearSummary(
            activeProfile.trips,
            selectedYear,
            activeProfile.taxTargetDays || 183
          )
        : null,
    [isResidentMode, activeProfile.trips, selectedYear, activeProfile.taxTargetDays]
  )

  const permSummary = useMemo(
    () =>
      isResidentMode
        ? calculatePermanentResidenceSummary(activeProfile.trips, referenceDate)
        : null,
    [isResidentMode, activeProfile.trips, referenceDate]
  )

  // =========================================================================
  // EU RESIDENT & TAX TRACKER VIEW
  // =========================================================================
  if (isResidentMode && resSummary && permSummary) {
    const taxProgressPercent = Math.min(
      100,
      Math.round((resSummary.daysInside / resSummary.taxTargetDays) * 100)
    )

    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
        {/* Ambient glow effects */}
        <div className="absolute -right-16 -top-16 w-52 h-52 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row: Country Selector & Year Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <select
              value={activeProfile.country || 'ES'}
              onChange={(e) => onUpdateCountry?.(e.target.value)}
              className="bg-slate-950/90 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-all shadow-sm"
              title={t.homeCountryLabel}
            >
              {EU_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
              Pan-European 183d
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Year selector buttons */}
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => setSelectedYear((y) => y - 1)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Previous Year"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-200 px-2">
                {selectedYear}
              </span>
              <button
                type="button"
                onClick={() => setSelectedYear((y) => y + 1)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Next Year"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {onToggleProfileMode && (
              <button
                type="button"
                onClick={onToggleProfileMode}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1"
                title="Switch mode"
              >
                {t.switchToSchengenBtn}
              </button>
            )}
          </div>
        </div>

        {/* Live Active Trip Abroad Banner or Quick Departure Launcher */}
        {ongoingTrip ? (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {t.liveStayTitle}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{t.currentlyAbroadLive(ongoingTrip.title)}</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span className="font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                    {t.dayCountSince(ongoingDuration, formattedOngoingStart)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {t.safeRemainingAbroad(resSummary.safeRemainingAbsenceDays)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={() => onEndOngoingTrip?.(ongoingTrip.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  {t.returnedTodayBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPickReturnModalOpen(true)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium transition-colors"
                  title={t.pickReturnDateBtn}
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
                {onEditTrip && (
                  <button
                    type="button"
                    onClick={() => onEditTrip(ongoingTrip)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition-colors"
                    title={t.editTrip}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setIsStartOngoingModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {t.iAmLeavingNowBtn}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {t.quickStartAbroadDesc}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0 ml-2">
                + {lang === 'ru' ? 'Выехать' : 'Start'}
              </span>
            </button>
          </div>
        )}

        {/* Warning if any single trip exceeded 6 months */}
        {resSummary.hasSingleTripViolation && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-300">{t.singleTripViolationAlert}</p>
              <p className="text-amber-200/80 mt-0.5">
                Longest absence: {resSummary.longestSingleTripDays} consecutive days.
              </p>
            </div>
          </div>
        )}

        {/* Primary Stats Blocks for Resident */}
        <div className="grid grid-cols-2 gap-4 my-2">
          {/* Days in Home Country */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t.daysInCountry(countryObj.name)}</span>
              <Home className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="my-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {resSummary.daysInside}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">
                / {resSummary.totalDaysInYear}
              </span>
            </div>
            <div className="text-[11px]">
              {resSummary.isTaxResidentSecured ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" />
                  {t.taxRequirementMet(resSummary.taxTargetDays, countryObj.name)}
                </span>
              ) : (
                <span className="text-amber-400 font-medium">
                  {t.taxDaysNeeded(resSummary.daysNeededForTax)}
                </span>
              )}
            </div>
          </div>

          {/* Days Abroad (Absences) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t.daysOutsideCountry}</span>
              <Plane className="w-4 h-4 text-blue-400" />
            </div>
            <div className="my-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-200">
                {resSummary.daysOutside}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">{t.days}</span>
            </div>
            <div className="text-[11px] text-slate-300">
              {resSummary.safeRemainingAbsenceDays > 0 ? (
                <span className="text-blue-300">
                  {t.safeRemainingAbroad(resSummary.safeRemainingAbsenceDays)}
                </span>
              ) : (
                <span className="text-rose-400 font-semibold">
                  {t.taxLimitExceeded}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 183-Day Tax Milestone Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5 font-medium">
            <span>{t.taxMilestone183} (Target: {resSummary.taxTargetDays} days)</span>
            <span className={resSummary.isTaxResidentSecured ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
              {resSummary.daysInside} / {resSummary.taxTargetDays} days ({taxProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                resSummary.isTaxResidentSecured
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((resSummary.daysInside / resSummary.totalDaysInYear) * 100))}%` }}
            />
          </div>
        </div>

        {/* 5-Year Permanent Residence (Larga Duración / Directive 2003/109/EC) Section */}
        <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>🛡️</span> {t.permResidence5YearTitle}
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {t.permResidence5YearDesc(permSummary.totalAbsenceLast5Years, permSummary.fiveYearAbsenceLimitDays)}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              permSummary.has5YearOverstay
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {permSummary.has5YearOverstay ? 'Exceeded' : 'Healthy'}
          </span>
        </div>
        {/* Modals for Live Trip Tracking */}
        <StartOngoingTripModal
          isOpen={isStartOngoingModalOpen}
          isResidentMode={true}
          homeCountryCode={activeProfile.country || 'ES'}
          lang={lang}
          t={t}
          onClose={() => setIsStartOngoingModalOpen(false)}
          onStart={(entryDate, title, notes) => onStartOngoingTrip?.(entryDate, title, notes)}
        />

        <PickReturnDateModal
          isOpen={isPickReturnModalOpen}
          isResidentMode={true}
          ongoingTrip={ongoingTrip}
          lang={lang}
          t={t}
          onClose={() => setIsPickReturnModalOpen(false)}
          onConfirm={(tripId, returnDate) => onEndOngoingTrip?.(tripId, returnDate)}
        />
      </div>
    )
  }

  // =========================================================================
  // SCHENGEN VISITOR (90/180) VIEW
  // =========================================================================
  const percentUsed = Math.min(100, Math.round((summary.daysUsedInWindow / 90) * 100))

  let statusBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  let gaugeColor = 'from-blue-500 to-indigo-500'
  if (summary.daysUsedInWindow >= 90) {
    statusBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    gaugeColor = 'from-rose-500 to-red-600'
  } else if (summary.daysUsedInWindow >= 75) {
    statusBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    gaugeColor = 'from-amber-500 to-orange-500'
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background glow effects */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Date selector header row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          <span>{t.referenceDate}</span>
          <span className="font-semibold text-slate-200">{formattedRefDate}</span>
          {!isToday && (
            <button
              onClick={onResetReferenceDate}
              className="text-[11px] text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1"
            >
              {t.resetToday}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={referenceDate}
            onChange={(e) => e.target.value && onReferenceDateChange(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-blue-500 transition-colors"
          />

          {onToggleProfileMode && (
            <button
              type="button"
              onClick={onToggleProfileMode}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
              title="Switch mode"
            >
              {t.switchToResidentBtn}
            </button>
          )}
        </div>
      </div>

      {/* Live Active Schengen Stay Banner or Quick Entry Launcher */}
      {ongoingTrip ? (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/40 border border-blue-500/40 shadow-lg shadow-blue-500/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  {t.liveStayTitle}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{t.currentlyInSchengenLive(ongoingTrip.title)}</span>
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/30">
                  {t.dayCountSince(ongoingDuration, formattedOngoingStart)}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {t.daysRemaining}: {summary.daysRemainingToday} / 90
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => onEndOngoingTrip?.(ongoingTrip.id)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
              >
                {t.departedSchengenTodayBtn}
              </button>
              <button
                type="button"
                onClick={() => setIsPickReturnModalOpen(true)}
                className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium transition-colors"
                title={t.pickDepartureDateBtn}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              {onEditTrip && (
                <button
                  type="button"
                  onClick={() => onEditTrip(ongoingTrip)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition-colors"
                  title={t.editTrip}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsStartOngoingModalOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  {t.iEnteredSchengenNowBtn}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {t.quickStartSchengenDesc}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0 ml-2">
              + {lang === 'ru' ? 'Въехать' : 'Start'}
            </span>
          </button>
        </div>
      )}

      {/* Overstay alert banner with Dismiss button */}
      {summary.hasOverstay && !isOverstayDismissed && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-rose-300">{t.overstayWarningTitle}</p>
              <p className="text-rose-200/80 mt-0.5">
                {t.overstayWarningDesc(summary.firstOverstayDate)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOverstayDismissed(true)}
            className="p-1 rounded-lg text-rose-400 hover:text-rose-100 hover:bg-rose-500/30 transition-colors shrink-0"
            title="Dismiss"
            aria-label="Close warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary stats blocks */}
      <div className="grid grid-cols-2 gap-4 my-2">
        {/* Remaining Days */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.daysRemaining}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {summary.daysRemainingToday}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">{t.of90}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {summary.currentlyInSchengen ? (
              <span className="text-emerald-400 font-medium">
                {t.continuousStayRemaining(summary.maxContinuousStayRemaining)}
              </span>
            ) : summary.daysRemainingToday > 0 ? (
              <span>{t.canEnterConsecutively(summary.maxContinuousStayRemaining)}</span>
            ) : (
              <span className="text-rose-400 font-medium">{t.limitExhausted}</span>
            )}
          </div>
        </div>

        {/* Used Days */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.daysUsed}</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-200">
              {summary.daysUsedInWindow}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">{t.days}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {t.last180Days}
          </div>
        </div>
      </div>

      {/* 90-day Quota Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5 font-medium">
          <span>{t.quotaUsage}</span>
          <span>{percentUsed}%</span>
        </div>
        <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gaugeColor} transition-all duration-500`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Real-time Presence Indicator */}
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
            {summary.currentlyInSchengen ? t.inSchengen : t.outsideSchengen}
          </span>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeColor}`}>
          {summary.daysUsedInWindow >= 90
            ? t.limitExhausted
            : summary.currentlyInSchengen
            ? t.stayPermitted
            : t.entryPermitted}
        </span>
      </div>

      {/* Recovery Dates Section */}
      {summary.recoveryDates.length > 0 && summary.daysUsedInWindow > 0 && (
        <div className="mt-4 p-3 bg-blue-950/30 border border-blue-900/40 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1.5">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>{t.recoveryTitle}</span>
          </div>
          <div className="space-y-1">
            {summary.recoveryDates.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px] text-slate-300">
                <span className="text-slate-400">
                  {format(parseISO(item.date), 'd MMM yyyy', { locale: dateLocale })}:
                </span>
                <span className="font-semibold text-emerald-400">{t.daysGained(item.daysGained)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals for Live Trip Tracking */}
      <StartOngoingTripModal
        isOpen={isStartOngoingModalOpen}
        isResidentMode={false}
        lang={lang}
        t={t}
        onClose={() => setIsStartOngoingModalOpen(false)}
        onStart={(entryDate, title, notes) => onStartOngoingTrip?.(entryDate, title, notes)}
      />

      <PickReturnDateModal
        isOpen={isPickReturnModalOpen}
        isResidentMode={false}
        ongoingTrip={ongoingTrip}
        lang={lang}
        t={t}
        onClose={() => setIsPickReturnModalOpen(false)}
        onConfirm={(tripId, returnDate) => onEndOngoingTrip?.(tripId, returnDate)}
      />
    </div>
  )
}
