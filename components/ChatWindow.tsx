
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 p-2">
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
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
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#15171a] border border-[#24262a] rounded-t-lg mt-4"
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <div className="flex justify-start"><TypingIndicator/></div>}
    </div>
  );
};
