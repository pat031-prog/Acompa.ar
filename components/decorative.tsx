import React from 'react';

interface CircleProps {
  size?: number;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
  opacity?: number;
  color?: string;
}

/** Outlined ring — signature decorative mark used across section headers. */
export const GeoCircle: React.FC<CircleProps> = ({ size = 120, top, right, left, bottom, opacity = 0.06, color = 'var(--accent-primary)' }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color}`,
      opacity,
      top, right, left, bottom,
      pointerEvents: 'none',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      mixBlendMode: 'screen',
    }}
  />
);

/** Dotted halftone cluster — signature decorative mark used across section headers. */
export const HalftoneCircle: React.FC<CircleProps> = ({ size = 100, top, right, left, bottom, opacity = 0.1, color = 'var(--accent-primary)' }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      opacity,
      top, right, left, bottom,
      pointerEvents: 'none',
      background: `radial-gradient(circle at 30% 30%, ${color} 1px, transparent 1px),
                    radial-gradient(circle at 70% 30%, ${color} 1px, transparent 1px),
                    radial-gradient(circle at 30% 70%, ${color} 1px, transparent 1px),
                    radial-gradient(circle at 70% 70%, ${color} 1px, transparent 1px),
                    radial-gradient(circle at 50% 50%, ${color} 1px, transparent 1px)`,
      backgroundSize: '12px 12px',
    }}
  />
);

/** Section eyebrow — small uppercase kicker + rule, used to open every major section. */
export const SectionKicker: React.FC<{ label: string; color?: string }> = ({ label, color = 'var(--accent-primary)' }) => (
  <div className="flex items-center gap-3 mb-3">
    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color, borderBottom: `2px solid ${color}`, paddingBottom: '4px' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
  </div>
);
