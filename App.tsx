
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ConsentModal } from './components/ConsentModal';
import { getChatbotResponse } from './services/geminiService';
import { Tabs } from './components/Tabs';
import { Home } from './components/Home';
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
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

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
    <div className="flex h-full w-full overflow-hidden relative z-10" style={{ color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
      {!consent && <ConsentModal onConsent={handleConsent} />}

      {/* Sidebar - Collapsible */}
      <aside
        className="hidden lg:flex flex-col border-r flex-shrink-0 relative"
        style={{
          width: sidebarCollapsed ? '80px' : '280px',
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-paper-200)',
          transition: 'width 300ms var(--ease-standard)'
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-ambient)',
            color: 'var(--text-ink-600)',
            transition: 'all var(--t-fast) var(--ease-standard)',
            fontSize: '10px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-primary)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.style.color = 'var(--text-ink-600)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>

        <Header />
        <div className="flex-1 overflow-y-auto" style={{ padding: sidebarCollapsed ? '8px' : '12px' }}>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="14" fill="var(--accent)" />
              <path
                d="M24 12C24 12 17 14 17 18V26C17 30 20 34 24 36C28 34 31 30 31 26V18C31 14 24 12 24 12Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M24 20L27 28M21 28L24 20M21.5 26H26.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                ACompañ.Ar
              </h1>
              <p className="text-xs font-medium" style={{ color: 'var(--faint)' }}>Reducción de Daños</p>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-3">
          <div className="flex gap-2">
            {['home', 'chat', 'library', 'testing', 'resources', 'observatory', 'reminders', 'dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium whitespace-nowrap ${
                  activeTab === tab ? '' : ''
                }`}
                style={{
                  background: activeTab === tab ? 'var(--surface-3)' : 'var(--surface-2)',
                  color: activeTab === tab ? 'var(--text)' : 'var(--muted)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: activeTab === tab ? 'var(--border-strong)' : 'var(--border)',
                  transition: `all var(--t-fast) var(--ease)`
                }}
              >
                {tab === 'home' && 'Inicio'}
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
          {activeTab === 'home' && <Home onNavigate={(tab) => setActiveTab(tab as Tab)} />}
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
