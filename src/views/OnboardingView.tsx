import React, { useState } from 'react';
import { Sparkles, Shield, Zap, Target, BookOpen, ChevronRight } from 'lucide-react';
import { AvatarStyle, PathClass } from '../types';
import { AnimeAvatar } from '../components/AnimeAvatar';
import { DEFAULT_STATS } from '../services/storage';
import { sound } from '../services/soundEngine';

interface OnboardingViewProps {
  onComplete: (username: string, path: PathClass, avatar: AvatarStyle) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarStyle>(AvatarStyle.SHADOW_WARRIOR);
  const [selectedPath, setSelectedPath] = useState<PathClass>(PathClass.DISCIPLINE);

  const avatars: { key: AvatarStyle; label: string; desc: string }[] = [
    { key: AvatarStyle.SHADOW_WARRIOR, label: 'Shadow Warrior', desc: 'Covert operative of relentless execution' },
    { key: AvatarStyle.CYBER_MAGE, label: 'Cyber Mage', desc: 'Arcane intelligence & high-tech calculation' },
    { key: AvatarStyle.DARK_KNIGHT, label: 'Dark Knight', desc: 'Ironclad resilience & immovable discipline' },
    { key: AvatarStyle.MYSTIC_HUNTER, label: 'Mystic Hunter', desc: 'Piercing perception & agile mastery' },
    { key: AvatarStyle.FUTURISTIC_WARRIOR, label: 'Cyber Vanguard', desc: 'Futuristic combat armor & hyperdrive focus' },
  ];

  const paths: { key: PathClass; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: PathClass.DISCIPLINE,
      label: 'Discipline',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      desc: 'Master of iron habits and unyielding consistency.',
    },
    {
      key: PathClass.FOCUS,
      label: 'Focus',
      icon: <Target className="w-4 h-4 text-purple-400" />,
      desc: 'Deep work specialist and distraction destroyer.',
    },
    {
      key: PathClass.KNOWLEDGE,
      label: 'Knowledge',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      desc: 'Scholar of algorithms, literature, and intellect.',
    },
    {
      key: PathClass.STRENGTH,
      label: 'Strength',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      desc: 'Physical power, vitality, and calisthenic endurance.',
    },
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLevelUp();
    onComplete(username.trim() || 'ShadowHunter', selectedPath, selectedAvatar);
  };

  const previewStats = DEFAULT_STATS[selectedPath];

  return (
    <div className="min-h-screen bg-[#040308] text-slate-100 flex flex-col justify-between p-4 sm:p-6 select-none">
      <div className="max-w-xl mx-auto w-full pt-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-['Orbitron'] text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HUNTER REGISTRATION MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Orbitron'] tracking-wider text-slate-100">
            AWAKEN TO LEVEL ZERO
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Construct your personal system avatar and initiate your leveling journey.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          {/* Avatar Preview & Selection */}
          <div className="p-4 rounded-2xl bg-[#0b0a17] border border-cyan-500/30 text-center">
            <div className="text-xs font-bold uppercase tracking-wider font-['Orbitron'] text-slate-400 mb-3">
              SELECT AVATAR FORM
            </div>

            <div className="flex justify-center mb-3">
              <AnimeAvatar style={selectedAvatar} size="lg" animated />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {avatars.map((av) => (
                <button
                  key={av.key}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedAvatar(av.key);
                  }}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedAvatar === av.key
                      ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <AnimeAvatar style={av.key} size="sm" animated={false} />
                  <span className="text-[9px] font-bold truncate max-w-full text-slate-300">
                    {av.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hunter Codename */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider font-['Orbitron'] text-slate-300 mb-1.5">
              HUNTER CODENAME
            </label>
            <input
              type="text"
              placeholder="e.g. ShadowHunter, Monarch, Kaiser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm font-['Rajdhani'] font-bold tracking-wider"
            />
          </div>

          {/* Path Class Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider font-['Orbitron'] text-slate-300 mb-2">
              CHOOSE STARTING PATH
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {paths.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedPath(p.key);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPath === p.key
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/50'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {p.icon}
                    <span className="text-xs font-bold font-['Orbitron'] text-slate-100">
                      {p.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Attribute Allocation Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold font-['Orbitron'] text-slate-400 uppercase mb-2">
              INITIAL ATTRIBUTE MATRIX
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">STR</div>
                <div className="font-bold text-slate-200 font-mono">{previewStats.strength}</div>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">INT</div>
                <div className="font-bold text-slate-200 font-mono">{previewStats.intelligence}</div>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">AGI</div>
                <div className="font-bold text-slate-200 font-mono">{previewStats.agility}</div>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">VIT</div>
                <div className="font-bold text-slate-200 font-mono">{previewStats.vitality}</div>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">FOCUS</div>
                <div className="font-bold text-cyan-400 font-mono">{previewStats.focus}</div>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">DISC</div>
                <div className="font-bold text-purple-400 font-mono">{previewStats.discipline}</div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold font-['Orbitron'] tracking-wider uppercase text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition"
          >
            <span>INITIALIZE AWAKENING</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
