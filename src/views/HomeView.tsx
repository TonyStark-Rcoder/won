import React from 'react';
import {
  Flame,
  Zap,
  Plus,
  Bot,
  Sliders,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PlayerRank, Quest, UserProfile } from '../types';
import { AnimeAvatar } from '../components/AnimeAvatar';
import { QuestCard } from '../components/QuestCard';
import { RANK_THEMES } from '../services/levelSystem';
import { sound } from '../services/soundEngine';

interface HomeViewProps {
  profile: UserProfile;
  quests: Quest[];
  onToggleComplete: (id: string) => void;
  onOpenNewQuest: () => void;
  onOpenNova: () => void;
  onOpenSettings: () => void;
  onViewAllQuests: () => void;
  onViewStats: () => void;
  onViewProof?: (quest: Quest) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  quests,
  onToggleComplete,
  onOpenNewQuest,
  onOpenNova,
  onOpenSettings,
  onViewAllQuests,
  onViewStats,
  onViewProof,
}) => {
  const currentRankTheme = RANK_THEMES[profile.rank] || RANK_THEMES[PlayerRank.E];
  const xpPercent = Math.min(100, Math.round((profile.currentXp / profile.requiredXp) * 100));

  // Filter daily and active quests
  const dailyQuests = quests.filter((q) => q.isDaily || q.repeatType === 'DAILY');
  const pendingDailyQuests = dailyQuests.filter((q) => !q.completed);
  const completedDailyCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="space-y-5 pb-6">
      {/* --- TOP PROFILE HUD CARD --- */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0e0c20]/90 to-[#070611]/90 border border-cyan-500/30 p-4 sm:p-5 shadow-xl shadow-black/60 overflow-hidden">
        {/* Subtle Ambient Aura */}
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentRankTheme.auraColor }}
        />

        {/* Top bar: Settings & Streak */}
        <div className="flex items-center justify-between mb-4">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-bold font-['Orbitron'] shadow-sm shadow-amber-900/30">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse" />
            <span>{profile.streakCurrent} DAY STREAK</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition"
              title="System Configuration"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Avatar & Hunter Identity */}
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={onViewStats}>
            <AnimeAvatar
              style={profile.avatarStyle}
              rank={profile.rank}
              size="md"
              animated
              showBadge
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold font-['Orbitron'] text-slate-100 tracking-wider truncate">
                {profile.username}
              </h1>
              {/* Rank Pill */}
              <span
                className={`text-xs font-bold font-['Orbitron'] px-2 py-0.5 rounded border ${currentRankTheme.badgeBg} ${currentRankTheme.badgeBorder} ${currentRankTheme.textColor}`}
              >
                RANK {profile.rank}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 font-['Rajdhani'] tracking-wide uppercase">
              {profile.title} • {profile.path} PATH
            </p>

            {/* Level Tag */}
            <div className="mt-1 flex items-center gap-1 text-xs font-bold font-['Orbitron'] text-cyan-400">
              <Zap className="w-3 h-3 fill-current" />
              <span>LEVEL {String(profile.level).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Cinematic Animated XP Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between items-baseline text-xs font-['Orbitron']">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <span>EXP MATRIX</span>
              <span className="text-[10px] text-cyan-400">({xpPercent}%)</span>
            </span>
            <span className="text-slate-200 font-mono text-xs">
              <span className="text-cyan-400 font-bold">{profile.currentXp}</span>
              <span className="text-slate-500"> / </span>
              <span className="text-slate-400">{profile.requiredXp} XP</span>
            </span>
          </div>

          <div className="relative h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-[0_0_10px_#00f2fe]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div
          onClick={onViewStats}
          className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-6 gap-1 sm:gap-2 text-center cursor-pointer hover:bg-slate-900/30 rounded-xl p-1 transition"
        >
          {[
            { label: 'STR', val: profile.stats.strength, col: 'text-rose-400' },
            { label: 'INT', val: profile.stats.intelligence, col: 'text-cyan-400' },
            { label: 'AGI', val: profile.stats.agility, col: 'text-emerald-400' },
            { label: 'VIT', val: profile.stats.vitality, col: 'text-amber-400' },
            { label: 'FOC', val: profile.stats.focus, col: 'text-purple-400' },
            { label: 'DIS', val: profile.stats.discipline, col: 'text-blue-400' },
          ].map((s) => (
            <div key={s.label} className="p-1 rounded bg-slate-950/60 border border-slate-800/70">
              <div className="text-[9px] font-mono text-slate-500 font-bold">{s.label}</div>
              <div className={`text-xs font-mono font-bold ${s.col}`}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- NOVA AI COMPANION SUMMON CARD --- */}
      <div
        onClick={() => {
          sound.playClick();
          onOpenNova();
        }}
        className="relative rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#120e28]/50 to-purple-950/30 border border-cyan-500/30 p-3.5 flex items-center justify-between cursor-pointer hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-950/40 transition group"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/30 flex-shrink-0">
            <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-['Orbitron'] text-slate-100 tracking-wider">
                NOVA COMPANION
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              "Ready to conquer today's directives, Hunter? Tap to analyze quests or break down goals."
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* --- DAILY DIRECTIVES SECTION --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-['Orbitron'] text-slate-100 tracking-wider">
              DAILY DIRECTIVES
            </h2>
            <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
              {completedDailyCount} / {dailyQuests.length} Done
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenNewQuest();
              }}
              className="flex items-center gap-1 text-xs font-bold font-['Orbitron'] text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW QUEST</span>
            </button>
          </div>
        </div>

        {/* Quests Container */}
        {pendingDailyQuests.length === 0 && dailyQuests.length > 0 ? (
          <div className="p-6 rounded-2xl bg-[#090815] border border-cyan-500/20 text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-400 mb-1">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold font-['Orbitron'] text-slate-200">
              ALL DAILY DIRECTIVES CLEARED!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Outstanding discipline, Hunter. You've earned all daily system XP quota for today.
            </p>
            <button
              onClick={onOpenNewQuest}
              className="mt-2 text-xs font-bold font-['Orbitron'] text-cyan-400 underline underline-offset-4"
            >
              Assign bonus quest directive
            </button>
          </div>
        ) : dailyQuests.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#090815] border border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">No daily directives active.</p>
            <button
              onClick={onOpenNewQuest}
              className="text-xs font-bold font-['Orbitron'] text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40"
            >
              + Create First Quest
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingDailyQuests.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onToggleComplete={onToggleComplete}
                onViewProof={onViewProof}
              />
            ))}
          </div>
        )}

        {/* View All Quests Link */}
        <button
          onClick={() => {
            sound.playClick();
            onViewAllQuests();
          }}
          className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <span>View All Hunter Quests ({quests.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
