
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
      className="text-xs break-all"
      style={{ color: 'var(--color-blue)', textDecoration: 'none' }}
      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
    >
      {source.title || source.uri}
    </a>
  </li>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  const bubbleStyle: React.CSSProperties = isUser
    ? {
      background: 'var(--accent-subtle)',
      border: '1px solid var(--accent-medium)',
      borderRadius: 'var(--radius-md)',
    }
    : {
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
    };

  const formattedText = {
    __html: message.text.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: var(--text-primary)">$1</strong>`)
  };

  return (
    <div className={`flex ${containerClasses}`} style={{ animation: 'fadeInUp 0.25s var(--ease-out-strong) both' }}>
      <div
        className="max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-4 py-3 whitespace-pre-wrap transition-all duration-200"
        style={bubbleStyle}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}
          dangerouslySetInnerHTML={formattedText}
        />
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <h4
              className="text-xs font-semibold mb-1.5"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Fuentes
            </h4>
            <ul className="list-none space-y-1">
              {message.sources.map((source, index) => (
                <SourceLink key={index} source={source} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};