import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 p-3">
    <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.3s]" style={{ background: 'var(--faint)' }}></div>
    <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.15s]" style={{ background: 'var(--faint)' }}></div>
    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--faint)' }}></div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="max-w-xl text-center space-y-6">
      {/* Welcome */}
      <div>
        <h2
          className="text-2xl font-semibold mb-3"
          style={{
            color: 'var(--text)',
            lineHeight: 'var(--line-height-heading)'
          }}
        >
          Bienvenido
        </h2>
        <p
          className="editorial text-base leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Soy tu asistente informativo. Preguntame lo que necesites para reducir riesgos y mejorar tus estrategias de cuidado.
        </p>
      </div>

      {/* Instructions */}
      <div
        className="p-5 rounded-lg border-l-2 text-left"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--border)',
          borderLeftColor: 'var(--accent)'
        }}
      >
        <h3
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--text)' }}
        >
          Cómo usar este chat
        </h3>
        <ul className="editorial text-sm space-y-2" style={{ color: 'var(--muted)' }}>
          <li>• Preguntá sobre sustancias, efectos, riesgos o interacciones</li>
          <li>• Consultá sobre testeo y análisis de sustancias</li>
          <li>• Pedí información sobre recursos locales y líneas de ayuda</li>
          <li>• Recordá que no soy un profesional médico</li>
        </ul>
      </div>

      {/* Suggested prompts - static text examples */}
      <div>
        <h3
          className="text-xs font-semibold mb-3"
          style={{ color: 'var(--muted)' }}
        >
          Ejemplos de preguntas
        </h3>
        <div className="space-y-2">
          {[
            '¿Qué riesgos tiene mezclar MDMA con alcohol?',
            '¿Cómo puedo testear una pastilla?',
            '¿Dónde puedo encontrar ayuda en Buenos Aires?',
            '¿Cuánto tiempo dura el efecto de LSD?'
          ].map((prompt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border)'
              }}
            >
              <p
                className="editorial text-sm"
                style={{ color: 'var(--muted)' }}
              >
                {prompt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency notice */}
      <p
        className="text-xs"
        style={{ color: 'var(--faint)' }}
      >
        <strong style={{ color: 'var(--text)' }}>Emergencia médica:</strong> Si necesitás atención urgente, llamá al{' '}
        <a href="tel:107" style={{ color: 'var(--accent)' }} className="underline font-semibold">SAME 107</a>
      </p>
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

  const hasMessages = messages.length > 0;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--bg)' }}
    >
      {!hasMessages && !isLoading ? (
        <EmptyState />
      ) : (
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
