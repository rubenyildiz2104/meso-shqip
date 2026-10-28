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
    <>
      {/* TOP HEADER: Safe area padded for iOS notch / status bar */}
      <header
        className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all"
        style={{
          paddingTop: 'max(10px, env(safe-area-inset-top, 0px))',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-900/40 text-white font-bold text-base border border-red-500/30 flex-shrink-0">
                🇦🇱
              </div>
              <div className="truncate">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
                  Mëso Shqip
                </h1>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  152 Phrases Clés • Gheg & Tosk
                </p>
              </div>
            </div>

            {/* Right Controls: Streak + Dialect Switcher + Info */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Streak */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{streak} j</span>
              </div>

              {/* Dialect Switcher */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/80">
                <button
                  onClick={() => onDialectChange('gheg')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-bold rounded-md transition-all ${
                    primaryDialect === 'gheg'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Dialecte Gheg (Nord, Kosovo)"
                >
                  Gheg
                </button>
                <button
                  onClick={() => onDialectChange('tosk')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-bold rounded-md transition-all ${
                    primaryDialect === 'tosk'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Dialecte Tosk (Standard, Sud)"
                >
                  Tosk
                </button>
              </div>

              {/* Info Icon */}
              <button
                onClick={onOpenDialectInfo}
                className="p-1 sm:p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                title="À propos des dialectes"
              >
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Desktop/Tablet Horizontal Tabs (hidden on mobile phones) */}
          <div className="hidden sm:flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-800/60">
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

      {/* MOBILE BOTTOM NAVIGATION BAR: Native iOS & Android PWA thumb navigation */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 shadow-2xl"
        style={{
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="grid grid-cols-3 max-w-md mx-auto pt-1.5 pb-1">
          <button
            onClick={() => onTabChange('study')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition ${
              activeTab === 'study'
                ? 'text-red-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${activeTab === 'study' ? 'bg-red-500/15' : ''}`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Session</span>
          </button>

          <button
            onClick={() => onTabChange('library')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition ${
              activeTab === 'library'
                ? 'text-red-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${activeTab === 'library' ? 'bg-red-500/15' : ''}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Bibliothèque</span>
          </button>

          <button
            onClick={() => onTabChange('stats')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition ${
              activeTab === 'stats'
                ? 'text-red-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${activeTab === 'stats' ? 'bg-red-500/15' : ''}`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Progrès</span>
          </button>
        </div>
      </nav>
    </>
  );
};
