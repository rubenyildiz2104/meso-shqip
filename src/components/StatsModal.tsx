import React, { useRef } from 'react';
import { AppState, DEFAULT_STATE } from '../lib/srs';
import { BarChart3, Download, Upload, RotateCcw, Flame, CheckCircle, Sparkles, Eye, ThumbsUp, X } from 'lucide-react';

interface StatsModalProps {
  appState: AppState;
  totalPhrasesCount: number;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppState['settings']>) => void;
  onRestoreState: (state: AppState) => void;
  onResetAllProgress: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  appState,
  totalPhrasesCount,
  onClose,
  onUpdateSettings,
  onRestoreState,
  onResetAllProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { settings, stats, cards } = appState;
  const cardsList = Object.values(cards);

  const previewCount = cardsList.filter((c) => c.stage === 'preview').length;
  const recogCount = cardsList.filter((c) => c.stage === 'recognition').length;
  const prodCount = cardsList.filter((c) => c.stage === 'production').length;
  const masteredCount = cardsList.filter((c) => c.stage === 'mastered').length;
  const startedCount = cardsList.length;
  const unstartedCount = Math.max(0, totalPhrasesCount - startedCount);

  // Export JSON backup
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `meso_shqip_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && (imported.cards || imported.settings)) {
          onRestoreState({
            settings: { ...DEFAULT_STATE.settings, ...imported.settings },
            stats: { ...DEFAULT_STATE.stats, ...imported.stats },
            cards: imported.cards || {},
          });
          alert('Sauvegarde restaurée avec succès !');
          onClose();
        } else {
          alert('Fichier de sauvegarde invalide.');
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-red-600/20 text-red-500">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Statistiques & Préférences</h2>
            <p className="text-xs text-slate-400">Suivez votre avancement et sauvegardez vos données</p>
          </div>
        </div>

        {/* Streak & Reviews Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{stats.streak} j</span>
              <span className="text-[11px] text-slate-400 block font-medium">Série consécutive</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{stats.totalReviews}</span>
              <span className="text-[11px] text-slate-400 block font-medium">Révisions effectuées</span>
            </div>
          </div>
        </div>

        {/* Progress Stages Breakdown */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            État des 152 phrases
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Découvertes (Preview)
              </span>
              <span className="font-bold text-amber-400">{previewCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                En reconnaissance (Alb → Fr)
              </span>
              <span className="font-bold text-sky-400">{recogCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                En production (Fr → Alb)
              </span>
              <span className="font-bold text-purple-400">{prodCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Maîtrisées (Intervalle 21j+)
              </span>
              <span className="font-bold text-emerald-400">{masteredCount}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-slate-500">Pas encore commencées</span>
              <span className="font-bold text-slate-500">{unstartedCount}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Paramètres d'étude
          </h3>

          <div className="space-y-4">
            {/* Daily new cards limit */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Nouvelles phrases par session :
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => onUpdateSettings({ dailyNewCards: num })}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      settings.dailyNewCards === num
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {num} phrases
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Backup / Export / Import */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Sauvegarde & Synchronisation Téléphone
          </h3>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            Exportez votre progression en fichier JSON pour la conserver en sécurité ou l'importer sur votre smartphone.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Exporter (Backup)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importer (Restore)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Reset Progress */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              if (confirm('Voulez-vous vraiment réinitialiser toutes vos révisions et statistiques ?')) {
                onResetAllProgress();
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-rose-500/80 hover:text-rose-400 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Réinitialiser toute ma progression</span>
          </button>
        </div>
      </div>
    </div>
  );
};
