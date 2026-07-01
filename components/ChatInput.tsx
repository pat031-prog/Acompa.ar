import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

/** SafeTrip composer: pill input on the dark surface + coral circular send.
 *  Extra bottom padding lifts it clear of the floating BottomNav. */
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
    <div className="px-5 sm:px-7 lg:px-10 pt-4" style={{ background: 'var(--bg-primary)', paddingBottom: '104px' }}>
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={disabled ? 'Aceptá los términos para comenzar…' : 'Preguntá sobre dosis, interacciones, efectos…'}
          disabled={isLoading || disabled}
          className="w-full"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-medium)',
            borderRadius: '999px',
            outline: 'none',
            color: 'var(--text-primary)',
            padding: '16px 64px 16px 24px',
            fontSize: '15px',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        />
        <button
          type="submit"
          disabled={inactive}
          aria-label="Enviar mensaje"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: inactive ? 'var(--surface-3)' : 'var(--accent-primary)',
            color: inactive ? 'var(--text-muted)' : 'var(--accent-ink)',
            cursor: inactive ? 'not-allowed' : 'pointer',
            transition: 'background var(--transition-fast), transform var(--transition-fast)',
          }}
          onMouseEnter={(e) => { if (!inactive) { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)'; } }}
          onMouseLeave={(e) => { if (!inactive) { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; } }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
