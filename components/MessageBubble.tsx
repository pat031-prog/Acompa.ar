
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
      style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
    >
      {source.title || source.uri}
    </a>
  </li>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  // User = coral fill with a tucked bottom-right corner.
  // Bot  = warm surface with hairline border and a tucked bottom-left corner.
  const bubbleStyle: React.CSSProperties = isUser
    ? {
        background: 'var(--accent-primary)',
        color: 'var(--accent-ink)',
        border: 'none',
        borderRadius: '18px 18px 6px 18px',
      }
    : {
        background: 'var(--surface-1)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px 18px 18px 6px',
      };

  const bodyColor = isUser ? 'var(--accent-ink)' : 'var(--text-secondary)';
  const strongColor = isUser ? 'var(--accent-ink)' : 'var(--text-primary)';

  const formattedText = {
    __html: message.text.replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="font-weight:700; color: ${strongColor}">$1</strong>`
    ),
  };

  return (
    <div className={`flex ${containerClasses}`} style={{ animation: 'fadeInUp 0.25s var(--ease-out-strong) both' }}>
      <div
        className="max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-4 py-3 whitespace-pre-wrap"
        style={bubbleStyle}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: bodyColor, fontFamily: 'var(--font-ui)' }}
          dangerouslySetInnerHTML={formattedText}
        />
        {message.sources && message.sources.length > 0 && (
          <div
            className="mt-3 pt-2.5"
            style={{ borderTop: `1px solid ${isUser ? 'var(--accent-ink)' : 'var(--border-subtle)'}` }}
          >
            <h4
              className="mb-1.5"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: isUser ? 'var(--accent-ink)' : 'var(--accent-primary)',
              }}
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
