
import React from 'react';
import type { Tab } from '../types';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const getButtonClasses = (tabName: Tab) => {
    return `bg-none border-none px-3 sm:px-4 py-3 cursor-pointer text-xs sm:text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0
      ${activeTab === tabName
        ? 'text-gray-100 border-blue-500'
        : 'text-gray-400 border-transparent hover:text-gray-200 active:text-gray-100'
      }`;
  };

  return (
    <nav className="flex gap-1 sm:gap-2 border-b border-gray-800 mb-4 overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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