
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-3.5">
        {/* Logo Mark */}
        <div
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl"
          style={{
            background: 'var(--accent-primary)',
            boxShadow: 'var(--shadow-glow-accent)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield outline */}
            <path
              d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2Z"
              fill="rgba(255,255,255,0.15)"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Heart inside */}
            <path
              d="M12 17.5s-4.5-3-4.5-5.5a2.5 2.5 0 0 1 4.5-1.5 2.5 2.5 0 0 1 4.5 1.5c0 2.5-4.5 5.5-4.5 5.5Z"
              fill="white"
              opacity="0.95"
            />
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
