import React from 'react';

interface PageShellProps {
  title: string;
  purpose?: string;
  primaryAction?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * PageShell: Unified page container with title, purpose, and optional primary action.
 * Creates a consistent "document" feel across all modules.
 */
export const PageShell: React.FC<PageShellProps> = ({ title, purpose, primaryAction, children }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 border-b px-6 sm:px-8 py-4 sm:py-5"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-[1600px] mx-auto flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight"
              style={{
                color: 'var(--text)',
                lineHeight: 'var(--line-height-heading)'
              }}
            >
              {title}
            </h1>
            {purpose && (
              <p
                className="text-sm sm:text-base mt-1.5"
                style={{ color: 'var(--muted)' }}
              >
                {purpose}
              </p>
            )}
          </div>
          {primaryAction && (
            <div className="flex-shrink-0">
              {primaryAction}
            </div>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-6 sm:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};
