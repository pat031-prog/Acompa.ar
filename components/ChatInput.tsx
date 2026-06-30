
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
      className="flex items-center gap-3 p-3 mb-4"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
        boxShadow: 'var(--shadow-ambient)',
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "Por favor, aceptá los términos para comenzar..." : "Escribí tu pregunta o situación..."}
        className="flex-1 w-full px-4 py-3 text-sm"
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 112, 92, 0.12)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !text.trim()}
        className="p-3 transition-all duration-200"
        style={{
          background: (isLoading || disabled || !text.trim()) ? 'var(--surface-2)' : 'var(--accent-primary)',
          color: (isLoading || disabled || !text.trim()) ? 'var(--text-muted)' : '#fff',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          cursor: (isLoading || disabled || !text.trim()) ? 'not-allowed' : 'pointer',
          boxShadow: (isLoading || disabled || !text.trim()) ? 'none' : '0 2px 8px rgba(199, 112, 92, 0.2)',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && !disabled && text.trim()) {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && !disabled && text.trim()) {
            e.currentTarget.style.background = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
        aria-label="Enviar mensaje"
      >
        <SendIcon />
      </button>
    </form>
  );
};
