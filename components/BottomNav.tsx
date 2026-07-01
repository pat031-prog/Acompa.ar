import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Tab } from '../types';
import { Home, MessageCircle, BookOpen, FlaskConical, MapPin, Globe, BookMarked, Bell, BarChart3 } from 'lucide-react';
import { SPRING } from './motion';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

const ITEMS: { id: Tab; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { id: 'home', Icon: Home, label: 'Inicio' },
  { id: 'library', Icon: BookOpen, label: 'Biblioteca' },
  { id: 'testing', Icon: FlaskConical, label: 'Testeo' },
  { id: 'resources', Icon: MapPin, label: 'Recursos' },
  { id: 'observatory', Icon: Globe, label: 'Observatorio' },
  { id: 'literature', Icon: BookMarked, label: 'Lecturas' },
  { id: 'reminders', Icon: Bell, label: 'Cuidado' },
  { id: 'dashboard', Icon: BarChart3, label: 'Stats' },
  { id: 'chat', Icon: MessageCircle, label: 'Asistente' },
];

export const BottomNav: React.FC<Props> = ({ active, onChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Keep the active tab in view on narrow screens (nav scrolls horizontally).
  useEffect(() => {
    const el = btnRefs.current[active];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <div
      className="fixed left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{ bottom: 0, padding: '12px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div
        ref={scrollRef}
        className="pointer-events-auto flex items-center gap-0 sm:gap-1 rounded-[var(--radius-pill)] overflow-x-auto no-scrollbar p-1.5 sm:p-2"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-nav)', maxWidth: 'calc(100vw - 16px)' }}
      >
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          const { Icon } = item;
          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              ref={(el) => { btnRefs.current[item.id] = el; }}
              onClick={() => onChange(item.id)}
              aria-pressed={isActive}
              aria-label={item.label}
              title={item.label}
              className="relative flex items-center justify-center gap-2 flex-shrink-0 rounded-[var(--radius-pill)] transition-colors p-2.5 sm:p-3"
              style={{
                color: isActive ? 'var(--accent-ink)' : 'var(--text-tertiary)',
                zIndex: 1,
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-[var(--radius-pill)]"
                  style={{ background: 'var(--accent-primary)', boxShadow: 'var(--shadow-active-glow)', zIndex: -1 }}
                  transition={SPRING}
                />
              )}
              <Icon size={19} />
              {isActive && (
                <span className="hidden sm:inline whitespace-nowrap pr-1" style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
