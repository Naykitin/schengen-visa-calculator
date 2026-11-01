import React, { useState, useEffect } from 'react'
import {
  Check,
  Cloud,
  Copy,
  HelpCircle,
  Key,
  Link,
  Power,
  RefreshCw,
  X,
} from 'lucide-react'
import type { TranslationDictionary } from '../lib/i18n'
import { buildPairingUrl } from '../lib/sync'
import { triggerHaptic } from '../lib/haptics'

interface SyncModalProps {
  isOpen: boolean
  syncKey: string | null
  autoSync: boolean
  lastSyncTime: number | null
  isSyncing: boolean
  syncError: string | null
  t: TranslationDictionary
  onClose: () => void
  onEnableNewSyncKey: () => void
  onConnectSyncKey: (key: string) => void
  onToggleAutoSync: (enabled: boolean) => void
  onManualSync: () => void
  onDisconnectSync: () => void
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  syncKey,
  autoSync,
  lastSyncTime,
  isSyncing,
  syncError,
  t,
  onClose,
  onEnableNewSyncKey,
  onConnectSyncKey,
  onToggleAutoSync,
  onManualSync,
  onDisconnectSync,
}) => {
  const [inputKey, setInputKey] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

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

  const handleCopyKey = () => {
    if (!syncKey) return
    navigator.clipboard.writeText(syncKey)
    triggerHaptic('light')
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopyPairingLink = () => {
    if (!syncKey) return
    const url = buildPairingUrl(syncKey)
    navigator.clipboard.writeText(url)
    triggerHaptic('light')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputKey.trim()) return
    onConnectSyncKey(inputKey.trim())
    setInputKey('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-fade-in safe-bottom z-10">
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.syncModalTitle}</h3>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                Cloudflare Workers & D1 Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {syncError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {syncError}
          </div>
        )}

        {/* Sync Status Badge */}
        <div className="mt-4 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              {syncKey && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  syncKey ? 'bg-emerald-500' : 'bg-slate-500'
                }`}
              />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                {syncKey ? t.syncActiveBadge : t.syncDisabledBadge}
              </span>
              <span className="text-[11px] text-slate-400">
                {syncKey && lastSyncTime
                  ? t.lastSyncedAt(new Date(lastSyncTime).toLocaleTimeString())
                  : syncKey
                  ? 'Ready to sync'
                  : 'Storage is offline on this device'}
              </span>
            </div>
          </div>

          {syncKey && (
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? t.syncingText : t.syncNowBtn}</span>
            </button>
          )}
        </div>

        {/* Main Content: If Sync is ACTIVE */}
        {syncKey ? (
          <div className="space-y-4 mt-4">
            {/* Sync Key Box */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Your Secret Sync Key:
                </span>
                <button
                  onClick={handleCopyKey}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] flex items-center gap-1"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey ? t.copiedBtn : t.copyKeyBtn}
                </button>
              </div>

              <code className="block p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs select-all break-all">
                {syncKey}
              </code>
            </div>

            {/* Quick Pairing Link */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-950/30 to-blue-950/20 border border-indigo-500/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Link className="w-4 h-4 text-indigo-400" />
                  1-Click Device Pairing Link
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Send this link to your other phone or laptop. Opening it will instantly sync all trips:
              </p>
              <button
                onClick={handleCopyPairingLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 active:scale-95 transition-all min-h-[44px]"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? t.pairingUrlCopied : t.copyPairingLinkBtn}
              </button>
            </div>

            {/* Auto-Sync Toggle */}
            <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-950 transition-colors">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => onToggleAutoSync(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block">{t.autoSyncToggleTitle}</span>
                <span className="text-slate-500 text-[11px]">{t.autoSyncToggleDesc}</span>
              </div>
            </label>

            {/* Disconnect Button */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={onDisconnectSync}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors py-1"
              >
                <Power className="w-3.5 h-3.5" />
                {t.disconnectSyncBtn}
              </button>
            </div>
          </div>
        ) : (
          /* If Sync is NOT ACTIVE */
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-gradient-to-br from-indigo-950/20 to-blue-950/20 border border-indigo-500/20 rounded-2xl space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-300">{t.syncExplainerTitle}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.syncExplainerDesc}
              </p>
            </div>

            {/* Option A: Create New Sync Key */}
            <button
              onClick={onEnableNewSyncKey}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all min-h-[44px]"
            >
              <Key className="w-4 h-4" />
              {t.createSyncKeyBtn}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                or
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Option B: Connect Existing Sync Key */}
            <form onSubmit={handleConnect} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {t.connectExistingDeviceBtn}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.enterSyncKeyPlaceholder}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base sm:text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-blue-500 min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={!inputKey.trim()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all min-h-[44px]"
                >
                  {t.connectBtn}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Collapsible Cloudflare Self-Hosting Guide */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setShowInstructions((prev) => !prev)}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.syncSetupInstructionsTitle}</span>
          </button>

          {showInstructions && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-2 leading-relaxed">
              <p>
                In your Cloudflare dashboard under <strong>Workers & Pages &gt; D1</strong>, create a database named <code className="text-blue-300">schengen-db</code>.
              </p>
              <p>
                Then bind it to your Pages project with variable name <strong className="text-white">DB</strong>:
              </p>
              <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto font-mono">
                npx wrangler d1 create schengen-db{'\n'}
                npx wrangler d1 execute schengen-db --file=./migrations/0001_initial_schema.sql
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
