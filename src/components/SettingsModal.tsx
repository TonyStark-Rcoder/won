import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Bell,
  Smartphone,
  RotateCcw,
  Sparkles,
  Sliders,
  Camera,
} from 'lucide-react';
import { AnimationQuality, AppSettings } from '../types';
import { sound } from '../services/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetData: () => void;
  onOpenApkGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
  onOpenApkGuide,
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof AppSettings) => {
    sound.playClick();
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
    sound.updateSettings(
      updated.soundEnabled,
      updated.musicEnabled,
      updated.sfxEnabled,
      updated.volume
    );
  };

  const handleVolume = (val: number) => {
    const updated = { ...settings, volume: val };
    onUpdateSettings(updated);
    sound.updateSettings(
      updated.soundEnabled,
      updated.musicEnabled,
      updated.sfxEnabled,
      val
    );
  };

  const handleQuality = (quality: AnimationQuality) => {
    sound.playClick();
    onUpdateSettings({ ...settings, animationQuality: quality });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#090815] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-['Orbitron'] text-slate-100 tracking-wider">
              SYSTEM CONFIGURATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Audio Section */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-['Orbitron'] text-slate-400 uppercase tracking-wider">
              Audio & Haptics Engine
            </div>

            {/* Master Sound */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-200">Master Sound</div>
                  <div className="text-[11px] text-slate-500">Enable or mute all game audio</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('soundEnabled')}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Dark Synth / Phonk Background Pulse */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Phonk / Synth Wave Loop</div>
                  <div className="text-[11px] text-slate-500">Procedural 808 dark electronic pulse</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('musicEnabled')}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">System Sound Effects</div>
                  <div className="text-[11px] text-slate-500">XP ticks, quest fanfare & haptics</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('sfxEnabled')}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  settings.sfxEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.sfxEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Output Volume</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={(e) => handleVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Quest Photo Verification Protocol */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold font-['Orbitron'] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quest Evidence Protocol</span>
              <span className="text-[10px] text-emerald-400 font-mono">+{settings.photoBonusXp || 15} XP Bonus</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Require Visual Proof</div>
                  <div className="text-[11px] text-slate-500">
                    Prompt for camera/photo evidence when completing directives
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('requireProofOnCompletion')}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  settings.requireProofOnCompletion ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.requireProofOnCompletion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Performance & Animation */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold font-['Orbitron'] text-slate-400 uppercase tracking-wider">
              Graphic Quality (Low-End Android Optimization)
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: AnimationQuality.HIGH, label: 'High (60 FPS)' },
                { key: AnimationQuality.MEDIUM, label: 'Balanced' },
                { key: AnimationQuality.LOW, label: 'Battery Saver' },
              ].map((q) => (
                <button
                  key={q.key}
                  onClick={() => handleQuality(q.key)}
                  className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition ${
                    settings.animationQuality === q.key
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Android APK Section */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenApkGuide();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-500/40 flex items-center justify-between text-xs hover:border-blue-400 transition"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200 font-['Orbitron']">
                    Android APK & Install
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Build native APK or add WebAPK to Home Screen
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-cyan-400 font-bold uppercase font-['Orbitron']">
                View Guide →
              </span>
            </button>
          </div>

          {/* Danger Zone: Reset Data */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                if (confirm('Warning: This will wipe all hunter progress, quests, and levels. Continue?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-rose-900/60 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Hunter Awakening Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
