import React, { useState, useEffect } from 'react';
import { Phrase, CardProgress, Dialect, Grade, CardStage } from '../lib/srs';
import { Bookmark, RotateCw, CheckCircle2, Sparkles, ArrowRight, Eye, RefreshCw, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardStudyProps {
  queue: Phrase[];
  cardsState: Record<number, CardProgress>;
  primaryDialect: Dialect;
  onRateCard: (phraseId: number, grade: Grade) => void;
  onBookmarkCard: (phraseId: number) => void;
  onResetSession: () => void;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({
  queue,
  cardsState,
  primaryDialect,
  onRateCard,
  onBookmarkCard,
  onResetSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);

  const currentPhrase = queue[currentIndex];
  const cardProgress: CardProgress = (currentPhrase && cardsState[currentPhrase.id]) || {
    id: currentPhrase?.id || 0,
    stage: 'preview',
    reps: 0,
    interval: 0,
    easeFactor: 2.5,
    dueDate: '',
    lastReviewed: null,
  };

  const stage: CardStage = cardProgress.stage;
  const isBookmarked = !!cardProgress.isBookmarked;

  const targetAlbanian = currentPhrase
    ? primaryDialect === 'gheg'
      ? currentPhrase.gheg
      : currentPhrase.tosk
    : '';

  const otherDialect = primaryDialect === 'gheg' ? 'tosk' : 'gheg';
  const otherAlbanian = currentPhrase
    ? otherDialect === 'gheg'
      ? currentPhrase.gheg
      : currentPhrase.tosk
    : '';

  useEffect(() => {
    setIsFlipped(false);
    setShowAlternative(false);
  }, [currentIndex, currentPhrase?.id, stage]);

  // Handle rating and progression
  const handleRate = (grade: Grade) => {
    if (!currentPhrase) return;
    onRateCard(currentPhrase.id, grade);

    if (currentIndex + 1 >= queue.length) {
      // Completed all cards in session!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
    setShowAlternative(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPhrase) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (stage !== 'preview') {
          setIsFlipped((prev) => !prev);
        }
      } else if (isFlipped || stage === 'preview') {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhrase, isFlipped, stage]);

  // Session Completed State
  if (!currentPhrase || currentIndex >= queue.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">
          Bravo ! Seancë e përfunduar !
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Vous avez terminé toutes les phrases prévues pour cette session. Les prochaines révisions seront planifiées automatiquement selon la méthode SRS.
        </p>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
            <span>Phrases étudiées aujourd'hui :</span>
            <span className="font-bold text-white text-sm">{queue.length}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Dialecte actif :</span>
            <span className="font-bold text-blue-400 uppercase text-xs">
              {primaryDialect}
            </span>
          </div>
        </div>

        <button
          onClick={onResetSession}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition"
        >
          <RotateCw className="w-4 h-4" />
          <span>Continuer / Réviser encore</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 md:py-6">
      {/* Top Session Progress Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">
            {currentIndex + 1} / {queue.length}
          </span>
          <span className="text-slate-600">•</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300">
            {currentPhrase.category}
          </span>
        </div>

        {/* Stage Badge */}
        <div className="flex items-center gap-1.5">
          {stage === 'preview' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Découverte
            </span>
          )}
          {stage === 'recognition' && (
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[11px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Reconnaissance (Alb → Fr)
            </span>
          )}
          {stage === 'production' && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" /> Production (Fr → Alb)
            </span>
          )}
          {stage === 'mastered' && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Maîtrisé
            </span>
          )}

          {/* Bookmark Button */}
          <button
            onClick={() => onBookmarkCard(currentPhrase.id)}
            className={`p-1 rounded-md transition ${
              isBookmarked
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Mettre en favori / Phrase difficile"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-600 to-amber-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
        />
      </div>

      {/* FLASHCARD CONTAINER */}
      {stage === 'preview' ? (
        /* PREVIEW MODE: Discover & Read */
        <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle dialect watermark */}
          <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4 flex items-center justify-between">
            <span>Étape 1 sur 2 : Découverte et lecture</span>
            <span className="text-slate-400">#{currentPhrase.id}</span>
          </div>

          {/* French sentence */}
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Français :
            </span>
            <p className="text-lg md:text-xl font-medium text-slate-200 leading-snug">
              {currentPhrase.french}
            </p>
          </div>

          {/* Albanian sentence in target dialect */}
          <div className="mb-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="mb-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                {primaryDialect} :
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white tracking-wide leading-relaxed">
              {targetAlbanian}
            </p>
          </div>

          {/* Alternative dialect peek */}
          <div className="mb-5">
            <button
              onClick={() => setShowAlternative(!showAlternative)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-300 flex items-center gap-1 transition"
            >
              <span>{showAlternative ? 'Masquer' : 'Comparer avec la version'}</span>
              <span className="uppercase text-slate-300 font-bold">{otherDialect}</span>
            </button>
            {showAlternative && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 animate-fade-in">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-0.5">
                  {otherDialect} :
                </span>
                <p className="text-sm font-medium">{otherAlbanian}</p>
              </div>
            )}
          </div>

          {/* Notes & context */}
          {currentPhrase.notes && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200/90 text-xs mb-6">
              <span className="font-bold text-amber-400 mr-1.5">Note :</span>
              {currentPhrase.notes}
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={() => handleRate(3)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition"
          >
            <span>J'ai bien mémorisé la phrase • Commencer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* RECOGNITION & PRODUCTION MODES */
        <div>
          {/* Card Clickable Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[300px] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between transition-all select-none group"
          >
            {/* Header info */}
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">
              <span>
                {stage === 'recognition'
                  ? 'Reconnaissance • Albanais vers Français'
                  : 'Rappel Actif • Français vers Albanais'}
              </span>
              <span className="text-slate-400">#{currentPhrase.id}</span>
            </div>

            {/* Main Prompt Content */}
            <div className="my-auto text-center py-4">
              {stage === 'recognition' ? (
                /* Prompt is Albanian */
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">
                    Albanais ({primaryDialect})
                  </span>
                  <p className="text-2xl md:text-3xl font-extrabold text-white tracking-wide mb-4 leading-relaxed">
                    {targetAlbanian}
                  </p>
                </div>
              ) : (
                /* Prompt is French */
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">
                    En français :
                  </span>
                  <p className="text-2xl md:text-3xl font-extrabold text-white tracking-normal mb-2 leading-relaxed">
                    {currentPhrase.french}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Comment le dites-vous en albanais ({primaryDialect}) ?
                  </p>
                </div>
              )}
            </div>

            {/* REVEALED BACK SECTION */}
            {isFlipped ? (
              <div className="mt-6 pt-5 border-t border-slate-800 animate-fade-in text-left">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {stage === 'recognition' ? 'Traduction en Français :' : `Traduction en Albanais (${primaryDialect}) :`}
                </span>
                <p className="text-xl font-bold text-white mb-3">
                  {stage === 'recognition' ? currentPhrase.french : targetAlbanian}
                </p>

                {/* Notes */}
                {currentPhrase.notes && (
                  <p className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-300">Note :</span> {currentPhrase.notes}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-xs text-slate-500 font-medium py-2 flex items-center justify-center gap-1.5 group-hover:text-slate-400 transition">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Appuyez n'importe où pour révéler la réponse</span>
              </div>
            )}
          </div>

          {/* RATING BUTTONS (SM-2) */}
          {isFlipped && (
            <div className="mt-4 grid grid-cols-4 gap-2 animate-slide-up">
              <button
                onClick={() => handleRate(1)}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 active:scale-95 border border-rose-800/40 text-rose-300 transition"
              >
                <span className="text-xs font-bold">À revoir</span>
                <span className="text-[10px] text-rose-400/80">Immédiat</span>
              </button>

              <button
                onClick={() => handleRate(2)}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 active:scale-95 border border-amber-800/40 text-amber-300 transition"
              >
                <span className="text-xs font-bold">Difficile</span>
                <span className="text-[10px] text-amber-400/80">1 jour</span>
              </button>

              <button
                onClick={() => handleRate(3)}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 active:scale-95 border border-blue-800/40 text-blue-300 transition"
              >
                <span className="text-xs font-bold">Bien</span>
                <span className="text-[10px] text-blue-400/80">3 jours</span>
              </button>

              <button
                onClick={() => handleRate(4)}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 active:scale-95 border border-emerald-800/40 text-emerald-300 transition"
              >
                <span className="text-xs font-bold">Facile</span>
                <span className="text-[10px] text-emerald-400/80">5 jours</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick shortcuts helper footer */}
      <div className="mt-6 text-center text-[11px] text-slate-500 hidden sm:block">
        Raccourcis clavier : <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Espace</kbd> pour retourner la carte, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">1-4</kbd> pour noter.
      </div>
    </div>
  );
};
