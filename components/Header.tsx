
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="px-4 py-6 border-b border-gray-800/50">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>A</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ACompañ.Ar
          </h1>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            Reducción de Daños
          </p>
        </div>
      </div>
    </header>
  );
};
