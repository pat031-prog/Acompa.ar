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
        background: 'var(--bg-paper-200)',
        borderColor: 'var(--border-subtle)'
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
              className="w-full px-4 py-3 resize-none focus:outline-none disabled:opacity-50"
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-ink-900)',
                borderColor: 'var(--border-medium)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                lineHeight: 'var(--line-height-base)',
                transition: `all var(--t-medium) var(--ease-standard)`,
                boxShadow: 'var(--shadow-inset)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-focus)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.boxShadow = 'var(--shadow-inset)';
              }}
              disabled={isLoading || disabled}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || disabled || !text.trim()}
            className="flex-shrink-0 p-4 active:scale-95 disabled:cursor-not-allowed"
            style={{
              background: text.trim() && !disabled && !isLoading ? 'var(--accent-primary)' : 'var(--bg-surface)',
              color: text.trim() && !disabled && !isLoading ? '#fff' : 'var(--text-ink-400)',
              borderRadius: 'var(--radius-sm)',
              transition: `all var(--t-fast) var(--ease-standard)`,
              boxShadow: text.trim() && !disabled && !isLoading
                ? '0 2px 8px rgba(217, 119, 87, 0.25)'
                : 'var(--shadow-inset)',
              border: text.trim() && !disabled && !isLoading
                ? 'none'
                : '1px solid var(--border-medium)'
            }}
            onMouseEnter={(e) => {
              if (text.trim() && !disabled && !isLoading) {
                e.currentTarget.style.background = 'var(--accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (text.trim() && !disabled && !isLoading) {
                e.currentTarget.style.background = 'var(--accent-primary)';
              }
            }}
            aria-label="Enviar mensaje"
          >
            <SendIcon />
          </button>
        </div>

        <p
          className="text-xs mt-2"
          style={{
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-ink-400)'
          }}
        >
          Recordá que este es un asistente informativo. No es un reemplazo de atención médica profesional.
        </p>
      </form>
    </div>
  );
};
