import {
  Achievement,
  AnimationQuality,
  AppSettings,
  AvatarStyle,
  ChatMessage,
  PathClass,
  PlayerRank,
  PlayerStats,
  Quest,
  QuestCategory,
  QuestDifficulty,
  UserProfile,
} from '../types';
import { getRequiredXpForLevel } from './levelSystem';

const STORAGE_KEYS = {
  PROFILE: 'nexus_user_profile_v1',
  QUESTS: 'nexus_quests_v1',
  ACHIEVEMENTS: 'nexus_achievements_v1',
  SETTINGS: 'nexus_settings_v1',
  CHAT: 'nexus_chat_history_v1',
};

export const DEFAULT_STATS: Record<PathClass, PlayerStats> = {
  [PathClass.FOCUS]: {
    strength: 10,
    intelligence: 14,
    agility: 10,
    vitality: 10,
    focus: 18,
    discipline: 14,
  },
  [PathClass.DISCIPLINE]: {
    strength: 12,
    intelligence: 11,
    agility: 11,
    vitality: 14,
    focus: 14,
    discipline: 18,
  },
  [PathClass.KNOWLEDGE]: {
    strength: 8,
    intelligence: 18,
    agility: 9,
    vitality: 10,
    focus: 16,
    discipline: 14,
  },
  [PathClass.STRENGTH]: {
    strength: 18,
    intelligence: 10,
    agility: 15,
    vitality: 16,
    focus: 10,
    discipline: 12,
  },
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quest',
    title: 'FIRST AWAKENING',
    description: 'Complete your first quest and awaken your potential.',
    iconName: 'Sparkles',
    category: 'Progression',
    unlocked: false,
    xpBonus: 50,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'quest_10',
    title: 'HUNTER INITIATE',
    description: 'Complete 10 total quests.',
    iconName: 'Sword',
    category: 'Quests',
    unlocked: false,
    xpBonus: 100,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'quest_master',
    title: 'QUEST MASTER',
    description: 'Conquer 50 quests across any category.',
    iconName: 'Trophy',
    category: 'Quests',
    unlocked: false,
    xpBonus: 500,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'streak_7',
    title: '7-DAY STREAK',
    description: 'Maintain your daily system streak for 7 consecutive days.',
    iconName: 'Flame',
    category: 'Discipline',
    unlocked: false,
    xpBonus: 200,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'streak_30',
    title: 'IRON CONSISTENCY',
    description: 'Maintain your daily system streak for 30 consecutive days.',
    iconName: 'ShieldAlert',
    category: 'Discipline',
    unlocked: false,
    xpBonus: 1000,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'level_10',
    title: 'ASCENSION: LEVEL 10',
    description: 'Break your limits and reach Level 10.',
    iconName: 'Zap',
    category: 'Level',
    unlocked: false,
    xpBonus: 400,
    progress: 1,
    maxProgress: 10,
  },
  {
    id: 'rank_s',
    title: 'MONARCH OF SHADOWS',
    description: 'Ascend to Rank S or higher.',
    iconName: 'Crown',
    category: 'Rank',
    unlocked: false,
    xpBonus: 1500,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'epic_conqueror',
    title: 'TITAN SLAYER',
    description: 'Complete an Epic difficulty quest without hesitation.',
    iconName: 'Skull',
    category: 'Combat',
    unlocked: false,
    xpBonus: 300,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'night_owl',
    title: 'NIGHT OWL',
    description: 'Complete a quest after 10:00 PM.',
    iconName: 'Moon',
    category: 'Special',
    unlocked: false,
    xpBonus: 100,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'scholar',
    title: "SCHOLAR'S EYE",
    description: 'Complete 10 Study or Reading quests.',
    iconName: 'BookOpen',
    category: 'Intelligence',
    unlocked: false,
    xpBonus: 250,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'photo_first',
    title: 'VISUAL EVIDENCE',
    description: 'Verify a quest completion with photographic proof.',
    iconName: 'Camera',
    category: 'Proof',
    unlocked: false,
    xpBonus: 75,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'photo_master',
    title: 'TACTICAL ARCHIVIST',
    description: 'Submit 5 photo-verified mission completions.',
    iconName: 'Camera',
    category: 'Proof',
    unlocked: false,
    xpBonus: 200,
    progress: 0,
    maxProgress: 5,
  },
];

