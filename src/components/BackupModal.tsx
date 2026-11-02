import React, { useRef, useState, useEffect } from 'react'
import {
  AlertTriangle,
  Check,
  Cloud,
  Download,
  HardDrive,
  Info,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type { AppStorageData } from '../lib/storage'
import type { TranslationDictionary } from '../lib/i18n'
import {
  exportAllDataToJson,
  parseBackupJson,
  requestPersistentStorage,
} from '../lib/storage'
import { triggerHaptic } from '../lib/haptics'

interface BackupModalProps {
  isOpen: boolean
  data: AppStorageData
  t: TranslationDictionary
  onClose: () => void
  onImportData: (data: AppStorageData) => void
  onClearAll: () => void
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  data,
  t,
  onClose,
  onImportData,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null)
  const [isRequestingPersistence, setIsRequestingPersistence] = useState(false)
  const [persistenceFeedback, setPersistenceFeedback] = useState<{
    type: 'success' | 'info' | 'warning'
    message: string
    hint?: string
  } | null>(null)
  const [confirmClear, setConfirmClear] = useState<boolean>(false)

  const totalTripsCount = data.profiles.reduce((acc, p) => acc + p.trips.length, 0)

  useEffect(() => {
    if (isOpen && typeof navigator !== 'undefined' && navigator.storage?.persisted) {
      navigator.storage.persisted().then(setIsPersisted).catch(() => {})
    }
    if (!isOpen) {
      setPersistenceFeedback(null)
    }
  }, [isOpen])

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

  const handleExport = () => {
    exportAllDataToJson(data)
    triggerHaptic('medium')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const updatedData = parseBackupJson(text, data)
        onImportData(updatedData)
        triggerHaptic('medium')
        setImportStatus(t.importSuccess(updatedData.profiles.reduce((acc, p) => acc + p.trips.length, 0)))
        setTimeout(() => setImportStatus(null), 3000)
      } catch (err: any) {
        triggerHaptic('error')
        setImportStatus(t.importError(err.message || 'Invalid JSON file'))
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleRequestPersistence = async () => {
    setIsRequestingPersistence(true)
    setPersistenceFeedback(null)
    triggerHaptic('light')

    try {
      if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.persist) {
        setIsPersisted(false)
        setPersistenceFeedback({
          type: 'info',
          message: t.browserPersistenceStandard,
          hint: t.persistenceDeniedHint,
        })
        return
      }

      const granted = await requestPersistentStorage()
      setIsPersisted(granted)

      if (granted) {
        triggerHaptic('success')
        setPersistenceFeedback({
          type: 'success',
          message: t.persistenceGrantedToast,
        })
      } else {
        triggerHaptic('warning')
        setPersistenceFeedback({
          type: 'info',
          message: t.browserPersistenceStandard,
          hint: t.persistenceDeniedHint,
        })
      }
    } catch (err: any) {
      console.warn('Could not request persistent storage:', err)
      setPersistenceFeedback({
        type: 'warning',
        message: err.message || 'Browser declined persistence request',
        hint: t.persistenceDeniedHint,
      })
    } finally {
      setIsRequestingPersistence(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-fade-in safe-bottom z-10">
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3 sm:hidden" />
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.backupModalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {importStatus && (
            <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-200 text-xs">
              {importStatus}
            </div>
          )}

          {/* Persistent storage status */}
          <div className="space-y-2">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-semibold text-slate-200 block truncate">
                  {t.browserPersistenceTitle}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {isPersisted ? t.browserPersistenceActive : t.browserPersistenceStandard}
                </span>
              </div>

              {!isPersisted && (
                <button
                  type="button"
                  onClick={handleRequestPersistence}
                  disabled={isRequestingPersistence}
                  className="flex items-center gap-1.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-blue-400 px-3 py-1.5 rounded-xl border border-slate-700 transition-all min-h-[36px] shrink-0 active:scale-95"
                >
                  {isRequestingPersistence ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                      <span>...</span>
                    </>
                  ) : (
                    <span>{t.enablePersistenceBtn}</span>
                  )}
                </button>
              )}
              {isPersisted && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold shrink-0">
                  <Check className="w-3.5 h-3.5" /> {t.persistenceProtectedBadge}
                </span>
              )}
            </div>

            {/* Persistent storage feedback & browser guidance */}
            {persistenceFeedback && (
              <div
                className={`p-3.5 rounded-2xl border text-xs animate-fade-in space-y-1 ${
                  persistenceFeedback.type === 'success'
                    ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200'
                    : 'bg-blue-950/30 border-blue-500/30 text-blue-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {persistenceFeedback.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  <span>{persistenceFeedback.message}</span>
                </div>
                {persistenceFeedback.hint && (
                  <p className="text-[11px] text-slate-300/90 leading-relaxed pl-5">
                    {persistenceFeedback.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Export & Import */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300">{t.fileBackupSectionTitle}</h4>
              <span className="text-[11px] text-slate-500">
                {data.profiles.length} profiles · {totalTripsCount} trips
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={totalTripsCount === 0}
                className="flex items-center justify-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 disabled:opacity-40 rounded-2xl text-xs font-semibold text-slate-200 transition-all min-h-[44px]"
              >
                <Download className="w-4 h-4 text-blue-400" />
                {t.exportFileBtn}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-semibold text-slate-200 transition-all min-h-[44px]"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                {t.importFileBtn}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Cloudflare Sync Teaser */}
          <div className="p-4 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-indigo-500/20 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
              <Cloud className="w-4 h-4" />
              <span>{t.cloudSyncTitle}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.cloudSyncDesc}
            </p>
          </div>

          {/* Danger zone */}
          <div className="pt-3 border-t border-slate-800/80">
            {confirmClear ? (
              <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.dangerZoneConfirmText}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearAll()
                      setConfirmClear(false)
                      onClose()
                    }}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold min-h-[40px]"
                  >
                    {t.confirmClearAllBtn}
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium min-h-[40px]"
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={totalTripsCount === 0}
                className="text-xs text-rose-400/80 hover:text-rose-300 disabled:opacity-40 flex items-center gap-1.5 transition-colors py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.dangerZoneClearAll}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
