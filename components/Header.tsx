
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="px-5 py-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-3.5">
        {/* Logo Mark — Shield + Heart */}
        <div
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
          style={{
            background: 'var(--accent-primary)',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(199, 112, 92, 0.3), 0 0 0 1px rgba(199, 112, 92, 0.1)',
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
            className="text-base font-semibold leading-tight tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Acompañ<span style={{ color: 'var(--accent-primary)' }}>.</span>Ar
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Reducción de daños
          </p>
        </div>
      </div>
    </header>
  );
};
