import React, { useState, useEffect } from 'react';
import { X, Zap, Shield, BookOpen, Dumbbell, Briefcase, User, Flame, Clock, Camera } from 'lucide-react';
import { Quest, QuestCategory, QuestDifficulty } from '../types';
import { getStatRewardsForQuest, getXpForDifficulty } from '../services/levelSystem';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questData: Partial<Quest>) => void;
  initialQuest?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuest,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(QuestDifficulty.NORMAL);
  const [category, setCategory] = useState<QuestCategory>(QuestCategory.STUDY);
  const [isDaily, setIsDaily] = useState(false);
  const [requiresProof, setRequiresProof] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title);
      setDescription(initialQuest.description || '');
      setDifficulty(initialQuest.difficulty);
      setCategory(initialQuest.category);
      setIsDaily(initialQuest.isDaily || false);
      setRequiresProof(initialQuest.requiresProof || false);
      setDeadline(initialQuest.deadline || '');
      setReminderTime(initialQuest.reminderTime || '');
    } else {
      setTitle('');
      setDescription('');
      setDifficulty(QuestDifficulty.NORMAL);
      setCategory(QuestCategory.STUDY);
      setIsDaily(false);
      setRequiresProof(false);
      setDeadline('');
      setReminderTime('');
    }
  }, [initialQuest, isOpen]);

  if (!isOpen) return null;

  const xpReward = getXpForDifficulty(difficulty);
  const statRewards = getStatRewardsForQuest(category, difficulty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialQuest ? initialQuest.id : 'quest_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category,
      xpReward,
      statRewards,
      isDaily,
      requiresProof,
      deadline: deadline || undefined,
      reminderTime: reminderTime || undefined,
      repeatType: isDaily ? 'DAILY' : 'NONE',
    });

    onClose();
  };

  const categories: { key: QuestCategory; label: string; icon: React.ReactNode }[] = [
    { key: QuestCategory.STUDY, label: 'Study', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: QuestCategory.FITNESS, label: 'Fitness', icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { key: QuestCategory.WORK, label: 'Work', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { key: QuestCategory.READING, label: 'Reading', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: QuestCategory.PERSONAL, label: 'Personal', icon: <User className="w-3.5 h-3.5" /> },
    { key: QuestCategory.DAILY, label: 'Daily System', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  const difficulties: { key: QuestDifficulty; xp: number; color: string }[] = [
    { key: QuestDifficulty.EASY, xp: 10, color: 'border-emerald-500 text-emerald-400' },
    { key: QuestDifficulty.NORMAL, xp: 25, color: 'border-cyan-500 text-cyan-400' },
    { key: QuestDifficulty.HARD, xp: 50, color: 'border-purple-500 text-purple-400' },
    { key: QuestDifficulty.EPIC, xp: 100, color: 'border-amber-500 text-amber-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0b0a17] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-lg font-bold font-['Orbitron'] text-slate-100 tracking-wider">
              {initialQuest ? 'REVISE DIRECTIVE' : 'NEW QUEST DIRECTIVE'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-['Orbitron']">
              Directive Objective *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Study Algorithm Theory for 30 min"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-['Orbitron']">
              Tactical Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Describe constraints or victory conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm resize-none"
            />
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-['Orbitron']">
              Difficulty & Reward
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDifficulty(d.key)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold font-['Orbitron'] flex flex-col items-center gap-1 transition-all ${
                    difficulty === d.key
                      ? `bg-slate-900 ${d.color} ring-2 ring-current shadow-lg`
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{d.key}</span>
                  <span className="text-[11px] font-mono opacity-80">+{d.xp} XP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-['Orbitron']">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`px-2.5 py-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                    category === c.key
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options: Daily quest toggle + Photo proof toggle + Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <input
                type="checkbox"
                id="dailyCheckbox"
                checked={isDaily}
                onChange={(e) => setIsDaily(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 border-slate-700 focus:ring-0 focus:ring-offset-0 bg-slate-950"
              />
              <label htmlFor="dailyCheckbox" className="text-xs text-slate-300 cursor-pointer font-medium select-none">
                Repeat as Daily Quest
              </label>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <input
                type="checkbox"
                id="photoProofCheckbox"
                checked={requiresProof}
                onChange={(e) => setRequiresProof(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 border-slate-700 focus:ring-0 focus:ring-offset-0 bg-slate-950"
              />
              <label htmlFor="photoProofCheckbox" className="text-xs text-slate-300 cursor-pointer font-medium select-none flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Require Photo Proof (+15 XP)</span>
              </label>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Deadline (e.g. 18:00 Today, or Tomorrow 09:00)"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Projected Growth Preview Card */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-semibold">Yield:</span>
              <span className="text-cyan-400 font-bold font-['Orbitron']">+{xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              {Object.entries(statRewards).map(([stat, val]) => (
                <span key={stat} className="text-purple-300 font-mono text-[11px] uppercase">
                  +{val} {stat.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs tracking-wider uppercase font-['Orbitron'] hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/30"
            >
              {initialQuest ? 'Update Directive' : 'Commence Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
