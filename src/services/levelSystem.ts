import { PlayerRank, PlayerStats, QuestCategory, QuestDifficulty } from '../types';

/**
 * Returns required XP for a given level
 */
export function getRequiredXpForLevel(level: number): number {
  if (level <= 1) return 500;
  if (level === 2) return 750;
  if (level === 3) return 1000;
  if (level === 4) return 1500;
  if (level === 5) return 2000;
  // Progressively scaled thereafter
  return 2000 + (level - 5) * 750;
}

/**
 * Maps player level to appropriate rank
 */
export function calculateRank(level: number): PlayerRank {
  if (level < 3) return PlayerRank.E;
  if (level < 5) return PlayerRank.D;
  if (level < 8) return PlayerRank.C;
  if (level < 12) return PlayerRank.B;
  if (level < 17) return PlayerRank.A;
  if (level < 23) return PlayerRank.S;
  if (level < 30) return PlayerRank.SS;
  return PlayerRank.X;
}

/**
 * Returns XP value based on difficulty
 */
export function getXpForDifficulty(diff: QuestDifficulty): number {
  switch (diff) {
    case QuestDifficulty.EASY:
      return 10;
    case QuestDifficulty.NORMAL:
      return 25;
    case QuestDifficulty.HARD:
      return 50;
    case QuestDifficulty.EPIC:
      return 100;
    default:
      return 25;
  }
}

/**
 * Returns default attribute increases based on quest category and difficulty
 */
export function getStatRewardsForQuest(category: QuestCategory, difficulty: QuestDifficulty): Partial<PlayerStats> {
  const multiplier = difficulty === QuestDifficulty.EPIC ? 3 : difficulty === QuestDifficulty.HARD ? 2 : 1;

  switch (category) {
    case QuestCategory.STUDY:
      return { intelligence: 1 * multiplier, focus: 1 * multiplier };
    case QuestCategory.FITNESS:
      return { strength: 1 * multiplier, vitality: 1 * multiplier, agility: difficulty === QuestDifficulty.EPIC ? 1 : 0 };
    case QuestCategory.WORK:
      return { discipline: 1 * multiplier, focus: 1 * multiplier };
    case QuestCategory.READING:
      return { focus: 1 * multiplier, intelligence: 1 * multiplier };
    case QuestCategory.PERSONAL:
      return { discipline: 1 * multiplier, agility: 1 * multiplier };
    case QuestCategory.DAILY:
      return { discipline: 1 * multiplier, vitality: 1 * multiplier };
    case QuestCategory.CUSTOM:
    default:
      return { discipline: 1 * multiplier };
  }
}

export interface RankTheme {
  rank: PlayerRank;
  title: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  glowClass: string;
  auraColor: string;
  particleDensity: number;
}

export const RANK_THEMES: Record<PlayerRank, RankTheme> = {
  [PlayerRank.E]: {
    rank: PlayerRank.E,
    title: 'Recruit Awakened',
    badgeBg: 'bg-slate-900/80',
    badgeBorder: 'border-slate-600/50',
    textColor: 'text-slate-300',
    glowClass: 'shadow-slate-500/20',
    auraColor: '#64748b',
    particleDensity: 2,
  },
  [PlayerRank.D]: {
    rank: PlayerRank.D,
    title: 'Shadow Initiate',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    glowClass: 'neon-cyan-glow shadow-cyan-500/30',
    auraColor: '#00f2fe',
    particleDensity: 4,
  },
  [PlayerRank.C]: {
    rank: PlayerRank.C,
    title: 'Arcane Striker',
    badgeBg: 'bg-blue-950/60',
    badgeBorder: 'border-blue-500/60',
    textColor: 'text-blue-400',
    glowClass: 'shadow-blue-500/40',
    auraColor: '#3b82f6',
    particleDensity: 6,
  },
  [PlayerRank.B]: {
    rank: PlayerRank.B,
    title: 'Vanguard Slayer',
    badgeBg: 'bg-indigo-950/70',
    badgeBorder: 'border-indigo-500/70',
    textColor: 'text-indigo-400',
    glowClass: 'shadow-indigo-500/50',
    auraColor: '#6366f1',
    particleDensity: 8,
  },
  [PlayerRank.A]: {
    rank: PlayerRank.A,
    title: 'Elite Phantom',
    badgeBg: 'bg-purple-950/70',
    badgeBorder: 'border-purple-400',
    textColor: 'text-purple-300',
    glowClass: 'neon-purple-glow shadow-purple-500/60',
    auraColor: '#a855f7',
    particleDensity: 12,
  },
  [PlayerRank.S]: {
    rank: PlayerRank.S,
    title: 'Monarch Conqueror',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-400',
    textColor: 'text-amber-300',
    glowClass: 'neon-gold-glow shadow-amber-500/70',
    auraColor: '#fbbf24',
    particleDensity: 16,
  },
  [PlayerRank.SS]: {
    rank: PlayerRank.SS,
    title: 'Supreme Overlord',
    badgeBg: 'bg-rose-950/80',
    badgeBorder: 'border-rose-500',
    textColor: 'text-rose-400',
    glowClass: 'shadow-rose-500/80',
    auraColor: '#f43f5e',
    particleDensity: 20,
  },
  [PlayerRank.X]: {
    rank: PlayerRank.X,
    title: 'God-Tier Sovereign',
    badgeBg: 'bg-fuchsia-950/90',
    badgeBorder: 'border-fuchsia-300',
    textColor: 'text-fuchsia-200',
    glowClass: 'shadow-fuchsia-400/90',
    auraColor: '#d946ef',
    particleDensity: 25,
  },
};
