
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

/** Typing indicator — three coral dots pulsing. */
const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 px-4 py-3">
    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '-0.3s' }} />
    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '-0.15s' }} />
    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite' }} />
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
      className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8 py-6 space-y-5"
      style={{
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <div className="flex justify-start"><TypingIndicator /></div>}
    </div>
  );
};
