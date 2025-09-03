
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-[#15171a] border-t-0 border border-[#24262a] rounded-b-lg mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "Por favor, aceptá los términos para comenzar..." : "Escribí tu pregunta o situación..."}
        className="flex-1 w-full p-3 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !text.trim()}
        className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
        aria-label="Enviar mensaje"
      >
        <SendIcon />
      </button>
    </form>
  );
};
