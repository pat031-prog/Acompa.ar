
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
      className="text-xs text-blue-400 hover:underline break-all"
    >
      {source.title || source.uri}
    </a>
  </li>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // User: UI sans, slightly raised surface
  // Assistant: Editorial serif, subtle surface
  const bubbleClasses = isUser
    ? 'bg-[var(--surface-2)] border border-[var(--border)]'
    : 'bg-[var(--surface-1)] border border-[var(--border)]';

  const textClasses = isUser
    ? 'font-[var(--font-ui)] text-[var(--text)]'
    : 'editorial text-[var(--text)]';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  // Format text to render markdown-style bold (**) as <strong> tags
  const formattedText = {
    __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  };

  return (
    <div className={`flex ${containerClasses}`}>
      <div
        className={`max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-5 py-4 rounded-[var(--radius-md)] whitespace-pre-wrap ${bubbleClasses}`}
        style={{ transition: `all var(--t-med) var(--ease)` }}
      >
        <p
          className={`text-base ${textClasses}`}
          style={{ lineHeight: 'var(--line-height-body)' }}
          dangerouslySetInnerHTML={formattedText}
        />
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-700/50">
            <h4 className="text-xs font-semibold text-gray-400 mb-1.5">Fuentes:</h4>
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