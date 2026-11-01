import React, { useState, useEffect } from 'react'
import { Check, Plus, Trash2, User, Users, X } from 'lucide-react'
import type { AppStorageData } from '../lib/storage'
import { PROFILE_COLORS } from '../lib/storage'
import type { TranslationDictionary } from '../lib/i18n'
import { triggerHaptic } from '../lib/haptics'

interface ProfileModalProps {
  isOpen: boolean
  data: AppStorageData
  t: TranslationDictionary
  onClose: () => void
  onSelectProfile: (profileId: string) => void
  onAddProfile: (name: string, color: string) => void
  onDeleteProfile: (profileId: string) => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  data,
  t,
  onClose,
  onSelectProfile,
  onAddProfile,
  onDeleteProfile,
}) => {
  const [newProfileName, setNewProfileName] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')
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

    onAddProfile(newProfileName.trim(), selectedColor)
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-fade-in safe-bottom z-10">
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.profilesTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Existing profiles list */}
        <div className="space-y-2 my-4">
          {data.profiles.map((profile) => {
            const isActive = profile.id === data.activeProfileId
            const colorOption = PROFILE_COLORS.find((c) => c.id === profile.color) || PROFILE_COLORS[0]

            return (
              <div
                key={profile.id}
                onClick={() => {
                  onSelectProfile(profile.id)
                  triggerHaptic('light')
                  onClose()
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${colorOption.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                  >
                    <User className="w-4 h-4" />
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
                    <p className="text-[11px] text-slate-400">
                      {profile.trips.length} {t.daysUsed} ({profile.trips.length} entries)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {data.profiles.length > 1 && (
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title={t.deleteProfile}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add profile form */}
        {isAdding ? (
          <form onSubmit={handleCreateProfile} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 mt-4">
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
