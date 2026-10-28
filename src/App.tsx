import { useState, useEffect, useMemo, useCallback } from 'react';
import phrasebookData from './data/albanian_phrasebook.json';
import {
  AppState,
  Phrase,
  Dialect,
  Grade,
  loadAppState,
  saveAppState,
  checkAndUpdateStreak,
  calculateSM2,
  getSessionQueue,
  DEFAULT_STATE,
} from './lib/srs';
import { Header } from './components/Header';
import { FlashcardStudy } from './components/FlashcardStudy';
import { SentenceLibrary } from './components/SentenceLibrary';
import { StatsModal } from './components/StatsModal';
import { DialectComparisonModal } from './components/DialectComparisonModal';

export function App() {
  const phrases = useMemo(() => phrasebookData.phrases as Phrase[], []);
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<'study' | 'library' | 'stats'>('study');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDialectModal, setShowDialectModal] = useState(false);
  const [studySessionOverrides, setStudySessionOverrides] = useState<Phrase[] | null>(null);

  // Sync state to local storage on change
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Handle active daily queue
  const currentQueue = useMemo(() => {
    if (studySessionOverrides && studySessionOverrides.length > 0) {
      return studySessionOverrides;
    }
    return getSessionQueue(phrases, appState.cards, appState.settings.dailyNewCards);
  }, [phrases, appState.cards, appState.settings.dailyNewCards, studySessionOverrides]);

  // Rate a card in study session
  const handleRateCard = useCallback(
    (phraseId: number, grade: Grade) => {
      setAppState((prev) => {
        const existingCard = prev.cards[phraseId] || {
          id: phraseId,
          stage: 'preview',
          reps: 0,
          interval: 0,
          easeFactor: 2.5,
          dueDate: '',
          lastReviewed: null,
        };

        const updatedCard = calculateSM2(existingCard, grade);
        const updatedStats = checkAndUpdateStreak(prev.stats);

        return {
          ...prev,
          stats: updatedStats,
          cards: {
            ...prev.cards,
            [phraseId]: updatedCard,
          },
        };
      });
    },
    []
  );

  // Toggle bookmark on a card
  const handleBookmarkCard = useCallback((phraseId: number) => {
    setAppState((prev) => {
      const existingCard = prev.cards[phraseId] || {
        id: phraseId,
        stage: 'preview',
        reps: 0,
        interval: 0,
        easeFactor: 2.5,
        dueDate: '',
        lastReviewed: null,
      };

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [phraseId]: {
            ...existingCard,
            isBookmarked: !existingCard.isBookmarked,
          },
        },
      };
    });
  }, []);

  // Dialect change
  const handleDialectChange = (dialect: Dialect) => {
    setAppState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        primaryDialect: dialect,
      },
    }));
  };

  // Study single phrase from Library
  const handleStudySinglePhrase = (phraseId: number) => {
    const target = phrases.find((p) => p.id === phraseId);
    if (target) {
      setStudySessionOverrides([target]);
      setActiveTab('study');
    }
  };

  const handleResetSession = () => {
    setStudySessionOverrides(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Navigation */}
      <Header
        primaryDialect={appState.settings.primaryDialect}
        onDialectChange={handleDialectChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'stats') {
            setShowStatsModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        streak={appState.stats.streak}
        onOpenDialectInfo={() => setShowDialectModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'study' && (
          <FlashcardStudy
            queue={currentQueue}
            cardsState={appState.cards}
            primaryDialect={appState.settings.primaryDialect}
            onRateCard={handleRateCard}
            onBookmarkCard={handleBookmarkCard}
            onResetSession={handleResetSession}
          />
        )}

        {activeTab === 'library' && (
          <SentenceLibrary
            phrases={phrases}
            cardsState={appState.cards}
            primaryDialect={appState.settings.primaryDialect}
            onBookmarkCard={handleBookmarkCard}
            onStudySinglePhrase={handleStudySinglePhrase}
          />
        )}
      </main>

      {/* Dialect Info Modal */}
      {showDialectModal && (
        <DialectComparisonModal onClose={() => setShowDialectModal(false)} />
      )}

      {/* Stats & Settings Modal */}
      {showStatsModal && (
        <StatsModal
          appState={appState}
          totalPhrasesCount={phrases.length}
          onClose={() => setShowStatsModal(false)}
          onUpdateSettings={(newSettings) =>
            setAppState((prev) => ({
              ...prev,
              settings: { ...prev.settings, ...newSettings },
            }))
          }
          onRestoreState={(restored) => setAppState(restored)}
          onResetAllProgress={() => {
            setAppState(DEFAULT_STATE);
            saveAppState(DEFAULT_STATE);
            setShowStatsModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
