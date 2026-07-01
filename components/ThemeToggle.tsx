import React from 'react';
import { motion } from 'motion/react';
import type { ThemeName } from './theme';
import { SPRING } from './motion';
import { Waves, Palette } from 'lucide-react';

interface Props {
  theme: ThemeName;
  onChange: (t: ThemeName) => void;
}

const OPTIONS: { id: ThemeName; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'safetrip', label: 'SafeTrip', Icon: Waves },
  { id: 'vivid', label: 'Vívido', Icon: Palette },
];

/** Small fixed top-right toggle to switch the whole app's visual theme.
 *  Reuses the same tokens it's switching, so it re-skins itself too. */
export const ThemeToggle: React.FC<Props> = ({ theme, onChange }) => (
  <div
    className="fixed z-[60] flex items-center gap-0.5 rounded-[var(--radius-pill)] p-1"
    style={{
      top: 'max(10px, env(safe-area-inset-top))',
      right: 'max(10px, env(safe-area-inset-right))',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-nav)',
    }}
  >
    {OPTIONS.map((opt) => {
      const isActive = theme === opt.id;
      const { Icon } = opt;
      return (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          aria-pressed={isActive}
          aria-label={`Tema ${opt.label}`}
          title={`Tema ${opt.label}`}
          className="relative flex items-center justify-center rounded-[var(--radius-pill)] transition-colors p-2"
          style={{ color: isActive ? 'var(--accent-ink)' : 'var(--text-tertiary)', zIndex: 1 }}
          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          {isActive && (
            <motion.span
              layoutId="theme-toggle-active"
              className="absolute inset-0 rounded-[var(--radius-pill)]"
              style={{ background: 'var(--accent-primary)', zIndex: -1 }}
              transition={SPRING}
            />
          )}
          <Icon size={15} />
        </button>
      );
    })}
  </div>
);
