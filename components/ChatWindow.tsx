
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 p-3">
    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '-0.3s' }}></div>
    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '-0.15s' }}></div>
    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite' }}></div>
  </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-5 space-y-5 rounded-t-lg mt-4"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <div className="flex justify-start"><TypingIndicator /></div>}
    </div>
  );
};
