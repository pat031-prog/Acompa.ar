
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
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 p-4 bg-[var(--surface-1)] border-t border-[var(--border)] mb-4"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "Por favor, aceptá los términos para comenzar..." : "Escribí tu pregunta o situación..."}
        className="flex-1 w-full px-4 py-3 text-base bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--faint)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none disabled:opacity-50"
        style={{
          transition: `all var(--t-med) var(--ease)`,
          fontFamily: 'var(--font-ui)'
        }}
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !text.trim()}
        className="p-3 bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:opacity-90 active:scale-95 disabled:bg-[var(--surface-3)] disabled:text-[var(--faint)] disabled:cursor-not-allowed"
        style={{ transition: `all var(--t-fast) var(--ease)` }}
        aria-label="Enviar mensaje"
      >
        <SendIcon />
      </button>
    </form>
  );
};
