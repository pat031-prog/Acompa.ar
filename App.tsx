
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ConsentModal } from './components/ConsentModal';
import { getDeepInfraResponse } from './services/deepinfraService';
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
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (consent && messages.length === 0) {
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
      if (!apiKey) {
        throw new Error("API key not provided.");
      }

      const history: HistoryContent[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const { text: botResponseText, sources: botResponseSources } = await getDeepInfraResponse(text, history, consent, apiKey);

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
  }, [isLoading, consent, apiKey, messages]);

  const handleConsent = (consentData: ConsentData, apiKeyValue: string) => {
    setConsent(consentData);
    setApiKey(apiKeyValue);
    // Store API key in localStorage for persistence
    try {
      localStorage.setItem('deepinfra_api_key', apiKeyValue);
    } catch (error) {
      console.error('Error storing API key:', error);
    }
  };

  // Load API key from localStorage on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('deepinfra_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative z-10" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
      {(!consent || !apiKey) && <ConsentModal onConsent={handleConsent} />}

      {/* ── Sidebar — Collapsible ── */}
      <aside
        className="hidden lg:flex flex-col border-r flex-shrink-0 relative"
        style={{
          width: sidebarCollapsed ? '72px' : '264px',
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-secondary)',
          transition: 'width 250ms var(--ease-standard)'
        }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-7 z-10 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-muted)',
            fontSize: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}
          title={sidebarCollapsed ? 'Expandir' : 'Contraer'}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <Header />
        <div className="flex-1 overflow-y-auto" style={{ padding: sidebarCollapsed ? '4px' : '4px 8px' }}>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', backdropFilter: 'blur(12px)' }}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{ background: 'var(--accent-primary)', borderRadius: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2Z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
                <path d="M12 17.5s-4.5-3-4.5-5.5a2.5 2.5 0 0 1 4.5-1.5 2.5 2.5 0 0 1 4.5 1.5c0 2.5-4.5 5.5-4.5 5.5Z" fill="white" opacity="0.95" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Acompañ<span style={{ color: 'var(--accent-primary)' }}>.</span>Ar
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-2.5">
          <div className="flex gap-1.5">
            {[
              { id: 'home' as Tab, label: 'Inicio' },
              { id: 'chat' as Tab, label: 'Chat' },
              { id: 'library' as Tab, label: 'Biblioteca' },
              { id: 'testing' as Tab, label: 'Testeo' },
              { id: 'resources' as Tab, label: 'Recursos' },
              { id: 'observatory' as Tab, label: 'Observ.' },
              { id: 'reminders' as Tab, label: 'Record.' },
              { id: 'dashboard' as Tab, label: 'Stats' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-3 py-1.5 text-xs font-medium whitespace-nowrap"
                style={{
                  background: activeTab === tab.id ? 'var(--accent-subtle)' : 'var(--surface)',
                  color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--accent-medium)' : 'var(--border-subtle)'}`
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:mt-0 mt-[110px]">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {activeTab === 'home' && <Home onNavigate={handleNavigate} />}
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
