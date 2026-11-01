import React, { useRef, useState, useEffect } from 'react'
import {
  AlertTriangle,
  Check,
  Cloud,
  Download,
  HardDrive,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type { Trip } from '../lib/schengen'
import {
  exportTripsToJson,
  parseTripsJson,
  requestPersistentStorage,
} from '../lib/storage'

interface BackupModalProps {
  isOpen: boolean
  trips: Trip[]
  onClose: () => void
  onImportTrips: (trips: Trip[]) => void
  onClearAll: () => void
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  trips,
  onClose,
  onImportTrips,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null)
  const [confirmClear, setConfirmClear] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen && typeof navigator !== 'undefined' && navigator.storage?.persisted) {
      navigator.storage.persisted().then(setIsPersisted).catch(() => {})
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
    exportTripsToJson(trips)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseTripsJson(text)
        onImportTrips(parsed)
        setImportStatus(`Успешно импортировано ${parsed.length} поездок!`)
        setTimeout(() => setImportStatus(null), 3000)
      } catch (err: any) {
        setImportStatus(`Ошибка импорта: ${err.message || 'Неверный формат файла'}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleRequestPersistence = async () => {
    const granted = await requestPersistentStorage()
    setIsPersisted(granted)
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
            <h3 className="text-base font-bold text-white">Резервное копирование и данные</h3>
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
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Защита от очистки браузером
              </span>
              <span className="text-[11px] text-slate-400">
                {isPersisted ? 'Включена (Persistent Storage)' : 'Стандартный кэш'}
              </span>
            </div>

            {!isPersisted && (
              <button
                onClick={handleRequestPersistence}
                className="text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded-xl border border-slate-700 transition-all min-h-[36px]"
              >
                Закрепить в памяти
              </button>
            )}
            {isPersisted && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> Защищено
              </span>
            )}
          </div>

          {/* Export & Import */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300">Файловый бэкап (JSON)</h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={trips.length === 0}
                className="flex items-center justify-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 disabled:opacity-40 rounded-2xl text-xs font-semibold text-slate-200 transition-all min-h-[44px]"
              >
                <Download className="w-4 h-4 text-blue-400" />
                Экспорт в файл
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-semibold text-slate-200 transition-all min-h-[44px]"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                Импорт из файла
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
              <span>Облачная синхронизация (Cloudflare D1)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Вы сможете подключить синхронизацию со своим аккаунтом Cloudflare Workers + D1 для мгновенного доступа к поездкам на любых устройствах.
            </p>
          </div>

          {/* Danger zone */}
          <div className="pt-3 border-t border-slate-800/80">
            {confirmClear ? (
              <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Удалить абсолютно все поездки? Это действие нельзя отменить.</span>
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
                    Да, удалить всё
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium min-h-[40px]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={trips.length === 0}
                className="text-xs text-rose-400/80 hover:text-rose-300 disabled:opacity-40 flex items-center gap-1.5 transition-colors py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Очистить всю базу поездок
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
