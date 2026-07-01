import React from 'react';
import type { Message, Source } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const SourceLink: React.FC<{ source: Source; isUser: boolean }> = ({ source, isUser }) => (
  <li>
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs break-all"
      style={{ color: isUser ? '#fff' : 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
    >
      {source.title || source.uri}
    </a>
  </li>
);

/** SafeTrip chat bubble: coral-tinted Bot avatar + dark surface bubble (ai),
 *  translucent white avatar + white/10 bubble (user). Tucked inner corner. */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const strongColor = isUser ? '#fff' : 'var(--text-primary)';

  const formattedText = {
    __html: message.text.replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="font-weight:700; color: ${strongColor}">$1</strong>`
    ),
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeInUp 0.25s var(--ease-out-strong) both' }}>
      <div className={`flex gap-3 sm:gap-4 max-w-[86%] md:max-w-[74%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: isUser ? 'rgba(255,255,255,0.10)' : 'var(--accent-subtle)' }}
          >
            {isUser
              ? <User size={16} style={{ color: 'var(--text-secondary)' }} />
              : <Bot size={16} style={{ color: 'var(--accent-primary)' }} />}
          </div>
        </div>

        {/* Bubble */}
        <div
          className="p-4"
          style={{
            background: isUser ? 'rgba(255,255,255,0.10)' : 'var(--surface-1)',
            color: isUser ? '#fff' : 'var(--text-secondary)',
            border: isUser ? 'none' : '1px solid var(--border-subtle)',
            borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          }}
        >
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: isUser ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
            dangerouslySetInnerHTML={formattedText}
          />
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2.5" style={{ borderTop: `1px solid ${isUser ? 'rgba(255,255,255,0.18)' : 'var(--border-subtle)'}` }}>
              <h4
                className="mb-1.5"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: isUser ? '#fff' : 'var(--accent-primary)' }}
              >
                Fuentes
              </h4>
              <ul className="list-none space-y-1">
                {message.sources.map((source, index) => (
                  <SourceLink key={index} source={source} isUser={isUser} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
