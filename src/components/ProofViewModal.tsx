import React from 'react';
import { X, Camera, CheckCircle2, Shield, Calendar, Sparkles, FileText, Zap } from 'lucide-react';
import { Quest } from '../types';

interface ProofViewModalProps {
  isOpen: boolean;
  quest: Quest | null;
  onClose: () => void;
}

export const ProofViewModal: React.FC<ProofViewModalProps> = ({
  isOpen,
  quest,
  onClose,
}) => {
  if (!isOpen || !quest || !quest.proofImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#080713] border-2 border-cyan-500/50 p-5 shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-['Orbitron'] text-slate-100 tracking-wider">
                MISSION ARCHIVE: PHOTO EVIDENCE
              </h2>
              <p className="text-[10px] font-mono text-emerald-400">
                VERIFIED NEURAL TELEMETRY
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3.5 py-3 pr-1">
          {/* Target Quest Info */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold font-['Orbitron'] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {quest.difficulty} DIRECTIVE
              </span>
              <div className="flex items-center gap-1 text-xs font-bold font-['Orbitron'] text-emerald-400">
                <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
                <span>+{quest.xpReward} XP Earned</span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-1">{quest.title}</h3>
          </div>

          {/* Photo Evidence Container with Cyber Frame */}
          <div className="relative rounded-2xl bg-black border-2 border-emerald-500/60 overflow-hidden aspect-[4/3] shadow-lg shadow-emerald-950/40">
            <img
              src={quest.proofImage}
              alt="Mission Verification Proof"
              className="w-full h-full object-cover"
            />

            {/* Top Verification Stamp */}
            <div className="absolute top-3 left-3 bg-black/75 border border-emerald-400 px-3 py-1 rounded-xl text-emerald-300 text-xs font-bold font-['Orbitron'] flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AUTHENTICATED EVIDENCE</span>
            </div>

            {/* Date watermark */}
            {quest.completedAt && (
              <div className="absolute bottom-3 right-3 bg-black/70 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{new Date(quest.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* AI Scan Feedback if present */}
          {quest.proofAiScan && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/40 text-xs space-y-1">
              <div className="flex items-center justify-between font-['Orbitron'] font-bold text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SYSTEM EVALUATION SCORE: {quest.proofAiScan.score}%</span>
                </div>
                {quest.proofAiScan.attributeBonus && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-400/50 text-emerald-200">
                    {quest.proofAiScan.attributeBonus}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                {quest.proofAiScan.feedback}
              </p>
            </div>
          )}

          {/* Hunter Note if written */}
          {quest.proofNote && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <div className="text-[10px] font-bold font-['Orbitron'] text-slate-400 flex items-center gap-1 uppercase">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Hunter Log Note</span>
              </div>
              <p className="text-xs text-slate-200 italic font-mono">
                "{quest.proofNote}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-['Orbitron'] text-xs uppercase tracking-wider transition"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
