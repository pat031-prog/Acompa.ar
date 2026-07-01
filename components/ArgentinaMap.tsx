import React from 'react';
import { ARGENTINA_PROVINCE_PATHS, ARGENTINA_VIEWBOX } from './argentinaMapData';

interface ArgentinaMapProps {
  getFill: (provinceName: string) => string;
  onProvinceHover: (provinceName: string | null) => void;
  onProvinceClick: (provinceName: string) => void;
  hoveredProvince: string | null;
  selectedProvince: string | null;
  /** Provinces to label directly on the map (top values), name → short text. */
  labels?: { name: string; text: string }[];
}

const CENTROID: Record<string, { cx: number; cy: number }> = Object.fromEntries(
  ARGENTINA_PROVINCE_PATHS.map((p) => [p.name, { cx: p.cx, cy: p.cy }])
);

export const ArgentinaMap: React.FC<ArgentinaMapProps> = ({ getFill, onProvinceHover, onProvinceClick, hoveredProvince, selectedProvince, labels = [] }) => {
  return (
    <svg viewBox={ARGENTINA_VIEWBOX} className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="map-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="0" stdDeviation="26" floodColor="var(--accent-primary)" floodOpacity="0.55" />
        </filter>
      </defs>
      <g>
        {ARGENTINA_PROVINCE_PATHS.map((p) => {
          const isHovered = hoveredProvince === p.name;
          const isSelected = selectedProvince === p.name;
          const isActive = isHovered || isSelected;
          return (
            <path
              key={p.id}
              d={p.d}
              fill={getFill(p.name)}
              stroke={isSelected ? 'var(--accent-hover)' : isHovered ? 'rgba(247,240,232,0.85)' : 'var(--bg-primary)'}
              strokeWidth={isSelected ? 24 : isHovered ? 16 : 9}
              strokeLinejoin="round"
              filter={isSelected ? 'url(#map-glow)' : undefined}
              onMouseEnter={() => onProvinceHover(p.name)}
              onMouseLeave={() => onProvinceHover(null)}
              onClick={() => onProvinceClick(p.name)}
              style={{
                cursor: 'pointer',
                opacity: !hoveredProvince && !selectedProvince ? 1 : isActive ? 1 : 0.55,
                transition: 'opacity 160ms ease, stroke-width 160ms ease',
              }}
            >
              <title>{p.name}</title>
            </path>
          );
        })}
      </g>

      {/* On-map value labels for the top provinces — turns the silhouette into an infographic */}
      <g style={{ pointerEvents: 'none' }}>
        {labels.map(({ name, text }) => {
          const c = CENTROID[name];
          if (!c) return null;
          const dim = (hoveredProvince || selectedProvince) && hoveredProvince !== name && selectedProvince !== name;
          return (
            <text
              key={name}
              x={c.cx}
              y={c.cy}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '260px',
                fill: 'rgba(247,240,232,0.96)',
                paintOrder: 'stroke',
                stroke: 'var(--bg-primary)',
                strokeWidth: '90px',
                strokeLinejoin: 'round',
                letterSpacing: '-6px',
                opacity: dim ? 0.25 : 1,
                transition: 'opacity 160ms ease',
              }}
            >
              {text}
            </text>
          );
        })}
      </g>
    </svg>
  );
};
