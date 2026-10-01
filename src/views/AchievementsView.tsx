import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Sword,
  Flame,
  ShieldAlert,
  Zap,
  Crown,
  Skull,
  Moon,
  BookOpen,
  Lock,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { Achievement } from '../types';
import { sound } from '../services/soundEngine';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const getIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-5 h-5 ${unlocked ? 'text-amber-400' : 'text-slate-600'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={cls} />;
      case 'Sword':
        return <Sword className={cls} />;
      case 'Trophy':
        return <Trophy className={cls} />;
      case 'Flame':
        return <Flame className={cls} />;
      case 'ShieldAlert':
        return <ShieldAlert className={cls} />;
      case 'Zap':
        return <Zap className={cls} />;
      case 'Crown':
        return <Crown className={cls} />;
      case 'Skull':
        return <Skull className={cls} />;
      case 'Moon':
        return <Moon className={cls} />;
      case 'Camera':
        return <Camera className={cls} />;
      case 'BookOpen':
      default:
        return <BookOpen className={cls} />;
    }
  };

  const categories = ['ALL', 'Progression', 'Quests', 'Proof', 'Discipline', 'Level', 'Rank', 'Special'];

  const filtered = achievements.filter((a) => {
    if (filterCategory !== 'ALL' && a.category !== filterCategory) return false;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-['Orbitron'] text-slate-100 tracking-wider">
            HUNTER TROPHIES & FEATS
          </h1>
          <p className="text-xs text-slate-400">
            Conquer legendary milestones to unlock massive XP bonuses
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-bold font-['Orbitron']">
          <Trophy className="w-3.5 h-3.5 fill-current" />
          <span>{unlockedCount} / {achievements.length}</span>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              sound.playClick();
              setFilterCategory(c);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition ${
              filterCategory === c
                ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((ach) => {
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`relative rounded-2xl p-4 border transition-all duration-200 backdrop-blur-md ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-amber-950/20 via-[#0e0c1f] to-purple-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-[#090815]/80 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Achievement Badge */}
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-950/60 border-amber-400/80 shadow-md shadow-amber-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {getIcon(ach.iconName, ach.unlocked)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3
                      className={`text-xs font-bold font-['Orbitron'] truncate ${
                        ach.unlocked ? 'text-amber-300' : 'text-slate-300'
                      }`}
                    >
                      {ach.title}
                    </h3>
                    <span
                      className={`text-[11px] font-bold font-['Orbitron'] ${
                        ach.unlocked ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      +{ach.xpBonus} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {ach.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-slate-500">
                        {ach.unlocked ? 'COMPLETED' : 'PROGRESS'}
                      </span>
                      <span>
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          ach.unlocked
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm shadow-amber-400'
                            : 'bg-cyan-600/70'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
