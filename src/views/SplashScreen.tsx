import React, { useEffect, useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { NexusLogo } from '../components/NexusLogo';
import { sound } from '../services/soundEngine';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING NEURAL INTERFACE...');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('SYSTEM SYNCHRONIZATION COMPLETE');
          setReady(true);
          return 100;
        }

        if (prev === 30) setStatusText('ESTABLISHING SECURE PROTOCOLS...');
        if (prev === 65) setStatusText('AWAKENING HUNTER LEVEL ZERO MATRIX...');
        if (prev === 85) setStatusText('CALCULATING SYSTEM ATTRIBUTES...');

        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    sound.playLevelUp();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-8 bg-[#040308] text-slate-100 select-none overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Tagline */}
      <div className="pt-6 flex items-center gap-2 text-slate-500 text-xs tracking-[0.25em] font-['Orbitron'] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>AUTHENTICATED INTERFACE</span>
      </div>

      {/* Center Cinematic Emblem */}
      <div className="flex flex-col items-center text-center my-auto">
        <NexusLogo size="xl" animated glow className="mb-8" />

        <div className="relative">
          <h1 className="text-3xl sm:text-5xl font-black font-['Orbitron'] tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-slate-100 to-purple-300 drop-shadow-[0_0_20px_rgba(0,242,254,0.4)]">
            NEXUS
          </h1>
          <div className="text-sm sm:text-base font-bold font-['Orbitron'] tracking-[0.4em] text-cyan-400 mt-1">
            LEVEL ZERO
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase font-['Rajdhani']">
          RISE. COMPLETE. EVOLVE.
        </p>
      </div>

      {/* Bottom Loading / Action Area */}
      <div className="w-full max-w-sm pb-6 flex flex-col items-center">
        {!ready ? (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span className="truncate">{statusText}</span>
              <span className="font-bold text-cyan-400">{progress}%</span>
            </div>

            {/* Glowing Progress Bar */}
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-100 shadow-[0_0_12px_#00f2fe]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleEnter}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold font-['Orbitron'] tracking-widest uppercase text-sm shadow-xl shadow-cyan-500/40 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>AWAKEN THE SYSTEM</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div className="mt-4 text-[10px] text-slate-600 font-mono tracking-wider">
          OFFLINE-FIRST RPG PRODUCTIVITY ENGINE • v1.0.0
        </div>
      </div>
    </div>
  );
};
