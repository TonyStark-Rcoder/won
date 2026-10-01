import React from 'react';
import {
  Shield,
  Zap,
  Flame,
  Award,
  TrendingUp,
  Brain,
  Dumbbell,
  Target,
  Sparkles,
  Heart,
  Timer,
} from 'lucide-react';
import { PlayerRank, PlayerStats, UserProfile } from '../types';
import { RadarChart } from '../components/RadarChart';
import { RANK_THEMES } from '../services/levelSystem';

interface StatsViewProps {
  profile: UserProfile;
}

export const StatsView: React.FC<StatsViewProps> = ({ profile }) => {
  const currentRankTheme = RANK_THEMES[profile.rank] || RANK_THEMES[PlayerRank.E];

  const statMetadata: {
    key: keyof PlayerStats;
    name: string;
    code: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
  }[] = [
    {
      key: 'strength',
      name: 'Strength',
      code: 'STR',
      icon: <Dumbbell className="w-4 h-4 text-rose-400" />,
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
      desc: 'Physical stamina, calisthenic power & muscular resilience.',
    },
    {
      key: 'intelligence',
      name: 'Intelligence',
      code: 'INT',
      icon: <Brain className="w-4 h-4 text-cyan-400" />,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
      desc: 'Knowledge retention, algorithm theory & technical capability.',
    },
    {
      key: 'agility',
      name: 'Agility',
      code: 'AGI',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
      desc: 'Execution velocity, fast reaction speed & low procrastination.',
    },
    {
      key: 'vitality',
      name: 'Vitality',
      code: 'VIT',
      icon: <Heart className="w-4 h-4 text-amber-400" />,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
      desc: 'Cellular recovery, deep restorative sleep & sustained bodily energy.',
    },
    {
      key: 'focus',
      name: 'Focus',
      code: 'FOC',
      icon: <Target className="w-4 h-4 text-purple-400" />,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
      desc: 'Unbroken concentration flow state & digital distraction resistance.',
    },
    {
      key: 'discipline',
      name: 'Discipline',
      code: 'DIS',
      icon: <Timer className="w-4 h-4 text-blue-400" />,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
      desc: 'Unyielding daily habit consistency & streak preservation.',
    },
  ];

  // Rank progression tiers
  const ranksList: { rank: PlayerRank; reqLvl: string; title: string }[] = [
    { rank: PlayerRank.E, reqLvl: 'LV 1-2', title: 'Recruit Awakened' },
    { rank: PlayerRank.D, reqLvl: 'LV 3-4', title: 'Shadow Initiate' },
    { rank: PlayerRank.C, reqLvl: 'LV 5-7', title: 'Arcane Striker' },
    { rank: PlayerRank.B, reqLvl: 'LV 8-11', title: 'Vanguard Slayer' },
    { rank: PlayerRank.A, reqLvl: 'LV 12-16', title: 'Elite Phantom' },
    { rank: PlayerRank.S, reqLvl: 'LV 17-22', title: 'Monarch Conqueror' },
    { rank: PlayerRank.SS, reqLvl: 'LV 23-29', title: 'Supreme Overlord' },
    { rank: PlayerRank.X, reqLvl: 'LV 30+', title: 'God-Tier Sovereign' },
  ];

  // 14-Day Activity blocks
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const count = profile.activityHistory?.[dateKey] || (i === 13 ? 1 : 0);
    return { date: dateKey, dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }), count };
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold font-['Orbitron'] text-slate-100 tracking-wider">
          ATTRIBUTES & SYSTEM RADAR
        </h1>
        <p className="text-xs text-slate-400">
          Real-time neuro-physical attribute analysis and ascension roadmap
        </p>
      </div>

      {/* Hexagonal Radar Chart Card */}
      <div className="rounded-2xl bg-[#0b0a17] border border-cyan-500/30 p-5 shadow-xl shadow-black/60 flex flex-col items-center relative overflow-hidden">
        <div className="w-full flex justify-between items-center mb-2">
          <div className="text-xs font-bold font-['Orbitron'] text-slate-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>HEXAGONAL ATTRIBUTE MATRIX</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            PATH: {profile.path}
          </span>
        </div>

        <RadarChart
          stats={profile.stats}
          size={250}
          color={currentRankTheme.auraColor}
        />

        <div className="text-[11px] text-slate-500 text-center mt-2 font-mono">
          Attributes scale dynamically through completed quest directives.
        </div>
      </div>

      {/* Attribute Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {statMetadata.map((stat) => (
          <div
            key={stat.key}
            className={`p-3.5 rounded-xl border ${stat.color} backdrop-blur-md flex items-start gap-3`}
          >
            <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex-shrink-0">
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold font-['Orbitron'] text-slate-100">
                  {stat.name}
                </div>
                <div className="text-sm font-mono font-black text-slate-100">
                  {profile.stats[stat.key]}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 14-Day Activity Log */}
      <div className="rounded-2xl bg-[#0b0a17] border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="font-bold font-['Orbitron'] text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>14-DAY ACTIVITY MATRIX</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak: {profile.streakCurrent}d (Best: {profile.streakBest}d)</span>
          </div>
        </div>

        <div className="flex justify-between items-center gap-1 pt-1">
          {last14Days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                title={`${d.date}: ${d.count} completed`}
                className={`w-full h-8 rounded-md transition-all ${
                  d.count > 2
                    ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                    : d.count > 0
                    ? 'bg-cyan-700/80'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              />
              <span className="text-[9px] font-mono text-slate-500 uppercase">{d.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rank Ascension Hierarchy Roadmap */}
      <div className="rounded-2xl bg-[#0b0a17] border border-slate-800 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold font-['Orbitron'] text-slate-300">
          <Award className="w-4 h-4 text-purple-400" />
          <span>HUNTER ASCENSION LADDER</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ranksList.map((r) => {
            const isCurrent = profile.rank === r.rank;
            const theme = RANK_THEMES[r.rank];

            return (
              <div
                key={r.rank}
                className={`p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? `${theme.badgeBg} ${theme.badgeBorder} ring-1 ring-cyan-400 shadow-lg shadow-cyan-950/50`
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black font-['Orbitron'] ${theme.textColor}`}>
                    RANK {r.rank}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 font-semibold">
                    {r.reqLvl}
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-slate-300 truncate">
                  {r.title}
                </div>
                {isCurrent && (
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase font-['Orbitron'] text-cyan-400">
                    • CURRENT STATUS
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
