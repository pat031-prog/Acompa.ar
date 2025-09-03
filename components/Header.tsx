
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-4 opacity-90">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
        ACompañ.Ar
        <span className="text-xs sm:text-sm font-normal text-gray-400 ml-2">· Chatbot & Observatorio de Consumos</span>
      </h1>
    </header>
  );
};
