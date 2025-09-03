
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ConsentModal } from './components/ConsentModal';
import { getChatbotResponse } from './services/geminiService';
import { Tabs } from './components/Tabs';
import { Library } from './components/Library';
import { Observatory } from './components/Map';
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
    <div className="flex flex-col h-screen max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-200">
      {!consent && <ConsentModal onConsent={handleConsent} />}
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-h-0">
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 h-full">
            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={!consent} />
          </div>
        )}
        {activeTab === 'library' && <Library />}
        {activeTab === 'observatory' && <Observatory />}
      </main>
    </div>
  );
};

export default App;