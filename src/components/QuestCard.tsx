import React from 'react';
import {
  Check,
  Clock,
  Repeat,
  Trash2,
  BookOpen,
  Dumbbell,
  Briefcase,
  User,
  Zap,
  Flame,
  Camera,
} from 'lucide-react';
import { Quest, QuestCategory, QuestDifficulty } from '../types';

interface QuestCardProps {
  quest: Quest;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (quest: Quest) => void;
  onViewProof?: (quest: Quest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onToggleComplete,
  onDelete,
  onEdit,
  onViewProof,
}) => {
  const getDifficultyTheme = (diff: QuestDifficulty) => {
    switch (diff) {
      case QuestDifficulty.EASY:
        return {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300',
          xpColor: 'text-emerald-400',
        };
      case QuestDifficulty.NORMAL:
        return {
          border: 'border-cyan-500/30',
          bg: 'bg-cyan-950/20',
          text: 'text-cyan-400',
          badge: 'bg-cyan-900/40 border-cyan-500/50 text-cyan-300',
          xpColor: 'text-cyan-400',
        };
      case QuestDifficulty.HARD:
        return {
          border: 'border-purple-500/40',
          bg: 'bg-purple-950/25',
          text: 'text-purple-400',
          badge: 'bg-purple-900/40 border-purple-400/60 text-purple-300',
          xpColor: 'text-purple-400',
        };
      case QuestDifficulty.EPIC:
        return {
          border: 'border-amber-500/60',
          bg: 'bg-amber-950/30',
          text: 'text-amber-400',
          badge: 'bg-amber-900/50 border-amber-400 text-amber-200 neon-gold-glow animate-pulse',
          xpColor: 'text-amber-300',
        };
      default:
        return {
          border: 'border-slate-700',
          bg: 'bg-slate-900/40',
          text: 'text-slate-300',
          badge: 'bg-slate-800 border-slate-700 text-slate-300',
          xpColor: 'text-slate-300',
        };
    }
  };

  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case QuestCategory.STUDY:
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case QuestCategory.FITNESS:
        return <Dumbbell className="w-3.5 h-3.5 text-rose-400" />;
      case QuestCategory.WORK:
        return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
      case QuestCategory.READING:
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      case QuestCategory.PERSONAL:
        return <User className="w-3.5 h-3.5 text-emerald-400" />;
      case QuestCategory.DAILY:
      default:
        return <Flame className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const diffTheme = getDifficultyTheme(quest.difficulty);

  return (
    <div
      className={`group relative rounded-xl transition-all duration-200 border ${
        quest.completed
          ? 'bg-[#080812]/50 border-slate-800/60 opacity-60'
          : `${diffTheme.bg} ${diffTheme.border} hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-950/30`
      } p-3.5 backdrop-blur-md`}
    >
      <div className="flex items-start gap-3">
        {/* Futuristic Hex/Square Checkbox */}
        <button
          onClick={() => onToggleComplete(quest.id)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${
            quest.completed
              ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md shadow-cyan-500/50'
              : 'border-slate-600 bg-slate-900/80 hover:border-cyan-400 hover:bg-cyan-950/40 text-transparent'
          }`}
          title={quest.completed ? 'Mark pending' : 'Complete Quest'}
          aria-label={quest.title}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] ${quest.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Quest Info */}
        <div className="flex-1 min-w-0" onClick={() => onEdit?.(quest)}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded font-['Orbitron'] border ${diffTheme.badge}`}
            >
              {quest.difficulty}
            </span>

            <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
              {getCategoryIcon(quest.category)}
              <span className="capitalize">{quest.category.toLowerCase()}</span>
            </span>

            {quest.isDaily && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" /> DAILY
              </span>
            )}

            {/* Photo Verified Badge */}
            {quest.proofImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProof?.(quest);
                }}
                className="flex items-center gap-1 text-[10px] font-bold font-['Orbitron'] text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-400/80 px-2 py-0.5 rounded transition shadow-sm"
                title="View Photo Evidence"
              >
                <Camera className="w-2.5 h-2.5 text-emerald-400" />
                <span>PHOTO VERIFIED</span>
              </button>
            )}

            {/* Photo Required Badge when incomplete */}
            {!quest.completed && quest.requiresProof && !quest.proofImage && (
              <span className="flex items-center gap-1 text-[10px] font-bold font-['Orbitron'] text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                <Camera className="w-2.5 h-2.5" /> PHOTO REQUIRED
              </span>
            )}
          </div>

          <h3
            className={`font-semibold text-sm leading-snug tracking-wide transition-all ${
              quest.completed ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-cyan-200'
            }`}
          >
            {quest.title}
          </h3>

          {quest.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
              {quest.description}
            </p>
          )}

          {/* Stat Rewards & Meta */}
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
            {/* XP Badge */}
            <div className={`flex items-center gap-1 font-bold font-['Orbitron'] ${diffTheme.xpColor}`}>
              <Zap className="w-3 h-3 fill-current" />
              <span>+{quest.xpReward} XP</span>
            </div>

            {/* Stat gains */}
            {quest.statRewards && Object.entries(quest.statRewards).map(([stat, val]) => {
              if (!val) return null;
              return (
                <span
                  key={stat}
                  className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-violet-950/40 border border-violet-500/30 text-violet-300"
                >
                  +{val} {stat.substring(0, 3)}
                </span>
              );
            })}

            {quest.deadline && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 ml-auto">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{quest.deadline}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(quest.id);
            }}
            className="text-slate-600 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/30 transition-colors"
            title="Delete Quest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
