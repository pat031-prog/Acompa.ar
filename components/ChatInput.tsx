
import React, { useState } from 'react';
import { fieldStyle } from './ui';

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

  const inactive = isLoading || disabled || !text.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-5 sm:px-7 lg:px-8 py-4"
      style={{
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? 'Por favor, aceptá los términos para comenzar...' : 'Escribí tu pregunta o situación...'}
        className="flex-1"
        style={fieldStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
        }}
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={inactive}
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: inactive ? 'var(--surface-3)' : 'var(--accent-primary)',
          color: inactive ? 'var(--text-muted)' : 'var(--accent-ink)',
          cursor: inactive ? 'not-allowed' : 'pointer',
          boxShadow: inactive ? 'none' : 'var(--shadow-lg)',
          transition: 'background var(--transition-fast), transform var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          if (!inactive) {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!inactive) {
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