export const STARTER_QUESTS: Quest[] = [
  {
    id: 'daily_1',
    title: 'Deep Study / Skill Mastery',
    description: 'Spend 30 uninterrupted minutes studying or acquiring a new high-leverage skill.',
    difficulty: QuestDifficulty.NORMAL,
    xpReward: 25,
    completed: false,
    createdAt: new Date().toISOString(),
    category: QuestCategory.STUDY,
    statRewards: { intelligence: 1, focus: 1 },
    isDaily: true,
    repeatType: 'DAILY',
  },
  {
    id: 'daily_2',
    title: 'Physical Conditioning & Workout',
    description: 'Perform 20 minutes of intense physical training or calisthenics.',
    difficulty: QuestDifficulty.NORMAL,
    xpReward: 25,
    completed: false,
    createdAt: new Date().toISOString(),
    category: QuestCategory.FITNESS,
    statRewards: { strength: 1, vitality: 1 },
    isDaily: true,
    repeatType: 'DAILY',
  },
  {
    id: 'daily_3',
    title: 'Mind Expansion Reading',
    description: 'Read 10 pages of educational non-fiction or philosophy.',
    difficulty: QuestDifficulty.EASY,
    xpReward: 15,
    completed: false,
    createdAt: new Date().toISOString(),
    category: QuestCategory.READING,
    statRewards: { focus: 1 },
    isDaily: true,
    repeatType: 'DAILY',
  },
  {
    id: 'daily_4',
    title: 'Complete Priority Objective',
    description: 'Finish your most crucial work or project milestone for the day.',
    difficulty: QuestDifficulty.HARD,
    xpReward: 50,
    completed: false,
    createdAt: new Date().toISOString(),
    category: QuestCategory.WORK,
    statRewards: { discipline: 2, focus: 2 },
    isDaily: true,
    repeatType: 'DAILY',
  },
  {
    id: 'quest_epic_1',
    title: 'Epic Deep Work Flow State (90 Min)',
    description: 'Enter hyperfocus with zero notifications or phone distractions for 90 full minutes.',
    difficulty: QuestDifficulty.EPIC,
    xpReward: 100,
    completed: false,
    createdAt: new Date().toISOString(),
    category: QuestCategory.WORK,
    statRewards: { discipline: 3, focus: 3 },
    isDaily: false,
    repeatType: 'NONE',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  musicEnabled: false,
  sfxEnabled: true,
  volume: 0.7,
  notificationsEnabled: true,
  animationQuality: AnimationQuality.HIGH,
  themeMode: 'obsidian',
  requireProofOnCompletion: true,
  photoBonusXp: 15,
};

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'nova_init_1',
    sender: 'nova',
    text: 'System online. Welcome to NEXUS, Hunter. I am NOVA, your personal system intelligence.\n\nEvery task you complete grants real XP, elevates your attributes, and unlocks rank awakenings. Tell me your goals, or ask me to generate a personalized daily training protocol!',
    timestamp: new Date().toISOString(),
  },
];

// Helper to get formatted today date
export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const storage = {
  getProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile', e);
    }
  },

  initProfile(username: string, path: PathClass, avatar: AvatarStyle): UserProfile {
    const today = getTodayKey();
    const profile: UserProfile = {
      id: 'hunter_' + Date.now(),
      username: username.trim() || 'ShadowHunter',
      title: 'Level Zero Awakened',
      path,
      avatarStyle: avatar,
      level: 1,
      currentXp: 250, // Starting at 250 / 500 XP as specified in prompt
      requiredXp: getRequiredXpForLevel(1),
      totalXp: 250,
      rank: PlayerRank.E,
      stats: { ...DEFAULT_STATS[path] },
      streakCurrent: 1,
      streakBest: 1,
      lastActiveDate: today,
      activityHistory: {
        [today]: 1,
      },
      dailyGoalXp: 200,
      onboarded: true,
    };
    storage.saveProfile(profile);
    return profile;
  },

  getQuests(): Quest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
      if (!data) {
        storage.saveQuests(STARTER_QUESTS);
        return STARTER_QUESTS;
      }
      return JSON.parse(data);
    } catch {
      return STARTER_QUESTS;
    }
  },

  saveQuests(quests: Quest[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch (e) {
      console.error('Error saving quests', e);
    }
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!data) {
        storage.saveAchievements(INITIAL_ACHIEVEMENTS);
        return INITIAL_ACHIEVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Error saving achievements', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      return data ? JSON.parse(data) : INITIAL_CHAT;
    } catch {
      return INITIAL_CHAT;
    }
  },

  saveChatHistory(messages: ChatMessage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat', e);
    }
  },

  // Reset daily quests if date changed
  checkDailyReset(quests: Quest[], profile: UserProfile): { quests: Quest[]; profile: UserProfile; didReset: boolean } {
    const today = getTodayKey();
    if (profile.lastActiveDate !== today) {
      // Check streak logic:
      const lastDate = new Date(profile.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      let newStreak = profile.streakCurrent;
      if (diffDays === 1) {
        // Continuous day
        newStreak += 1;
      } else if (diffDays > 1) {
        // Missed day
        newStreak = 1;
      }

      const updatedProfile: UserProfile = {
        ...profile,
        lastActiveDate: today,
        streakCurrent: newStreak,
        streakBest: Math.max(newStreak, profile.streakBest),
      };

      // Reset completed status of daily quests
      const updatedQuests = quests.map((q) => {
        if (q.isDaily || q.repeatType === 'DAILY') {
          return { ...q, completed: false, completedAt: undefined };
        }
        return q;
      });

      storage.saveProfile(updatedProfile);
      storage.saveQuests(updatedQuests);

      return { quests: updatedQuests, profile: updatedProfile, didReset: true };
    }
    return { quests, profile, didReset: false };
  },
};
