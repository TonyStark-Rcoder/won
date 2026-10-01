import React from 'react';
import { AvatarStyle, PlayerRank } from '../types';
import { RANK_THEMES } from '../services/levelSystem';

interface AnimeAvatarProps {
  style: AvatarStyle;
  rank?: PlayerRank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  showBadge?: boolean;
}

export const AnimeAvatar: React.FC<AnimeAvatarProps> = ({
  style,
  rank = PlayerRank.E,
  size = 'md',
  animated = true,
  className = '',
  showBadge = false,
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  const currentRankTheme = RANK_THEMES[rank] || RANK_THEMES[PlayerRank.E];

  // Render original vector anime character designs
  const renderAvatarGraphics = () => {
    switch (style) {
      case AvatarStyle.SHADOW_WARRIOR:
        return (
          <g>
            {/* Dark Hood & Scarf */}
            <path d="M 20 85 Q 50 65 80 85 L 85 100 L 15 100 Z" fill="#0c0a1a" />
            <path d="M 25 35 Q 50 12 75 35 Q 85 65 75 80 Q 50 90 25 80 Q 15 65 25 35 Z" fill="#140f2b" />
            {/* Shadow Face Shroud */}
            <path d="M 32 40 Q 50 35 68 40 Q 72 65 50 75 Q 28 65 32 40 Z" fill="#07050d" />
            {/* Glowing Anime Visor Eyes */}
            <g className={animated ? 'animate-pulse' : ''}>
              <polygon points="36,49 46,47 44,52 35,53" fill="#00f2fe" filter="drop-shadow(0 0 4px #00f2fe)" />
              <polygon points="64,49 54,47 56,52 65,53" fill="#00f2fe" filter="drop-shadow(0 0 4px #00f2fe)" />
            </g>
            {/* Midnight Ninja Scarf tails */}
            <path d="M 40 75 Q 20 85 10 98 Q 25 90 45 80 Z" fill="#7b2cbf" opacity="0.9" />
            <path d="M 45 78 Q 65 88 85 96 Q 70 88 50 82 Z" fill="#9d4edd" opacity="0.8" />
            {/* Forehead Shadow Sigil */}
            <polygon points="50,26 53,32 50,38 47,32" fill="#00f2fe" opacity="0.8" />
          </g>
        );

      case AvatarStyle.CYBER_MAGE:
        return (
          <g>
            {/* Robe Collar */}
            <path d="M 20 88 Q 50 72 80 88 L 88 100 L 12 100 Z" fill="#0e172a" />
            {/* Flowing Cyber Hair */}
            <path d="M 22 45 Q 20 18 50 16 Q 80 18 78 45 Q 85 65 80 80 Q 75 40 68 35 Q 50 30 32 35 Q 25 42 20 80 Z" fill="#312e81" />
            {/* Face */}
            <path d="M 33 38 Q 50 34 67 38 Q 69 64 50 74 Q 31 64 33 38 Z" fill="#1e1b4b" />
            {/* Cyber Arcane Spectacles */}
            <g className={animated ? 'animate-pulse' : ''}>
              <circle cx="42" cy="50" r="6" fill="none" stroke="#00f2fe" strokeWidth="1.5" filter="drop-shadow(0 0 4px #00f2fe)" />
              <circle cx="58" cy="50" r="6" fill="none" stroke="#00f2fe" strokeWidth="1.5" filter="drop-shadow(0 0 4px #00f2fe)" />
              <line x1="48" y1="50" x2="52" y2="50" stroke="#00f2fe" strokeWidth="1.5" />
              <circle cx="42" cy="50" r="2" fill="#ffffff" />
              <circle cx="58" cy="50" r="2" fill="#ffffff" />
            </g>
            {/* Floating Mystic Rune Circlet */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="6 8" opacity="0.7" />
          </g>
        );

      case AvatarStyle.DARK_KNIGHT:
        return (
          <g>
            {/* Heavy Pauldrons */}
            <path d="M 12 85 L 30 72 L 50 76 L 70 72 L 88 85 L 95 100 L 5 100 Z" fill="#111827" />
            <path d="M 22 75 L 34 68 L 44 74 Z" fill="#374151" />
            <path d="M 78 75 L 66 68 L 56 74 Z" fill="#374151" />
            {/* Heavy Combat Greathelm */}
            <polygon points="50,15 76,32 74,68 50,82 26,68 24,32" fill="#0f172a" stroke="#4b5563" strokeWidth="1.5" />
            {/* Visor T-Slit */}
            <path d="M 32 48 L 68 48 L 65 54 L 54 54 L 54 70 L 46 70 L 46 54 L 35 54 Z" fill="#030712" />
            {/* Piercing Crimson/Purple Glow inside Visor */}
            <g className={animated ? 'animate-pulse' : ''}>
              <line x1="38" y1="51" x2="48" y2="51" stroke="#f43f5e" strokeWidth="2" filter="drop-shadow(0 0 4px #f43f5e)" />
              <line x1="52" y1="51" x2="62" y2="51" stroke="#f43f5e" strokeWidth="2" filter="drop-shadow(0 0 4px #f43f5e)" />
            </g>
            {/* Helm Crest Crown */}
            <polygon points="50,8 55,20 45,20" fill="#9333ea" />
          </g>
        );

      case AvatarStyle.MYSTIC_HUNTER:
        return (
          <g>
            {/* Layered Cloak */}
            <path d="M 18 85 Q 50 70 82 85 L 90 100 L 10 100 Z" fill="#064e3b" />
            {/* Sharp Anime Spiky Hair with Hunter Band */}
            <path d="M 25 45 Q 20 20 45 15 Q 60 12 75 25 Q 85 45 75 75 Q 50 85 25 75 Z" fill="#1e293b" />
            {/* Face */}
            <path d="M 33 40 Q 50 36 67 40 Q 68 62 50 72 Q 32 62 33 40 Z" fill="#0f172a" />
            {/* Piercing Hunter Eyes */}
            <g className={animated ? 'animate-pulse' : ''}>
              <ellipse cx="42" cy="50" rx="4" ry="2" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)" />
              <ellipse cx="58" cy="50" rx="4" ry="2" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)" />
            </g>
            {/* Hunter Eye Scar / Runic Tattoo */}
            <line x1="58" y1="44" x2="58" y2="57" stroke="#34d399" strokeWidth="1" opacity="0.8" />
            {/* Forest Hunter Circlet */}
            <path d="M 28 38 Q 50 34 72 38" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="50" cy="36" r="2.5" fill="#34d399" filter="drop-shadow(0 0 3px #34d399)" />
          </g>
        );

      case AvatarStyle.FUTURISTIC_WARRIOR:
      default:
        return (
          <g>
            {/* Cyber Exosuit Collar */}
            <path d="M 15 88 L 35 72 L 65 72 L 85 88 L 92 100 L 8 100 Z" fill="#090d16" stroke="#00f2fe" strokeWidth="1" />
            {/* Angular Cybernetic Hair / Headpiece */}
            <path d="M 24 45 L 30 18 L 50 14 L 70 18 L 76 45 L 82 70 L 68 76 L 50 82 L 32 76 L 18 70 Z" fill="#1e1b4b" />
            {/* Face */}
            <path d="M 34 38 Q 50 35 66 38 Q 67 62 50 72 Q 33 62 34 38 Z" fill="#0f172a" />
            {/* Dual Cyber Optic Eyes */}
            <g className={animated ? 'animate-pulse' : ''}>
              <polygon points="38,48 46,47 45,52 37,53" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <polygon points="62,48 54,47 55,52 63,53" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
            </g>
            {/* Cyber Headset / Audio Interface Ear-nodes */}
            <rect x="22" y="44" width="6" height="14" rx="2" fill="#00f2fe" filter="drop-shadow(0 0 3px #00f2fe)" />
            <rect x="72" y="44" width="6" height="14" rx="2" fill="#00f2fe" filter="drop-shadow(0 0 3px #00f2fe)" />
            {/* Forehead HUD Reticle */}
            <circle cx="50" cy="28" r="3" fill="none" stroke="#00f2fe" strokeWidth="1" />
          </g>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Glow Halo according to Hunter Rank */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-60 blur-md transition-all duration-500`}
        style={{ backgroundColor: currentRankTheme.auraColor }}
      />

      {/* Frame Container */}
      <div
        className={`relative ${sizeMap[size]} rounded-2xl p-1 bg-[#090814] border-2 transition-all duration-300 overflow-hidden ${
          animated ? 'animate-hud-pulse' : ''
        }`}
        style={{ borderColor: currentRankTheme.auraColor }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="avatarBg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#1e1b4b" />
              <stop offset="70%" stop-color="#090814" />
              <stop offset="100%" stop-color="#040308" />
            </radialGradient>
          </defs>

          {/* Background Aura */}
          <rect width="100" height="100" fill="url(#avatarBg)" />

          {/* Hexagonal Background Grid lines */}
          <circle cx="50" cy="50" r="42" fill="none" stroke={currentRankTheme.auraColor} strokeWidth="0.5" opacity="0.3" strokeDasharray="4 6" />

          {/* Render Vector Character */}
          {renderAvatarGraphics()}
        </svg>

        {/* Ambient floating energy spark */}
        {animated && (
          <div
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: currentRankTheme.auraColor }}
          />
        )}
      </div>

      {/* Rank Badge Indicator */}
      {showBadge && (
        <div
          className={`absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold border font-['Orbitron'] ${currentRankTheme.badgeBg} ${currentRankTheme.badgeBorder} ${currentRankTheme.textColor} shadow-lg`}
        >
          {rank}
        </div>
      )}
    </div>
  );
};
