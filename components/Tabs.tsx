
import React from 'react';
import type { Tab } from '../types';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const getButtonClasses = (tabName: Tab) => {
    return `relative px-4 sm:px-5 py-3 sm:py-3.5 cursor-pointer text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 rounded-lg transition-all duration-300
      ${activeTab === tabName
        ? 'text-white bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
      }`;
  };

  return (
    <nav className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto overflow-y-hidden scrollbar-hide relative z-10 pb-2"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
      <button 
        id="tab-chat" 
        className={getButtonClasses('chat')}
        onClick={() => setActiveTab('chat')}
        aria-pressed={activeTab === 'chat'}
      >
        Chat
      </button>
      <button
        id="tab-library"
        className={getButtonClasses('library')}
        onClick={() => setActiveTab('library')}
        aria-pressed={activeTab === 'library'}
      >
        Biblioteca
      </button>
      <button
        id="tab-testing"
        className={getButtonClasses('testing')}
        onClick={() => setActiveTab('testing')}
        aria-pressed={activeTab === 'testing'}
      >
        Testeo
      </button>
      <button
        id="tab-resources"
        className={getButtonClasses('resources')}
        onClick={() => setActiveTab('resources')}
        aria-pressed={activeTab === 'resources'}
      >
        Recursos
      </button>
      <button
        id="tab-observatory"
        className={getButtonClasses('observatory')}
        onClick={() => setActiveTab('observatory')}
        aria-pressed={activeTab === 'observatory'}
      >
        <span className="hidden sm:inline">Observatorio</span>
        <span className="sm:hidden">Observ.</span>
      </button>
      <button
        id="tab-reminders"
        className={getButtonClasses('reminders')}
        onClick={() => setActiveTab('reminders')}
        aria-pressed={activeTab === 'reminders'}
      >
        <span className="hidden sm:inline">Recordatorios</span>
        <span className="sm:hidden">Record.</span>
      </button>
      <button
        id="tab-dashboard"
        className={getButtonClasses('dashboard')}
        onClick={() => setActiveTab('dashboard')}
        aria-pressed={activeTab === 'dashboard'}
      >
        <span className="hidden sm:inline">Estadísticas</span>
        <span className="sm:hidden">Stats</span>
      </button>
    </nav>
  );
};