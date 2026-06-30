import React from 'react';
import { ARGENTINA_PROVINCE_PATHS, ARGENTINA_VIEWBOX } from './argentinaMapData';

interface ArgentinaMapProps {
  getFill: (provinceName: string) => string;
  onProvinceHover: (provinceName: string | null) => void;
  onProvinceClick: (provinceName: string) => void;
  hoveredProvince: string | null;
  selectedProvince: string | null;
}

export const ArgentinaMap: React.FC<ArgentinaMapProps> = ({ getFill, onProvinceHover, onProvinceClick, hoveredProvince, selectedProvince }) => {
  return (
    <svg viewBox={ARGENTINA_VIEWBOX} className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="var(--accent-primary)" floodOpacity="0.35" />
        </filter>
      </defs>
      <g>
        {ARGENTINA_PROVINCE_PATHS.map((p) => {
          const isHovered = hoveredProvince === p.name;
          const isSelected = selectedProvince === p.name;
          return (
            <path
              key={p.id}
              d={p.d}
              fill={getFill(p.name)}
              stroke={isSelected ? 'var(--accent-primary)' : 'var(--bg-primary)'}
              strokeWidth={isSelected ? 14 : 6}
              strokeLinejoin="round"
              filter={isSelected ? 'url(#map-glow)' : undefined}
              onMouseEnter={() => onProvinceHover(p.name)}
              onMouseLeave={() => onProvinceHover(null)}
              onClick={() => onProvinceClick(p.name)}
              style={{
                cursor: 'pointer',
                opacity: isHovered || isSelected ? 1 : 0.92,
                transition: 'opacity 150ms ease, stroke-width 150ms ease',
              }}
            >
              <title>{p.name}</title>
            </path>
          );
        })}
      </g>
    </svg>
  );
};
