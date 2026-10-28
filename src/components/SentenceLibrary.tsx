import React, { useState, useMemo } from 'react';
import { Phrase, Dialect, CardProgress } from '../lib/srs';
import { Search, Bookmark, Star, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface SentenceLibraryProps {
  phrases: Phrase[];
  cardsState: Record<number, CardProgress>;
  primaryDialect: Dialect;
  onBookmarkCard: (phraseId: number) => void;
  onStudySinglePhrase: (phraseId: number) => void;
}

export const SentenceLibrary: React.FC<SentenceLibraryProps> = ({
  phrases,
  cardsState,
  primaryDialect,
  onBookmarkCard,
  onStudySinglePhrase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(phrases.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [phrases]);

  // Filter phrases
  const filteredPhrases = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return phrases.filter((p) => {
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Bookmark match
      if (onlyBookmarked && !cardsState[p.id]?.isBookmarked) {
        return false;
      }
      // Search match
      if (!term) return true;
      return (
        p.french.toLowerCase().includes(term) ||
        p.gheg.toLowerCase().includes(term) ||
        p.tosk.toLowerCase().includes(term) ||
        p.id.toString() === term
      );
    });
  }, [phrases, searchTerm, selectedCategory, onlyBookmarked, cardsState]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Search and Filters Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher en français, gheg, tosk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Bookmarked Filter Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                onlyBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400' : ''}`} />
              <span>Favoris ({Object.values(cardsState).filter((c) => c.isBookmarked).length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Toutes les catégories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Count info */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span>
          {filteredPhrases.length} phrase{filteredPhrases.length > 1 ? 's' : ''} trouvée{filteredPhrases.length > 1 ? 's' : ''}
        </span>
        <span className="text-slate-500">
          Dialecte actif : <strong className="text-slate-300 uppercase">{primaryDialect}</strong>
        </span>
      </div>

      {/* Phrase List */}
      <div className="space-y-3">
        {filteredPhrases.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-sm">Aucune phrase ne correspond à votre recherche.</p>
          </div>
        ) : (
          filteredPhrases.map((phrase) => {
            const card = cardsState[phrase.id];
            const isBookmarked = !!card?.isBookmarked;
            const isExpanded = expandedId === phrase.id;
            const stage = card?.stage;

            return (
              <div
                key={phrase.id}
                className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-bold text-slate-400">
                      #{phrase.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {phrase.category}
                    </span>
                    {stage && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {stage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Add to current study queue */}
                    <button
                      onClick={() => onStudySinglePhrase(phrase.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="S'entraîner sur cette phrase"
                    >
                      <Layers className="w-4 h-4 text-slate-400 hover:text-red-400" />
                    </button>

                    {/* Bookmark Star */}
                    <button
                      onClick={() => onBookmarkCard(phrase.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* French Sentence */}
                <div className="mt-2.5">
                  <p className="text-base font-semibold text-slate-100">{phrase.french}</p>
                </div>

                {/* Dialect Sentences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  {/* Gheg */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      primaryDialect === 'gheg'
                        ? 'bg-blue-950/20 border-blue-800/40 text-blue-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">
                      Gheg
                    </span>
                    <p className="text-sm font-medium">{phrase.gheg}</p>
                  </div>

                  {/* Tosk */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      primaryDialect === 'tosk'
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                      Tosk (Standard)
                    </span>
                    <p className="text-sm font-medium">{phrase.tosk}</p>
                  </div>
                </div>

                {/* Expandable Notes */}
                {phrase.notes && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : phrase.id)}
                      className="text-slate-400 hover:text-slate-300 font-medium flex items-center gap-1 text-[11px]"
                    >
                      <span>Notes linguistiques</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {isExpanded && (
                      <p className="mt-1.5 text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 animate-fade-in">
                        {phrase.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
