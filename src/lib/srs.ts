// Spaced Repetition Engine (SM-2 based) with Staged Progression

export type Dialect = 'gheg' | 'tosk';

export type CardStage = 'preview' | 'recognition' | 'production' | 'mastered';

export type Grade = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface Phrase {
  id: number;
  french: string;
  gheg: string;
  tosk: string;
  category: string;
  notes?: string;
}

export interface CardProgress {
  id: number;
  stage: CardStage;
  reps: number;
  interval: number; // in days
  easeFactor: number; // default 2.5
  dueDate: string; // YYYY-MM-DD
  lastReviewed: string | null; // ISO string
  isBookmarked?: boolean;
}

export interface UserSettings {
  primaryDialect: Dialect;
  dailyNewCards: number;
  showComparison: boolean;
}

export interface UserStats {
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  totalReviews: number;
}

export interface AppState {
  settings: UserSettings;
  stats: UserStats;
  cards: Record<number, CardProgress>;
}

const STORAGE_KEY = 'meso_shqip_app_state_v1';

export const DEFAULT_STATE: AppState = {
  settings: {
    primaryDialect: 'gheg',
    dailyNewCards: 10,
    showComparison: true,
  },
  stats: {
    streak: 0,
    lastStudyDate: '',
    totalReviews: 0,
  },
  cards: {},
};

export function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
      stats: { ...DEFAULT_STATE.stats, ...parsed.stats },
      cards: parsed.cards || {},
    };
  } catch (e) {
    console.error('Failed to load app state from localStorage:', e);
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save app state to localStorage:', e);
  }
}

// Calculate updated streak when user studies today
export function checkAndUpdateStreak(stats: UserStats): UserStats {
  const today = getTodayString();
  if (stats.lastStudyDate === today) {
    return stats; // Already updated today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = stats.streak;
  if (stats.lastStudyDate === yesterdayStr) {
    newStreak += 1;
  } else if (!stats.lastStudyDate) {
    newStreak = 1;
  } else {
    // Missed at least one day
    newStreak = 1;
  }

  return {
    ...stats,
    streak: newStreak,
    lastStudyDate: today,
    totalReviews: stats.totalReviews + 1,
  };
}

// SM-2 Review calculation with Staged Progression
export function calculateSM2(
  card: CardProgress,
  grade: Grade
): CardProgress {
  const today = getTodayString();
  let { stage, reps, interval, easeFactor } = card;

  // Grade: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)

  // 1. Stage progression
  if (stage === 'preview') {
    // Preview always moves to recognition next
    return {
      ...card,
      stage: 'recognition',
      dueDate: today,
      lastReviewed: new Date().toISOString(),
    };
  }

  if (stage === 'recognition') {
    // In recognition phase (Albanian -> French)
    if (grade >= 3) {
      // Success! Promote to Production phase (French -> Albanian)
      stage = 'production';
      reps = 1;
      interval = grade === 4 ? 2 : 1;
    } else {
      // Repeat recognition today or tomorrow
      interval = 0;
    }
  } else {
    // In production phase (French -> Albanian) or mastered
    if (grade === 1) {
      // Again: restart reps
      reps = 0;
      interval = 1;
      // Drop ease factor slightly
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (grade === 2) {
      // Hard
      interval = Math.max(1, Math.round(interval * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (grade === 3) {
      // Good
      if (reps === 0) {
        interval = 1;
      } else if (reps === 1) {
        interval = 3;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      reps += 1;
    } else if (grade === 4) {
      // Easy
      if (reps === 0) {
        interval = 2;
      } else if (reps === 1) {
        interval = 5;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      reps += 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
    }

    if (interval >= 21) {
      stage = 'mastered';
    }
  }

  // Calculate new due date
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + interval);
  const dueDateStr = nextDueDate.toISOString().split('T')[0];

  return {
    ...card,
    stage,
    reps,
    interval,
    easeFactor,
    dueDate: dueDateStr,
    lastReviewed: new Date().toISOString(),
  };
}

// Select cards to study today
export function getSessionQueue(
  allPhrases: Phrase[],
  cardsState: Record<number, CardProgress>,
  dailyNewLimit: number
): Phrase[] {
  const today = getTodayString();

  // 1. Existing cards that are due for review (dueDate <= today)
  const dueReviews: Phrase[] = [];
  const unstartedPhrases: Phrase[] = [];

  for (const phrase of allPhrases) {
    const card = cardsState[phrase.id];
    if (card) {
      if (card.dueDate <= today) {
        dueReviews.push(phrase);
      }
    } else {
      unstartedPhrases.push(phrase);
    }
  }

  // 2. Add new cards up to daily limit
  const newCardsToAdd = unstartedPhrases.slice(0, dailyNewLimit);

  // Combine: reviews first, then new learning cards
  return [...dueReviews, ...newCardsToAdd];
}
