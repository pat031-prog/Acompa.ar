import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { Bot } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

/** Typing indicator — coral Bot avatar + dark bubble with spinner dots. */
const TypingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="flex gap-3 sm:gap-4 max-w-[86%]">
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
          <Bot size={16} style={{ color: 'var(--accent-primary)' }} />
        </div>
      </div>
      <div className="p-4 flex items-center gap-2" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '20px 20px 20px 4px' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '-0.3s' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '-0.15s' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', animation: 'pulse 1.4s ease-in-out infinite' }} />
        <span className="ml-1 text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>Escribiendo…</span>
      </div>
    </div>
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
    <div className="flex flex-col flex-1 min-h-0" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-10 py-7" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>Asistente IA</h2>
          <p className="mt-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Privado · Confidencial · Sin juicios</p>
        </div>
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
          <Bot size={22} style={{ color: 'var(--accent-primary)' }} />
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-10 py-7 space-y-6 no-scrollbar"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
};
