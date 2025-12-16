
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ConsentModal } from './components/ConsentModal';
import { getChatbotResponse } from './services/geminiService';
import { Tabs } from './components/Tabs';
import { Library } from './components/Library';
import { TestingGuide } from './components/TestingGuide';
import { ResourcesDirectory } from './components/ResourcesDirectory';
import { Observatory } from './components/Map';
import { CareReminders } from './components/CareReminders';
import { Dashboard } from './components/Dashboard';
import type { Message, ConsentData, HistoryContent, Tab } from './types';
import { INITIAL_BOT_MESSAGE } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consent, setConsent] = useState<ConsentData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  useEffect(() => {
    if (consent && messages.length === 0) { // Only add initial message once
      setMessages([{
        id: 'initial-bot-message',
        text: INITIAL_BOT_MESSAGE,
        sender: 'bot',
        sources: [],
      }]);
    }
  }, [consent, messages.length]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!consent) {
        throw new Error("Consent not given.");
      }
      const history: HistoryContent[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const { text: botResponseText, sources: botResponseSources } = await getChatbotResponse(text, history, consent);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText || "No pude generar una respuesta en este momento.",
        sender: 'bot',
        sources: botResponseSources,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Lo siento, ocurrió un error y no puedo responder en este momento. Por favor, intenta de nuevo más tarde.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, consent, messages]);

  const handleConsent = (consentData: ConsentData) => {
    setConsent(consentData);
  };

  return (
    <div className="flex h-full w-full text-gray-200 overflow-hidden relative z-10">
      {!consent && <ConsentModal onConsent={handleConsent} />}

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-gray-800/50 bg-gray-900/20 backdrop-blur-sm flex-shrink-0">
        <Header />
        <div className="flex-1 overflow-y-auto px-3">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </aside>

      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-lg font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ACompañ.Ar
              </h1>
              <p className="text-xs font-medium text-gray-500">Reducción de Daños</p>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-3">
          <div className="flex gap-2">
            {['chat', 'library', 'testing', 'resources', 'observatory', 'reminders', 'dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500/20 text-white border border-blue-500/30'
                    : 'bg-gray-800/40 text-gray-400 border border-gray-700/30'
                }`}
              >
                {tab === 'chat' && 'Chat'}
                {tab === 'library' && 'Biblioteca'}
                {tab === 'testing' && 'Testeo'}
                {tab === 'resources' && 'Recursos'}
                {tab === 'observatory' && 'Observ.'}
                {tab === 'reminders' && 'Record.'}
                {tab === 'dashboard' && 'Stats'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:mt-0 mt-[140px]">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {activeTab === 'chat' && (
            <div className="flex flex-col flex-1 h-full overflow-hidden">
              <ChatWindow messages={messages} isLoading={isLoading} />
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={!consent} />
            </div>
          )}
          {activeTab === 'library' && <Library />}
          {activeTab === 'testing' && <TestingGuide />}
          {activeTab === 'resources' && <ResourcesDirectory />}
          {activeTab === 'observatory' && <Observatory />}
          {activeTab === 'reminders' && <CareReminders />}
          {activeTab === 'dashboard' && <Dashboard />}
        </div>
      </main>
    </div>
  );
};

export default App;
