import React from 'react'
import { Cloud, Download, Globe, HelpCircle, Plus, RefreshCw, User, WifiOff } from 'lucide-react'
import type { Language, TranslationDictionary } from '../lib/i18n'
import { SUPPORTED_LANGUAGES } from '../lib/i18n'
import type { Profile } from '../lib/storage'
import { PROFILE_COLORS, EU_COUNTRIES } from '../lib/storage'

interface HeaderProps {
  lang: Language
  t: TranslationDictionary
  activeProfile: Profile
  isOnline: boolean
  hasUpdate: boolean
  isSyncActive: boolean
  onReloadApp: () => void
  onOpenProfileModal: () => void
  onOpenSyncModal: () => void
  onSelectLanguage: (lang: Language) => void
  onOpenAddModal: () => void
  onOpenBackupModal: () => void
  onOpenInfoModal: () => void
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  t,
  activeProfile,
  isOnline,
  hasUpdate,
  isSyncActive,
  onReloadApp,
  onOpenProfileModal,
  onOpenSyncModal,
  onSelectLanguage,
  onOpenAddModal,
  onOpenBackupModal,
  onOpenInfoModal,
}) => {
  const profileColor = PROFILE_COLORS.find((c) => c.id === activeProfile.color) || PROFILE_COLORS[0]
  const isResident = activeProfile.mode === 'eu_resident'
  const countryFlag = isResident
    ? (EU_COUNTRIES.find((c) => c.code === (activeProfile.country || 'ES'))?.flag || '🇪🇸')
    : '🇪🇺'

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 safe-top px-3 sm:px-6 pb-2.5 sm:pb-4 transition-all w-full overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 min-w-0 w-full">
        {/* Left: Logo & Title & Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 shrink-0">
            <span className="text-amber-300 font-black text-xs sm:text-sm tracking-tighter">90</span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              {t.appTitle}
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                EU
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 leading-none">{t.appSubtitle}</p>
          </div>

          {/* Profile Switcher Pill */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 sm:gap-2 py-1 px-2 sm:px-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all active:scale-95 min-h-[34px] sm:min-h-[36px] min-w-0"
            title={t.profilesTitle}
          >
            <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${profileColor.bg} inline-block shrink-0`} />
            <span className="font-semibold max-w-[65px] xs:max-w-[90px] sm:max-w-[120px] truncate">{activeProfile.name}</span>
            <span className="text-xs shrink-0">{countryFlag}</span>
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Center: Offline indicator & New version update banner */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isOnline && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-1 rounded-xl">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.offlineBadge}</span>
            </div>
          )}

          {hasUpdate && (
            <button
              onClick={onReloadApp}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-xl animate-pulse hover:bg-emerald-500/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.updateNowBtn}</span>
            </button>
          )}
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Cloudflare Sync status button */}
          <button
            onClick={onOpenSyncModal}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs font-medium transition-all active:scale-95 min-h-[34px] sm:min-h-[36px] flex items-center gap-1.5 ${
              isSyncActive
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-900'
            }`}
            title={isSyncActive ? t.syncActiveBadge : t.syncDisabledBadge}
          >
            <Cloud className="w-4 h-4" />
            <span className="hidden md:inline">{isSyncActive ? 'Sync ON' : 'Sync'}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <select
              value={lang}
              onChange={(e) => onSelectLanguage(e.target.value as Language)}
              className="bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs font-bold rounded-xl pl-2 pr-5 sm:pr-7 py-1 sm:py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all min-h-[34px] sm:min-h-[36px] appearance-none"
              title="Select Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                  {l.flag} {l.code.toUpperCase()}
                </option>
              ))}
            </select>
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute right-1.5 sm:right-2 pointer-events-none" />
          </div>

          {/* Backup & Data Modal */}
          <button
            onClick={onOpenBackupModal}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors min-h-[34px] sm:min-h-[36px]"
            title={t.backupAndExport}
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Info Modal */}
          <button
            onClick={onOpenInfoModal}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors min-h-[34px] sm:min-h-[36px]"
            title={t.aboutRule}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Primary Action Button: Add Trip (Desktop & Tablet only; mobile uses bottom floating + button) */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all min-h-[36px]"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isResident ? t.logAbroadTripBtn : t.addTrip}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
