
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 sm:py-8 relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-xl sm:text-2xl font-bold text-white">A</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            ACompañ.Ar
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-400 mt-0.5">
            Chatbot & Observatorio de Consumos
          </p>
        </div>
      </div>
    </header>
  );
};
