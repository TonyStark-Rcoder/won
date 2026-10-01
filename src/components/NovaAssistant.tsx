import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Sparkles,
  Plus,
  Zap,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage, Quest, UserProfile } from '../types';
import { sound } from '../services/soundEngine';

interface NovaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  quests: Quest[];
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onAddSuggestedQuest: (quest: Partial<Quest>) => void;
  isLoading: boolean;
}

export const NovaAssistant: React.FC<NovaAssistantProps> = ({
  isOpen,
  onClose,
  profile,
  chatHistory,
  onSendMessage,
  onAddSuggestedQuest,
  isLoading,
}) => {
  const [input, setInput] = useState('');
  const [addedQuestIds, setAddedQuestIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '⚔️ Suggest Daily Quests', prompt: 'NOVA, suggest 3 balanced daily quests for my current rank and path.' },
    { label: '🧩 Break Down a Goal', prompt: 'Help me break down a major goal into 3 leveled quests.' },
    { label: '📊 System Status Audit', prompt: 'NOVA, audit my XP progress, level, and stats.' },
    { label: '🔥 Motivate Me', prompt: 'NOVA, give me high-energy system motivation to crush my next quest!' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    sound.playClick();
    setInput('');
    await onSendMessage(text.trim());
  };

  const handleAddQuest = (quest: Partial<Quest>, idx: number, msgId: string) => {
    sound.playClick();
    const key = `${msgId}_${idx}`;
    setAddedQuestIds((prev) => new Set(prev).add(key));
    onAddSuggestedQuest(quest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[720px] rounded-2xl bg-[#090815] border border-cyan-500/40 flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Holographic Top Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900/90 to-[#120d2b]/90 border-b border-cyan-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Animated Nova Core Avatar */}
            <div className="relative w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/80 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#090815] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-['Orbitron'] text-slate-100 tracking-wider">
                  NOVA CORE
                </h2>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  AI SYSTEM COMPANION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Personal intelligence for Hunter {profile.username}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              disabled={isLoading}
              onClick={() => handleSend(qp.prompt)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-300 hover:text-cyan-200 whitespace-nowrap transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-scanlines">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'nova' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-[#100e24]/90 border border-cyan-500/30 text-slate-200 rounded-tl-sm shadow-lg shadow-black/40'
                }`}
              >
                {/* Formatted Content */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Render Suggested Quests if any */}
                {msg.suggestedQuests && msg.suggestedQuests.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-bold font-['Orbitron'] text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>GENERATED DIRECTIVES</span>
                    </div>

                    {msg.suggestedQuests.map((sq, idx) => {
                      const questKey = `${msg.id}_${idx}`;
                      const isAdded = addedQuestIds.has(questKey);

                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                                {sq.difficulty || 'NORMAL'}
                              </span>
                              <span className="text-[10px] font-bold text-cyan-300 font-['Orbitron']">
                                +{sq.xpReward || 25} XP
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-100 truncate">
                              {sq.title}
                            </div>
                            {sq.description && (
                              <div className="text-[11px] text-slate-400 truncate">
                                {sq.description}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddQuest(sq, idx, msg.id)}
                            disabled={isAdded}
                            className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold font-['Orbitron'] flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>ADDED</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>ADD</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-[10px] text-slate-500 mt-2 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#100e24]/90 border border-cyan-500/30 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>NOVA is synchronizing neural network directives...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 flex-shrink-0"
        >
          <input
            type="text"
            placeholder="Command NOVA (e.g., break down my study plan into quests)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-['Orbitron'] hover:opacity-90 transition disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-cyan-500/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TRANSMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
