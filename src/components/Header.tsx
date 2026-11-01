import React from 'react'
import { Download, HelpCircle, Plus } from 'lucide-react'

interface HeaderProps {
  onOpenAddModal: () => void
  onOpenBackupModal: () => void
  onOpenInfoModal: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBackupModal,
  onOpenInfoModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 safe-top px-4 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 shrink-0">
            <span className="text-amber-300 font-black text-sm tracking-tighter">90</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              Шенген 90/180
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                EU
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 leading-none">Калькулятор визовых дней</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBackupModal}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 active:scale-95 transition-all"
            title="Резервное копирование и экспорт"
            aria-label="Резервное копирование"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <button
            onClick={onOpenInfoModal}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 active:scale-95 transition-all"
            title="Как работает правило 90/180"
            aria-label="Справка"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="min-h-[40px] flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/30 active:scale-95 transition-all border border-blue-400/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Добавить поездку</span>
            <span className="sm:hidden">Поездка</span>
          </button>
        </div>
      </div>
    </header>
  )
}
