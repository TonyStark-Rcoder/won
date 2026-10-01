import React, { useState, useEffect } from 'react';
import {
  Home,
  CheckSquare,
  Shield,
  Trophy,
  User,
  Bot,
  Plus,
} from 'lucide-react';
import {
  Achievement,
  AppSettings,
  AvatarStyle,
  ChatMessage,
  PathClass,
  PlayerRank,
  PlayerStats,
  Quest,
  QuestDifficulty,
  UserProfile,
} from './types';
import { getRequiredXpForLevel, calculateRank } from './services/levelSystem';
import { storage, getTodayKey } from './services/storage';
import { sound } from './services/soundEngine';

// Components & Views
import { SplashScreen } from './views/SplashScreen';
import { OnboardingView } from './views/OnboardingView';
import { HomeView } from './views/HomeView';
import { QuestsView } from './views/QuestsView';
import { StatsView } from './views/StatsView';
import { AchievementsView } from './views/AchievementsView';
import { ProfileView } from './views/ProfileView';

import { QuestModal } from './components/QuestModal';
import { LevelUpModal } from './components/LevelUpModal';
import { NovaAssistant } from './components/NovaAssistant';
import { SettingsModal } from './components/SettingsModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { ProofVerificationModal } from './components/ProofVerificationModal';
import { ProofViewModal } from './components/ProofViewModal';

