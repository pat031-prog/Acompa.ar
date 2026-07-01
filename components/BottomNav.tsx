import React from 'react';
import type { Tab } from '../types';
import { Home, MessageCircle, BookOpen, FlaskConical, MapPin, Globe, BookMarked, Bell, BarChart3 } from 'lucide-react';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

const ITEMS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'home', icon: <Home size={19} />, label: 'Inicio' },
  { id: 'library', icon: <BookOpen size={19} />, label: 'Biblioteca' },
  { id: 'testing', icon: <FlaskConical size={19} />, label: 'Testeo' },
  { id: 'resources', icon: <MapPin size={19} />, label: 'Recursos' },
  { id: 'observatory', icon: <Globe size={19} />, label: 'Observatorio' },
  { id: 'literature', icon: <BookMarked size={19} />, label: 'Lecturas' },
  { id: 'reminders', icon: <Bell size={19} />, label: 'Cuidado' },
  { id: 'dashboard', icon: <BarChart3 size={19} />, label: 'Stats' },
  { id: 'chat', icon: <MessageCircle size={19} />, label: 'Asistente' },
];

export const BottomNav: React.FC<Props> = ({ active, onChange }) => (
  <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none" style={{ padding: '16px' }}>
    <div
      className="pointer-events-auto flex gap-1 p-2 rounded-full overflow-x-auto no-scrollbar"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', boxShadow: '0 14px 44px rgba(0,0,0,0.55)', maxWidth: 'calc(100vw - 24px)' }}
    >
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            title={item.label}
            className="flex items-center gap-2 flex-shrink-0 transition-all duration-300"
            style={{
              padding: isActive ? '11px 18px' : '11px 12px',
              borderRadius: '999px',
              background: isActive ? 'var(--accent-primary)' : 'transparent',
              color: isActive ? 'var(--accent-ink)' : 'var(--text-tertiary)',
              boxShadow: isActive ? '0 0 22px rgba(232,122,93,0.32)' : 'none',
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          >
            {item.icon}
            {isActive && (
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);
