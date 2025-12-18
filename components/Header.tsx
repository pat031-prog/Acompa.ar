
import React from 'react';

const LogoIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle with warm accent */}
    <rect width="48" height="48" rx="14" fill="var(--accent)" />

    {/* Protective shield/embrace symbol */}
    <path
      d="M24 12C24 12 17 14 17 18V26C17 30 20 34 24 36C28 34 31 30 31 26V18C31 14 24 12 24 12Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Stylized "A" inside shield */}
    <path
      d="M24 20L27 28M21 28L24 20M21.5 26H26.5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="px-4 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <LogoIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            ACompañ.Ar
          </h1>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--faint)' }}>
            Reducción de Daños
          </p>
        </div>
      </div>
    </header>
  );
};
