import React from 'react';

interface NexusLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  glow?: boolean;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  size = 'md',
  animated = true,
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    xs: 28,
    sm: 40,
    md: 64,
    lg: 96,
    xl: 140,
  };

  const dim = sizeMap[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: dim, height: dim }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="logoPlasma" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f2fe" />
            <stop offset="50%" stop-color="#7b2cbf" />
            <stop offset="100%" stop-color="#9d4edd" />
          </linearGradient>

          <linearGradient id="logoCore" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="50%" stop-color="#4361ee" />
            <stop offset="100%" stop-color="#b5179e" />
          </linearGradient>

          <filter id="logoGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Halo Glow */}
        {glow && (
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="#00f2fe"
            opacity="0.12"
            filter="url(#logoGlowFilter)"
          />
        )}

        {/* Outer Orbit Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#4a287a"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.6"
          className={animated ? 'animate-[spin_20s_linear_infinite]' : ''}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Segmented Tech Ring */}
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="1.5"
          strokeDasharray="18 10 4 10"
          opacity="0.85"
          className={animated ? 'animate-[spin_12s_linear_infinite_reverse]' : ''}
          style={{ transformOrigin: '50px 50px' }}
          filter={glow ? 'url(#logoGlowFilter)' : undefined}
        />

        {/* Orbital Node Sparks */}
        <circle cx="50" cy="9" r="1.8" fill="#00f2fe" filter="url(#logoGlowFilter)" />
        <circle cx="91" cy="50" r="1.8" fill="#9d4edd" filter="url(#logoGlowFilter)" />
        <circle cx="50" cy="91" r="1.8" fill="#00f2fe" filter="url(#logoGlowFilter)" />
        <circle cx="9" cy="50" r="1.8" fill="#9d4edd" filter="url(#logoGlowFilter)" />

        {/* Core Hexagonal Armor Plate */}
        <polygon
          points="50,22 74,36 74,64 50,78 26,64 26,36"
          fill="#090814"
          fillOpacity="0.9"
          stroke="url(#logoPlasma)"
          strokeWidth="2"
          filter={glow ? 'url(#logoGlowFilter)' : undefined}
        />

        {/* Inner Diamond Geometry */}
        <polygon
          points="50,27 70,50 50,73 30,50"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.4"
        />

        {/* Central Stylized "N" Glyph */}
        <g filter={glow ? 'url(#logoGlowFilter)' : undefined}>
          {/* Left Stela */}
          <path d="M 36 34 L 41 34 L 41 66 L 36 66 Z" fill="url(#logoCore)" />
          {/* Diagonal Energy Blade */}
          <polygon points="39,34 44,34 59,66 54,66" fill="url(#logoPlasma)" />
          {/* Right Stela */}
          <path d="M 57 34 L 62 34 L 62 66 L 57 66 Z" fill="url(#logoCore)" />

          {/* Core Central Spark */}
          <circle cx="49" cy="50" r="1.6" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
