import React from 'react';
import type { Message, Source } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const SourceLink: React.FC<{ source: Source }> = ({ source }) => (
  <li>
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm hover:underline break-all"
      style={{
        color: 'var(--accent)',
        transition: `opacity var(--t-fast) var(--ease)`
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      {source.title || source.uri}
    </a>
  </li>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Format text to render markdown-style bold (**) as <strong> tags
  const formattedText = {
    __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] ${isUser ? 'max-w-xl' : 'max-w-2xl'}`}>
        {/* Label */}
        <div className={`text-xs font-medium mb-2 ${isUser ? 'text-right' : 'text-left'}`} style={{ color: 'var(--faint)' }}>
          {isUser ? 'Vos' : 'Asistente'}
        </div>

        {/* Message content */}
        <div
          className={`px-0 py-2 ${isUser ? 'text-right' : 'text-left'}`}
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <p
            className={`text-base leading-relaxed whitespace-pre-wrap ${
              isUser ? 'font-[var(--font-ui)]' : 'editorial'
            }`}
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-body)'
            }}
            dangerouslySetInnerHTML={formattedText}
          />

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>
                Fuentes:
              </h4>
              <ul className="list-none space-y-1.5">
                {message.sources.map((source, index) => (
                  <SourceLink key={index} source={source} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
