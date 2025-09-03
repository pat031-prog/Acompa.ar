
import React from 'react';
import type { Tab } from '../types';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const getButtonClasses = (tabName: Tab) => {
    return `bg-none border-none px-4 py-2.5 cursor-pointer text-sm font-medium border-b-2 transition-colors duration-200
      ${activeTab === tabName 
        ? 'text-gray-100 border-blue-500' 
        : 'text-gray-400 border-transparent hover:text-gray-200'
      }`;
  };

  return (
    <nav className="flex gap-2 border-b border-gray-800 mb-4">
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
        id="tab-observatory" 
        className={getButtonClasses('observatory')}
        onClick={() => setActiveTab('observatory')}
        aria-pressed={activeTab === 'observatory'}
      >
        Observatorio
      </button>
    </nav>
  );
};