
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ConsentModal } from './components/ConsentModal';
import { getDeepInfraResponse } from './services/deepinfraService';
import { BottomNav } from './components/BottomNav';
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
    <div className="h-[100dvh] w-full overflow-hidden relative" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', background: 'var(--bg-primary)' }}>
      {(!consent || !apiKey) && <ConsentModal onConsent={handleConsent} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28 }}
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{ bottom: 0 }}
        >
          {activeTab === 'home' && <Home onNavigate={handleNavigate} />}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full overflow-hidden">
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
        </motion.div>
      </AnimatePresence>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;
