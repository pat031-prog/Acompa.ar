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
    <div
      className="border-t p-6"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--border)'
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                disabled
                  ? 'Por favor, aceptá los términos para comenzar...'
                  : 'Escribí tu pregunta... (Enter para enviar, Shift+Enter para nueva línea)'
              }
              rows={3}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] border resize-none focus:outline-none disabled:opacity-50"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                lineHeight: '1.5',
                transition: `all var(--t-med) var(--ease)`
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = `0 0 0 3px var(--accent-weak), 0 4px 12px rgba(0, 0, 0, 0.1)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              disabled={isLoading || disabled}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || disabled || !text.trim()}
            className="flex-shrink-0 p-4 rounded-[var(--radius-md)] active:scale-95 disabled:cursor-not-allowed"
            style={{
              background: text.trim() && !disabled && !isLoading ? 'var(--accent)' : 'var(--surface-3)',
              color: text.trim() && !disabled && !isLoading ? '#fff' : 'var(--faint)',
              transition: `all var(--t-fast) var(--ease)`,
              boxShadow: text.trim() && !disabled && !isLoading ? '0 2px 8px rgba(209, 153, 91, 0.25)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (text.trim() && !disabled && !isLoading) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            aria-label="Enviar mensaje"
          >
            <SendIcon />
          </button>
        </div>

        <p
          className="text-xs mt-2"
          style={{ color: 'var(--faint)' }}
        >
          Recordá que este es un asistente informativo. No es un reemplazo de atención médica profesional.
        </p>
      </form>
    </div>
  );
};
