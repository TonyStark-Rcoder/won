import React from 'react';
import { PlayerStats } from '../types';

interface RadarChartProps {
  stats: PlayerStats;
  size?: number;
  className?: string;
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  stats,
  size = 240,
  className = '',
  color = '#00f2fe',
}) => {
  const statKeys: (keyof PlayerStats)[] = [
    'strength',
    'intelligence',
    'agility',
    'vitality',
    'focus',
    'discipline',
  ];

  const labels: Record<keyof PlayerStats, string> = {
    strength: 'STR',
    intelligence: 'INT',
    agility: 'AGI',
    vitality: 'VIT',
    focus: 'FOC',
    discipline: 'DIS',
  };

  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = statKeys.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Normalize stats against maximum expected stat cap for display (e.g., 30)
  const maxCap = Math.max(25, ...Object.values(stats) as number[]);

  // Calculate polygon points
  const points = statKeys.map((key, i) => {
    const value = stats[key] || 0;
    const normalized = Math.min(1, Math.max(0.15, value / maxCap));
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * normalized * Math.cos(angle);
    const y = center + radius * normalized * Math.sin(angle);
    return { x, y, value, key, angle };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Concentric background grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7b2cbf" stopOpacity="0.1" />
          </radialGradient>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric Hexagons */}
        {gridLevels.map((lvl, idx) => {
          const gridPoints = Array.from({ length: totalAxes })
            .map((_, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const x = center + radius * lvl * Math.cos(angle);
              const y = center + radius * lvl * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={idx}
              points={gridPoints}
              fill="none"
              stroke="#221e3f"
              strokeWidth={idx === gridLevels.length - 1 ? '1.5' : '1'}
              strokeDasharray={idx === 1 || idx === 3 ? undefined : '3 3'}
            />
          );
        })}

        {/* Radial Axis Spokes */}
        {Array.from({ length: totalAxes }).map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#2e2a52"
              strokeWidth="1"
            />
          );
        })}

        {/* Player Stats Data Polygon */}
        <polygon
          points={polygonPath}
          fill="url(#radarFill)"
          stroke={color}
          strokeWidth="2.5"
          filter="url(#radarGlow)"
        />

        {/* Vertices & Metric Badges */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill={color}
              stroke="#090814"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Outer Text Labels */}
        {points.map((p, i) => {
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(p.angle);
          const ly = center + labelDist * Math.sin(p.angle);

          return (
            <g key={`lbl-${i}`}>
              <text
                x={lx}
                y={ly - 4}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="700"
                fontFamily="Orbitron, sans-serif"
                className="select-none"
              >
                {labels[p.key]}
              </text>
              <text
                x={lx}
                y={ly + 8}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize="12"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
                className="select-none font-mono"
              >
                {p.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
