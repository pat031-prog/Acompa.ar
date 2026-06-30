
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
import { Literature } from './components/Literature';
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
    <div className="flex h-full w-full overflow-hidden relative z-10" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', background: 'var(--bg-primary)' }}>
      {(!consent || !apiKey) && <ConsentModal onConsent={handleConsent} />}

      {/* ── Sidebar — Collapsible ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 relative"
        style={{
          width: sidebarCollapsed ? '76px' : '268px',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          transition: 'width 250ms var(--ease-standard)'
        }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-7 z-10 w-6 h-6 flex items-center justify-center rounded-full"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-muted)',
            fontSize: '10px',
            boxShadow: 'var(--shadow-sm)',
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(8px)' }}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{ background: 'linear-gradient(150deg, var(--accent-hover), var(--accent-primary))', borderRadius: '9px', boxShadow: 'var(--shadow-glow-accent), inset 0 1px 0 rgba(255,255,255,0.18)' }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
                <g opacity="0.55">
                  <circle cx="8.6" cy="8" r="2.4" />
                  <path d="M3.9 18.6c0-2.7 2.1-4.7 4.7-4.7s4.7 2 4.7 4.7a.6.6 0 0 1-.6.6H4.5a.6.6 0 0 1-.6-.6Z" />
                </g>
                <g>
                  <circle cx="15.2" cy="9" r="2.7" />
                  <path d="M9.6 19.4c0-3 2.5-5.3 5.6-5.3s5.6 2.3 5.6 5.3a.7.7 0 0 1-.7.7H10.3a.7.7 0 0 1-.7-.7Z" />
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>
                Acompañ<span style={{ color: 'var(--accent-primary)' }}>.</span>Ar
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Tabs — Editorial */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-2.5">
          <div className="flex gap-1.5">
            {[
              { id: 'home' as Tab, label: 'INICIO' },
              { id: 'chat' as Tab, label: 'CHAT' },
              { id: 'library' as Tab, label: 'BIBLIO' },
              { id: 'testing' as Tab, label: 'TESTEO' },
              { id: 'resources' as Tab, label: 'RECURSOS' },
              { id: 'observatory' as Tab, label: 'OBSERV.' },
              { id: 'literature' as Tab, label: 'LECTURAS' },
              { id: 'reminders' as Tab, label: 'RECORD.' },
              { id: 'dashboard' as Tab, label: 'STATS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-3.5 py-1.5 text-xs whitespace-nowrap transition-colors rounded-full"
                style={{
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--surface-1)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-tertiary)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  fontSize: '11px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main
        className="flex-1 flex flex-col min-w-0 overflow-hidden lg:mt-0 mt-[104px]"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
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
          {activeTab === 'literature' && <Literature />}
          {activeTab === 'reminders' && <CareReminders />}
          {activeTab === 'dashboard' && <Dashboard />}
        </div>
      </main>
    </div>
  );
};

export default App;
