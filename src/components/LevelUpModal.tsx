import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap, ChevronRight, Shield, Crown } from 'lucide-react';
import { PlayerRank, PlayerStats } from '../types';
import { RANK_THEMES } from '../services/levelSystem';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'LEVEL_UP' | 'RANK_UP' | 'QUEST_COMPLETE';
  level: number;
  rank: PlayerRank;
  questTitle?: string;
  xpGained?: number;
  statGains?: Partial<PlayerStats>;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  type,
  level,
  rank,
  questTitle,
  xpGained = 25,
  statGains,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    if (type === 'LEVEL_UP' || type === 'RANK_UP') {
      try {
        confetti({
          particleCount: type === 'RANK_UP' ? 120 : 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#7b2cbf', '#9d4edd', '#facc15', '#38bdf8'],
        });
      } catch {
        // Safe fallback if canvas not available
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const currentRankTheme = RANK_THEMES[rank] || RANK_THEMES[PlayerRank.E];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      {/* Background Energy Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ backgroundColor: currentRankTheme.auraColor }}
        />
      </div>

      <div className="relative w-full max-w-md rounded-2xl bg-[#090814]/95 border-2 border-cyan-400/60 p-6 sm:p-8 text-center shadow-2xl shadow-cyan-950/80 overflow-hidden">
        {/* Animated Sweep Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        {type === 'LEVEL_UP' || type === 'RANK_UP' ? (
          <div>
            {/* Crown / Trophy Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-purple-950/60 border-2 border-cyan-400 p-4 mb-4 shadow-lg shadow-cyan-500/40 animate-bounce">
              {type === 'RANK_UP' ? (
                <Crown className="w-10 h-10 text-amber-400 fill-amber-400/30 neon-gold-glow" />
              ) : (
                <Trophy className="w-10 h-10 text-cyan-400 neon-cyan-glow" />
              )}
            </div>

            <div className="text-xs font-bold uppercase tracking-widest font-['Orbitron'] text-cyan-400 mb-1">
              {type === 'RANK_UP' ? '⚡ RANK PROMOTION ⚡' : 'SYSTEM ASCENSION'}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-['Orbitron'] tracking-wider text-slate-100 mb-2 neon-cyan-glow">
              {type === 'RANK_UP' ? `RANK ${rank}` : `LEVEL ${String(level).padStart(2, '0')}`}
            </h2>

            <p className="text-sm text-slate-300 font-medium mb-6">
              {type === 'RANK_UP'
                ? `You have evolved into Rank ${rank}: "${currentRankTheme.title}". Your aura has expanded!`
                : `Your limit has shattered! All core attributes and energy reservoirs have strengthened.`}
            </p>

            {/* Rank / Level Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 mb-6">
              <span className="text-xs text-slate-400 uppercase font-semibold">Classification:</span>
              <span className={`text-sm font-bold font-['Orbitron'] ${currentRankTheme.textColor}`}>
                Rank {rank} • Level {level}
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Standard Quest Complete Modal */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/60 p-3 mb-4 shadow-lg shadow-cyan-500/30">
              <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
            </div>

            <div className="text-xs font-bold uppercase tracking-widest font-['Orbitron'] text-cyan-400 mb-1">
              QUEST COMPLETE
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-['Orbitron'] text-slate-100 mb-2">
              {questTitle || 'Directive Accomplished'}
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 font-bold font-['Orbitron'] text-sm mb-4">
              <Zap className="w-4 h-4 fill-current" />
              <span>+{xpGained} XP ACQUIRED</span>
            </div>

            {/* Stat Gains if any */}
            {statGains && Object.keys(statGains).length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                {Object.entries(statGains).map(([stat, val]) => (
                  <span
                    key={stat}
                    className="text-xs font-mono font-bold px-2 py-1 rounded bg-purple-950/50 border border-purple-500/40 text-purple-300"
                  >
                    +{val} {stat.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-slate-950 font-bold font-['Orbitron'] tracking-wider uppercase text-sm hover:opacity-95 transition shadow-lg shadow-cyan-500/40 flex items-center justify-center gap-2"
        >
          <span>CONTINUE EVOLVING</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