type NavTab = 'HOME' | 'QUESTS' | 'STATS' | 'ACHIEVEMENTS' | 'PROFILE';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [showSplash, setShowSplash] = useState(true);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [showNovaModal, setShowNovaModal] = useState(false);
  const [isNovaLoading, setIsNovaLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showApkGuideModal, setShowApkGuideModal] = useState(false);

  // Photo Verification Modals
  const [verifyingQuest, setVerifyingQuest] = useState<Quest | null>(null);
  const [viewingProofQuest, setViewingProofQuest] = useState<Quest | null>(null);

  // Level Up / Celebration Modal
  const [levelUpModalState, setLevelUpModalState] = useState<{
    isOpen: boolean;
    type: 'LEVEL_UP' | 'RANK_UP' | 'QUEST_COMPLETE';
    level: number;
    rank: PlayerRank;
    questTitle?: string;
    xpGained?: number;
    statGains?: Partial<PlayerStats>;
  }>({
    isOpen: false,
    type: 'QUEST_COMPLETE',
    level: 1,
    rank: PlayerRank.E,
  });

  // Initialize data on mount
  useEffect(() => {
    const savedProfile = storage.getProfile();
    const savedQuests = storage.getQuests();
    const savedAchievements = storage.getAchievements();
    const savedSettings = storage.getSettings();
    const savedChat = storage.getChatHistory();

    setSettings(savedSettings);
    sound.updateSettings(
      savedSettings.soundEnabled,
      savedSettings.musicEnabled,
      savedSettings.sfxEnabled,
      savedSettings.volume
    );

    if (savedProfile) {
      // Check daily reset
      const resetResult = storage.checkDailyReset(savedQuests, savedProfile);
      setProfile(resetResult.profile);
      setQuests(resetResult.quests);
    } else {
      setQuests(savedQuests);
    }

    setAchievements(savedAchievements);
    setChatHistory(savedChat);
  }, []);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (username: string, path: PathClass, avatar: AvatarStyle) => {
    const newProfile = storage.initProfile(username, path, avatar);
    setProfile(newProfile);
    sound.playLevelUp();
  };

  // Toggle Quest Complete / Pending
  const handleToggleCompleteQuest = (id: string) => {
    if (!profile) return;

    const targetQuest = quests.find((q) => q.id === id);
    if (!targetQuest) return;

    if (!targetQuest.completed) {
      // If setting requires proof prompt or quest specifies proof requirement
      if (settings.requireProofOnCompletion || targetQuest.requiresProof) {
        sound.playClick();
        setVerifyingQuest(targetQuest);
        return;
      }
      handleExecuteQuestComplete(id);
    } else {
      handleRevertQuestComplete(id);
    }
  };

  // Execute Quest Completion (with or without photo proof data)
  const handleExecuteQuestComplete = (
    id: string,
    proofData?: {
      image: string;
      note?: string;
      scanResult?: { score: number; feedback: string; attributeBonus?: string };
    }
  ) => {
    if (!profile) return;

    const questIndex = quests.findIndex((q) => q.id === id);
    if (questIndex === -1) return;

    const targetQuest = quests[questIndex];
    const hasProof = !!proofData?.image;
    const bonusXp = hasProof ? (settings.photoBonusXp || 15) : 0;
    const xpGained = targetQuest.xpReward + bonusXp;

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...targetQuest,
      completed: true,
      completedAt: new Date().toISOString(),
      proofImage: proofData?.image,
      proofNote: proofData?.note,
      proofVerifiedAt: hasProof ? new Date().toISOString() : undefined,
      proofAiScan: proofData?.scanResult,
    };

    let updatedProfile = { ...profile };
    let triggerModalType: 'LEVEL_UP' | 'RANK_UP' | 'QUEST_COMPLETE' | null = null;
    let oldLevel = profile.level;
    let oldRank = profile.rank;

    // Reward XP & Stats
    sound.playQuestComplete();

    let newCurrentXp = updatedProfile.currentXp + xpGained;
    let newTotalXp = updatedProfile.totalXp + xpGained;
    let newLevel = updatedProfile.level;
    let newRequiredXp = updatedProfile.requiredXp;
    let newRank = updatedProfile.rank;

    // Check level-up loop
    let didLevelUp = false;
    while (newCurrentXp >= newRequiredXp) {
      newCurrentXp -= newRequiredXp;
      newLevel += 1;
      newRequiredXp = getRequiredXpForLevel(newLevel);
      newRank = calculateRank(newLevel);
      didLevelUp = true;
    }

    // Add stat rewards
    const updatedStats = { ...updatedProfile.stats };
    if (targetQuest.statRewards) {
      Object.entries(targetQuest.statRewards).forEach(([stat, val]) => {
        const k = stat as keyof PlayerStats;
        updatedStats[k] = (updatedStats[k] || 0) + (val || 0);
      });
    }

    // If photo proof was authenticated, grant extra discipline & focus
    if (hasProof) {
      updatedStats.discipline = (updatedStats.discipline || 0) + 1;
      updatedStats.focus = (updatedStats.focus || 0) + 1;
    }

    // Update today's activity history
    const today = getTodayKey();
    const updatedActivity = {
      ...updatedProfile.activityHistory,
      [today]: (updatedProfile.activityHistory[today] || 0) + 1,
    };

    updatedProfile = {
      ...updatedProfile,
      currentXp: newCurrentXp,
      totalXp: newTotalXp,
      level: newLevel,
      requiredXp: newRequiredXp,
      rank: newRank,
      stats: updatedStats,
      activityHistory: updatedActivity,
    };

    // Sound and Modal triggers
    if (newRank !== oldRank) {
      sound.playRankUp();
      triggerModalType = 'RANK_UP';
    } else if (didLevelUp) {
      sound.playLevelUp();
      triggerModalType = 'LEVEL_UP';
    } else {
      triggerModalType = 'QUEST_COMPLETE';
    }

    // Check achievements updates
    const totalDone = updatedQuests.filter((q) => q.completed).length;
    const totalVerifiedPhotos = updatedQuests.filter((q) => q.completed && q.proofImage).length;

    const updatedAchievements = achievements.map((ach) => {
      if (ach.unlocked) return ach;
      let newProgress = ach.progress;
      let didUnlock = false;

      if (ach.id === 'first_quest') {
        newProgress = 1;
        didUnlock = true;
      } else if (ach.id === 'quest_10') {
        newProgress = Math.min(ach.maxProgress, totalDone);
        if (newProgress >= ach.maxProgress) didUnlock = true;
      } else if (ach.id === 'quest_master') {
        newProgress = Math.min(ach.maxProgress, totalDone);
        if (newProgress >= ach.maxProgress) didUnlock = true;
      } else if (ach.id === 'level_10') {
        newProgress = Math.min(ach.maxProgress, newLevel);
        if (newProgress >= ach.maxProgress) didUnlock = true;
      } else if (ach.id === 'rank_s') {
        if (['S', 'SS', 'X'].includes(newRank)) {
          newProgress = 1;
          didUnlock = true;
        }
      } else if (ach.id === 'epic_conqueror') {
        if (targetQuest.difficulty === QuestDifficulty.EPIC) {
          newProgress = 1;
          didUnlock = true;
        }
      } else if (ach.id === 'photo_first') {
        if (hasProof || totalVerifiedPhotos > 0) {
          newProgress = 1;
          didUnlock = true;
        }
      } else if (ach.id === 'photo_master') {
        newProgress = Math.min(ach.maxProgress, totalVerifiedPhotos);
        if (newProgress >= ach.maxProgress) didUnlock = true;
      }

      if (didUnlock) {
        sound.playAchievement();
        updatedProfile.totalXp += ach.xpBonus;
        updatedProfile.currentXp += ach.xpBonus;
        return { ...ach, progress: ach.maxProgress, unlocked: true };
      }

      return { ...ach, progress: newProgress };
    });

    setAchievements(updatedAchievements);
    storage.saveAchievements(updatedAchievements);

    setLevelUpModalState({
      isOpen: true,
      type: triggerModalType,
      level: updatedProfile.level,
      rank: updatedProfile.rank,
      questTitle: targetQuest.title,
      xpGained,
      statGains: targetQuest.statRewards,
    });

    setQuests(updatedQuests);
    setProfile(updatedProfile);
    storage.saveQuests(updatedQuests);
    storage.saveProfile(updatedProfile);
  };

  // Revert / Uncomplete Quest
  const handleRevertQuestComplete = (id: string) => {
    if (!profile) return;

    const questIndex = quests.findIndex((q) => q.id === id);
    if (questIndex === -1) return;

    const targetQuest = quests[questIndex];
    sound.playClick();

    const hadProof = !!targetQuest.proofImage;
    const bonusXp = hadProof ? (settings.photoBonusXp || 15) : 0;
    const xpToDeduct = targetQuest.xpReward + bonusXp;

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...targetQuest,
      completed: false,
      completedAt: undefined,
      proofImage: undefined,
      proofNote: undefined,
      proofVerifiedAt: undefined,
      proofAiScan: undefined,
    };

    const updatedProfile = {
      ...profile,
      currentXp: Math.max(0, profile.currentXp - xpToDeduct),
      totalXp: Math.max(0, profile.totalXp - xpToDeduct),
    };

    setQuests(updatedQuests);
    setProfile(updatedProfile);
    storage.saveQuests(updatedQuests);
    storage.saveProfile(updatedProfile);
  };

  // Add or Update Quest
  const handleSaveQuest = (questData: Partial<Quest>) => {
    sound.playClick();
    let updated: Quest[];

    const existingIdx = quests.findIndex((q) => q.id === questData.id);
    if (existingIdx !== -1) {
      updated = [...quests];
      updated[existingIdx] = { ...updated[existingIdx], ...questData } as Quest;
    } else {
      const newQuest: Quest = {
        id: questData.id || 'quest_' + Date.now(),
        title: questData.title || 'New Directive',
        description: questData.description,
        difficulty: questData.difficulty || QuestDifficulty.NORMAL,
        category: questData.category || QuestDifficulty.NORMAL,
        xpReward: questData.xpReward || 25,
        statRewards: questData.statRewards,
        completed: false,
        createdAt: new Date().toISOString(),
        isDaily: questData.isDaily,
        repeatType: questData.repeatType || 'NONE',
        deadline: questData.deadline,
        reminderTime: questData.reminderTime,
      } as Quest;
      updated = [newQuest, ...quests];
    }

    setQuests(updated);
    storage.saveQuests(updated);
  };

  // Delete Quest
  const handleDeleteQuest = (id: string) => {
    sound.playClick();
    const updated = quests.filter((q) => q.id !== id);
    setQuests(updated);
    storage.saveQuests(updated);
  };

  // Chat with NOVA System Companion
  const handleSendNovaMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    storage.saveChatHistory(updatedHistory);
    setIsNovaLoading(true);

    try {
      const response = await fetch('/api/nova', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile,
          recentQuests: quests.slice(0, 6),
        }),
      });

      const data = await response.json();

      const novaMsg: ChatMessage = {
        id: 'msg_nova_' + Date.now(),
        sender: 'nova',
        text: data.text || "Directives received, Hunter. Standing by.",
        suggestedQuests: data.suggestedQuests || [],
        timestamp: new Date().toISOString(),
      };

      const finalHistory = [...updatedHistory, novaMsg];
      setChatHistory(finalHistory);
      storage.saveChatHistory(finalHistory);
      sound.playSystemNotification();
    } catch (err) {
      console.error('Nova query error', err);
      // Deterministic offline fallback message
      const fallbackMsg: ChatMessage = {
        id: 'msg_fallback_' + Date.now(),
        sender: 'nova',
        text: `[SYSTEM STATUS: OFFLINE DIRECTIVE]\nHunter ${profile?.username || ''}, the neural matrix is operating in tactical local mode. Focus on clearing your active daily quests to maintain your streak!`,
        timestamp: new Date().toISOString(),
      };
      const finalHistory = [...updatedHistory, fallbackMsg];
      setChatHistory(finalHistory);
      storage.saveChatHistory(finalHistory);
    } finally {
      setIsNovaLoading(false);
    }
  };

  // Import suggested quest from NOVA directly
  const handleAddSuggestedQuest = (suggested: Partial<Quest>) => {
    handleSaveQuest(suggested);
  };

  // Export JSON Backup
  const handleExportData = () => {
    sound.playClick();
    const backupData = {
      profile,
      quests,
      achievements,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_levelzero_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.profile) {
          setProfile(data.profile);
          storage.saveProfile(data.profile);
        }
        if (data.quests) {
          setQuests(data.quests);
          storage.saveQuests(data.quests);
        }
        if (data.achievements) {
          setAchievements(data.achievements);
          storage.saveAchievements(data.achievements);
        }
        sound.playLevelUp();
        alert('System matrix restored successfully!');
      } catch {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // Reset Progress Data
  const handleResetData = () => {
    localStorage.clear();
    const newProfile = storage.initProfile('ShadowHunter', PathClass.DISCIPLINE, AvatarStyle.SHADOW_WARRIOR);
    setProfile(newProfile);
    setQuests(storage.getQuests());
    setAchievements(storage.getAchievements());
    setCurrentTab('HOME');
  };

  // 1. Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. Onboarding Screen if profile not initialized
  if (!profile || !profile.onboarded) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#040308] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Anime Grid Lines & Scanlines */}
      <div className="fixed inset-0 bg-scanlines pointer-events-none opacity-40 z-0" />
      <div className="fixed top-0 left-0 right-0 h-40 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none z-0" />

      {/* Main Screen Container */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-3 sm:px-5 pt-3 sm:pt-5 pb-24 flex-1">
        {currentTab === 'HOME' && (
          <HomeView
            profile={profile}
            quests={quests}
            onToggleComplete={handleToggleCompleteQuest}
            onOpenNewQuest={() => {
              setEditingQuest(null);
              setShowQuestModal(true);
            }}
            onOpenNova={() => setShowNovaModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onViewAllQuests={() => setCurrentTab('QUESTS')}
            onViewStats={() => setCurrentTab('STATS')}
            onViewProof={(q) => setViewingProofQuest(q)}
          />
        )}

        {currentTab === 'QUESTS' && (
          <QuestsView
            quests={quests}
            onToggleComplete={handleToggleCompleteQuest}
            onDeleteQuest={handleDeleteQuest}
            onEditQuest={(q) => {
              setEditingQuest(q);
              setShowQuestModal(true);
            }}
            onOpenNewQuest={() => {
              setEditingQuest(null);
              setShowQuestModal(true);
            }}
            onViewProof={(q) => setViewingProofQuest(q)}
          />
        )}

        {currentTab === 'STATS' && <StatsView profile={profile} />}

        {currentTab === 'ACHIEVEMENTS' && (
          <AchievementsView achievements={achievements} />
        )}

        {currentTab === 'PROFILE' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={(updated) => {
              const newProf = { ...profile, ...updated };
              setProfile(newProf);
              storage.saveProfile(newProf);
            }}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenApkGuide={() => setShowApkGuideModal(true)}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Floating Tactical NOVA Button */}
      <button
        onClick={() => {
          sound.playClick();
          setShowNovaModal(true);
        }}
        className="fixed bottom-20 right-4 sm:right-8 z-40 p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-slate-950 font-bold shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-cyan-300"
        title="Summon NOVA AI"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#040308] animate-ping" />
      </button>

      {/* Bottom Navigation Bar (Android Mobile-Optimized) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070611]/95 border-t border-cyan-500/30 backdrop-blur-lg">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          {[
            { key: 'HOME' as NavTab, label: 'Core', icon: <Home className="w-5 h-5" /> },
            { key: 'QUESTS' as NavTab, label: 'Directives', icon: <CheckSquare className="w-5 h-5" /> },
            { key: 'STATS' as NavTab, label: 'Radar', icon: <Shield className="w-5 h-5" /> },
            { key: 'ACHIEVEMENTS' as NavTab, label: 'Feats', icon: <Trophy className="w-5 h-5" /> },
            { key: 'PROFILE' as NavTab, label: 'Hunter', icon: <User className="w-5 h-5" /> },
          ].map((t) => {
            const isActive = currentTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  sound.playClick();
                  setCurrentTab(t.key);
                }}
                className={`flex-1 py-1.5 flex flex-col items-center gap-1 transition-all rounded-xl relative ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-500 hover:text-slate-300 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe]" />
                )}
                {t.icon}
                <span className="text-[10px] uppercase font-['Orbitron'] tracking-wider">
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <QuestModal
        isOpen={showQuestModal}
        onClose={() => {
          setShowQuestModal(false);
          setEditingQuest(null);
        }}
        onSave={handleSaveQuest}
        initialQuest={editingQuest}
      />

      <LevelUpModal
        isOpen={levelUpModalState.isOpen}
        onClose={() => setLevelUpModalState((prev) => ({ ...prev, isOpen: false }))}
        type={levelUpModalState.type}
        level={levelUpModalState.level}
        rank={levelUpModalState.rank}
        questTitle={levelUpModalState.questTitle}
        xpGained={levelUpModalState.xpGained}
        statGains={levelUpModalState.statGains}
      />

      <NovaAssistant
        isOpen={showNovaModal}
        onClose={() => setShowNovaModal(false)}
        profile={profile}
        quests={quests}
        chatHistory={chatHistory}
        onSendMessage={handleSendNovaMessage}
        onAddSuggestedQuest={handleAddSuggestedQuest}
        isLoading={isNovaLoading}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={(newSet) => {
          setSettings(newSet);
          storage.saveSettings(newSet);
        }}
        onResetData={handleResetData}
        onOpenApkGuide={() => setShowApkGuideModal(true)}
      />

      <ApkGuideModal
        isOpen={showApkGuideModal}
        onClose={() => setShowApkGuideModal(false)}
      />

      {/* Quest Photo Verification Scanner Modal */}
      <ProofVerificationModal
        isOpen={!!verifyingQuest}
        quest={verifyingQuest}
        profile={profile}
        bonusXp={settings.photoBonusXp || 15}
        onClose={() => setVerifyingQuest(null)}
        onConfirmComplete={(questId, proofData) => {
          handleExecuteQuestComplete(questId, proofData);
          setVerifyingQuest(null);
        }}
      />

      {/* Quest Photo Archive Evidence Viewer Modal */}
      <ProofViewModal
        isOpen={!!viewingProofQuest}
        quest={viewingProofQuest}
        onClose={() => setViewingProofQuest(null)}
      />
    </div>
  );
}
