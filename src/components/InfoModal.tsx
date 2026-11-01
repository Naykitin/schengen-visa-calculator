import React, { useEffect } from 'react'
import { BookOpen, ExternalLink, ShieldCheck, X } from 'lucide-react'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-fade-in safe-bottom z-10">
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Как работает правило 90/180?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-100 text-sm">Основной принцип</h4>
            <p>
              Граждане стран с безвизовым режимом или обладатели краткосрочных виз категории C
              могут находиться в странах Шенгенского соглашения максимум <strong className="text-blue-300">90 дней</strong> в течение любого <strong className="text-blue-300">180-дневного скользящего периода</strong> (Регламент ЕС 2016/399).
            </p>
          </section>

          <section className="space-y-1.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <h4 className="font-bold text-amber-300 text-xs">Что такое «скользящий период»?</h4>
            <p>
              Период не привязан к календарным полугодиям. В <strong>каждый отдельный день</strong> вашего нахождения в Шенгене пограничник отсчитывает ровно 180 дней назад. В этом отрезке сумма дней не должна превышать 90.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-100 text-sm">Важные правила подсчёта:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                <strong className="text-slate-100">День въезда и день выезда:</strong> оба дня считаются полными днями пребывания в Шенгене, даже если вы прилетели в 23:55 или улетели в 00:05.
              </li>
              <li>
                <strong className="text-slate-100">Возврат дней:</strong> когда проходит 180 дней с момента давней поездки, эти дни «сгорают» из расчёта, и ваш доступный лимит восстанавливается.
              </li>
              <li>
                <strong className="text-slate-100">Национальные визы D и ВНЖ:</strong> дни пребывания по виду на жительство или визе типа D конкретной страны не засчитываются в лимит 90/180 шенгенских краткосрочных поездок.
              </li>
            </ul>
          </section>

          <section className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open-Source (MIT License)</span>
            </div>
            <a
              href="https://github.com/Naykitin/schengen-visa-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
