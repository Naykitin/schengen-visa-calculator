import React, { useState, useEffect } from 'react'
import { Check, Plus, Trash2, User, Users, X } from 'lucide-react'
import type { AppStorageData, Profile, ProfileMode } from '../lib/storage'
import { PROFILE_COLORS, EU_COUNTRIES } from '../lib/storage'
import type { TranslationDictionary } from '../lib/i18n'
import { triggerHaptic } from '../lib/haptics'

interface ProfileModalProps {
  isOpen: boolean
  data: AppStorageData
  t: TranslationDictionary
  onClose: () => void
  onSelectProfile: (profileId: string) => void
  onAddProfile: (name: string, color: string, mode: ProfileMode, country: string) => void
  onUpdateProfile: (profileId: string, updates: Partial<Profile>) => void
  onDeleteProfile: (profileId: string) => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  data,
  t,
  onClose,
  onSelectProfile,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
}) => {
  const [newProfileName, setNewProfileName] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')
  const [selectedMode, setSelectedMode] = useState<ProfileMode>('schengen')
  const [selectedCountry, setSelectedCountry] = useState('ES')
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProfileName.trim()) {
      setError('Please enter a profile name')
      return
    }

    onAddProfile(newProfileName.trim(), selectedColor, selectedMode, selectedCountry)
    triggerHaptic('medium')
    setNewProfileName('')
    setIsAdding(false)
    setError(null)
  }

  const handleDelete = (profileId: string) => {
    if (data.profiles.length <= 1) {
      setError(t.cannotDeleteOnlyProfile)
      return
    }

    onDeleteProfile(profileId)
    triggerHaptic('warning')
  }

  const toggleProfileMode = (profile: Profile) => {
    const newMode: ProfileMode = profile.mode === 'eu_resident' ? 'schengen' : 'eu_resident'
    onUpdateProfile(profile.id, { mode: newMode, country: profile.country || 'ES' })
    triggerHaptic('light')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {t.profilesTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Schengen Visitors & EU Residents (All 27 EU Member States)
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
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Profiles List */}
        <div className="space-y-3 mb-4">
          {data.profiles.map((profile) => {
            const isActive = profile.id === data.activeProfileId
            const colorOption = PROFILE_COLORS.find((c) => c.id === profile.color) || PROFILE_COLORS[0]
            const isResident = profile.mode === 'eu_resident'

            return (
              <div
                key={profile.id}
                onClick={() => {
                  onSelectProfile(profile.id)
                  triggerHaptic('light')
                  onClose()
                }}
                className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${colorOption.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                    >
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        {profile.name}
                        {isActive && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {profile.trips.length}{' '}
                        {isResident
                          ? profile.trips.length === 1
                            ? 'absence recorded'
                            : 'absences recorded'
                          : profile.trips.length === 1
                          ? 'trip recorded'
                          : 'trips recorded'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {data.profiles.length > 1 && (
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title={t.deleteProfile}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Mode & Country badge toggle row */}
                <div
                  className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {isResident ? (
                      <select
                        value={profile.country || 'ES'}
                        onChange={(e) => {
                          onUpdateProfile(profile.id, { country: e.target.value })
                          triggerHaptic('light')
                        }}
                        className="bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        title={t.homeCountryLabel}
                      >
                        {EU_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px] font-medium">
                        <span>🇪🇺</span>
                        <span>Schengen Visitor (90/180)</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleProfileMode(profile)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
                  >
                    {isResident ? t.switchToSchengenBtn : t.switchToResidentBtn}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add profile form */}
        {isAdding ? (
          <form onSubmit={handleCreateProfile} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3.5 mt-4">
            <h4 className="text-xs font-bold text-slate-200">{t.addProfile}</h4>

            <div>
              <input
                type="text"
                autoFocus
                placeholder={t.profileNamePlaceholder}
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Mode selection: Schengen vs Resident */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                {t.profileModeLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMode('schengen')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'schengen'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold flex items-center gap-1">
                    <span>🇪🇺</span> {t.modeSchengen}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    90/180 Visitor
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('eu_resident')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'eu_resident'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold flex items-center gap-1">
                    <span>🌍</span> {t.modeResident}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    183d Tax & Absences
                  </p>
                </button>
              </div>
            </div>

            {/* Country Selector (if resident mode) */}
            {selectedMode === 'eu_resident' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  {t.homeCountryLabel}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {EU_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color selection */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Color</label>
              <div className="flex items-center gap-2">
                {PROFILE_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-7 h-7 rounded-xl ${c.bg} flex items-center justify-center transition-all ${
                      selectedColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {selectedColor === c.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30"
              >
                {t.saveBtn}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 px-3 border border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl text-xs font-semibold text-slate-300 hover:text-blue-400 flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            {t.addProfile}
          </button>
        )}
      </div>
    </div>
  )
}
