export enum QuestDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  EPIC = 'EPIC',
}

export enum QuestCategory {
  DAILY = 'DAILY',
  STUDY = 'STUDY',
  FITNESS = 'FITNESS',
  WORK = 'WORK',
  READING = 'READING',
  PERSONAL = 'PERSONAL',
  CUSTOM = 'CUSTOM',
}

export enum PlayerRank {
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
  SS = 'SS',
  X = 'X',
}

export enum PathClass {
  FOCUS = 'FOCUS',
  DISCIPLINE = 'DISCIPLINE',
  KNOWLEDGE = 'KNOWLEDGE',
  STRENGTH = 'STRENGTH',
}

export enum AvatarStyle {
  SHADOW_WARRIOR = 'SHADOW_WARRIOR',
  CYBER_MAGE = 'CYBER_MAGE',
  DARK_KNIGHT = 'DARK_KNIGHT',
  MYSTIC_HUNTER = 'MYSTIC_HUNTER',
  FUTURISTIC_WARRIOR = 'FUTURISTIC_WARRIOR',
}

export enum AnimationQuality {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface PlayerStats {
  strength: number;
  intelligence: number;
  agility: number;
  vitality: number;
  focus: number;
  discipline: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  deadline?: string;
  reminderTime?: string;
  category: QuestCategory;
  statRewards: Partial<PlayerStats>;
  isDaily: boolean;
  repeatType?: 'NONE' | 'DAILY' | 'WEEKLY';
  // Photo verification fields:
  requiresProof?: boolean;
  proofImage?: string; // base64 compressed data URL
  proofNote?: string;
  proofVerifiedAt?: string;
  proofAiScan?: {
    score: number;
    feedback: string;
    attributeBonus?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpBonus: number;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  id: string;
  username: string;
  title: string;
  path: PathClass;
  avatarStyle: AvatarStyle;
  level: number;
  currentXp: number;
  requiredXp: number;
  totalXp: number;
  rank: PlayerRank;
  stats: PlayerStats;
  streakCurrent: number;
  streakBest: number;
  lastActiveDate: string;
  activityHistory: Record<string, number>; // date 'YYYY-MM-DD' -> count of quests completed
  dailyGoalXp: number;
  onboarded: boolean;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  volume: number; // 0.0 - 1.0
  notificationsEnabled: boolean;
  animationQuality: AnimationQuality;
  themeMode: 'obsidian' | 'cyber-neon' | 'crimson-void';
  requireProofOnCompletion: boolean; // Prompts hunter for photo evidence on completing a directive
  photoBonusXp: number; // Bonus XP awarded for photo verified completions (e.g. +15 XP)
}

export interface ChatMessage {
  id: string;
  sender: 'nova' | 'user' | 'system';
  text: string;
  timestamp: string;
  suggestedQuests?: Partial<Quest>[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'quest' | 'levelup' | 'achievement' | 'system';
  timestamp: string;
}
