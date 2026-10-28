import React from 'react';
import { Dialect } from '../lib/srs';
import { Flame, BookOpen, Layers, BarChart3, Info } from 'lucide-react';

interface HeaderProps {
  primaryDialect: Dialect;
  onDialectChange: (dialect: Dialect) => void;
  activeTab: 'study' | 'library' | 'stats';
  onTabChange: (tab: 'study' | 'library' | 'stats') => void;
  streak: number;
  onOpenDialectInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  primaryDialect,
  onDialectChange,
  activeTab,
  onTabChange,
  streak,
  onOpenDialectInfo,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/40 text-white font-bold text-lg border border-red-500/30">
              🇦🇱
            </div>
            <div>
              <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Mëso Shqip
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                152 Phrases Clés • Français-Albanais
              </p>
            </div>
          </div>

          {/* Right controls: Streak + Dialect Switcher */}
          <div className="flex items-center gap-2">
            {/* Streak Counter */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{streak} j</span>
            </div>

            {/* Dialect Switcher Toggle */}
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => onDialectChange('gheg')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  primaryDialect === 'gheg'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Gheg (Kosovo, Nord de l'Albanie, Macédoine)"
              >
                Gheg
              </button>
              <button
                onClick={() => onDialectChange('tosk')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  primaryDialect === 'tosk'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tosk (Standard, Sud de l'Albanie)"
              >
                Tosk
              </button>
            </div>

            {/* Dialect info icon */}
            <button
              onClick={onOpenDialectInfo}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition"
              title="À propos des dialectes Gheg et Tosk"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => onTabChange('study')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'study'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Session du jour</span>
          </button>

          <button
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bibliothèque (152)</span>
          </button>

          <button
            onClick={() => onTabChange('stats')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Progrès & Sauvegarde</span>
          </button>
        </div>
      </div>
    </header>
  );
};
