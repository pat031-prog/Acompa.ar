
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-3.5">
        {/* Logo Mark — two figures together (accompaniment) */}
        <div
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(150deg, var(--accent-hover), var(--accent-primary))',
            borderRadius: '11px',
            boxShadow: 'var(--shadow-glow-accent), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.55">
              <circle cx="8.6" cy="8" r="2.4" />
              <path d="M3.9 18.6c0-2.7 2.1-4.7 4.7-4.7s4.7 2 4.7 4.7a.6.6 0 0 1-.6.6H4.5a.6.6 0 0 1-.6-.6Z" />
            </g>
            <g>
              <circle cx="15.2" cy="9" r="2.7" />
              <path d="M9.6 19.4c0-3 2.5-5.3 5.6-5.3s5.6 2.3 5.6 5.3a.7.7 0 0 1-.7.7H10.3a.7.7 0 0 1-.7-.7Z" />
            </g>
          </svg>
        </div>

        {/* Brand Name */}
        <div className="min-w-0">
          <h1
            className="text-base font-bold leading-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-editorial)' }}
          >
            Acompañ<span style={{ color: 'var(--accent-primary)' }}>.</span>Ar
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, fontSize: '9px' }}
          >
            Reducción de daños
          </p>
        </div>
      </div>
    </header>
  );
};
