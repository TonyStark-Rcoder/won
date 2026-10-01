import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  BookOpen,
  Dumbbell,
  Briefcase,
  User,
} from 'lucide-react';
import { Quest, QuestCategory, QuestDifficulty } from '../types';
import { QuestCard } from '../components/QuestCard';
import { sound } from '../services/soundEngine';

interface QuestsViewProps {
  quests: Quest[];
  onToggleComplete: (id: string) => void;
  onDeleteQuest: (id: string) => void;
  onEditQuest: (quest: Quest) => void;
  onOpenNewQuest: () => void;
  onViewProof?: (quest: Quest) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  quests,
  onToggleComplete,
  onDeleteQuest,
  onEditQuest,
  onOpenNewQuest,
  onViewProof,
}) => {
  const [tab, setTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  const categories: { key: string; label: string; icon?: React.ReactNode }[] = [
    { key: 'ALL', label: 'All Directives' },
    { key: 'DAILY', label: 'Daily', icon: <Flame className="w-3 h-3 text-amber-500" /> },
    { key: QuestCategory.STUDY, label: 'Study', icon: <BookOpen className="w-3 h-3 text-cyan-400" /> },
    { key: QuestCategory.FITNESS, label: 'Fitness', icon: <Dumbbell className="w-3 h-3 text-rose-400" /> },
    { key: QuestCategory.WORK, label: 'Work', icon: <Briefcase className="w-3 h-3 text-amber-400" /> },
    { key: QuestCategory.READING, label: 'Reading', icon: <BookOpen className="w-3 h-3 text-purple-400" /> },
    { key: QuestCategory.PERSONAL, label: 'Personal', icon: <User className="w-3 h-3 text-emerald-400" /> },
  ];

  const filteredQuests = quests.filter((q) => {
    // Tab filter
    if (tab === 'ACTIVE' && q.completed) return false;
    if (tab === 'COMPLETED' && !q.completed) return false;

    // Search query
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchDesc = q.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory === 'DAILY') {
      if (!q.isDaily && q.repeatType !== 'DAILY') return false;
    } else if (selectedCategory !== 'ALL' && q.category !== selectedCategory) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) {
      return false;
    }

    return true;
  });

  const activeCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header & New Quest Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-['Orbitron'] text-slate-100 tracking-wider">
            HUNTER QUEST LOG
          </h1>
          <p className="text-xs text-slate-400">
            Active directives grant XP and evolve your attributes
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenNewQuest();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-['Orbitron'] text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-cyan-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>NEW QUEST</span>
        </button>
      </div>

      {/* Tabs: ACTIVE vs COMPLETED */}
      <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1">
        <button
          onClick={() => {
            sound.playClick();
            setTab('ACTIVE');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold font-['Orbitron'] transition-all flex items-center justify-center gap-2 ${
            tab === 'ACTIVE'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>ACTIVE DIRECTIVES ({activeCount})</span>
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setTab('COMPLETED');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold font-['Orbitron'] transition-all flex items-center justify-center gap-2 ${
            tab === 'COMPLETED'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ACCOMPLISHED ({completedCount})</span>
        </button>
      </div>

      {/* Search & Difficulty Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search objectives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Difficulty Dropdown */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
        >
          <option value="ALL">All Ranks</option>
          <option value={QuestDifficulty.EASY}>Easy (+10 XP)</option>
          <option value={QuestDifficulty.NORMAL}>Normal (+25 XP)</option>
          <option value={QuestDifficulty.HARD}>Hard (+50 XP)</option>
          <option value={QuestDifficulty.EPIC}>Epic (+100 XP)</option>
        </select>
      </div>

      {/* Category Pills (horizontal scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => {
              sound.playClick();
              setSelectedCategory(c.key);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              selectedCategory === c.key
                ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 font-bold'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            {c.icon}
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Quests List */}
      <div className="space-y-2.5">
        {filteredQuests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#090815] border border-slate-800 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold font-['Orbitron'] text-slate-300">
              NO DIRECTIVES FOUND
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {tab === 'ACTIVE'
                ? 'No active directives match your current filters. Create a new directive to gain XP!'
                : 'No completed directives in this filter category yet.'}
            </p>
            {tab === 'ACTIVE' && (
              <button
                onClick={onOpenNewQuest}
                className="mt-2 text-xs font-bold font-['Orbitron'] text-cyan-400 px-4 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30"
              >
                + Create Quest
              </button>
            )}
          </div>
        ) : (
          filteredQuests.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteQuest}
              onEdit={onEditQuest}
              onViewProof={onViewProof}
            />
          ))
        )}
      </div>
    </div>
  );
};
