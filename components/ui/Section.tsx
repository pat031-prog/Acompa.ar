import React from 'react';

interface SectionProps {
  title?: string;
  meta?: string;
  rightRail?: React.ReactNode;
  children: React.ReactNode;
  spacing?: 'normal' | 'tight' | 'loose';
}

/**
 * Section: A content section with optional title, metadata, and right rail.
 * Replaces heavy "cards" with a continuous document feel.
 */
export const Section: React.FC<SectionProps> = ({
  title,
  meta,
  rightRail,
  children,
  spacing = 'normal'
}) => {
  const spacingClasses = {
    tight: 'space-y-4',
    normal: 'space-y-6',
    loose: 'space-y-8'
  };

  return (
    <section className={`${spacingClasses[spacing]}`}>
      {(title || meta) && (
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            {title && (
              <h2
                className="text-xl sm:text-2xl font-semibold"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  lineHeight: 'var(--line-height-tight)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                {title}
              </h2>
            )}
            {meta && (
              <p
                className="text-sm mt-2"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--text-ink-600)'
                }}
              >
                {meta}
              </p>
            )}
          </div>
          {rightRail && (
            <div className="hidden lg:block flex-shrink-0">
              {rightRail}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </section>
  );
};

interface CalloutProps {
  variant?: 'neutral' | 'warning' | 'info';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Callout: High-signal guidance block.
 * Use sparingly for warnings, key differences, or critical info.
 */
export const Callout: React.FC<CalloutProps> = ({ variant = 'neutral', icon, children }) => {
  const variants = {
    neutral: {
      bg: 'var(--surface-1)',
      border: 'var(--border)',
      accentBorder: 'rgba(255, 255, 255, 0.12)'
    },
    warning: {
      bg: 'var(--surface-1)',
      border: 'var(--border)',
      accentBorder: 'rgba(245, 158, 11, 0.4)' // amber
    },
    info: {
      bg: 'var(--surface-1)',
      border: 'var(--border)',
      accentBorder: 'rgba(59, 130, 246, 0.4)' // blue
    }
  };

  const style = variants[variant];

  return (
    <div
      className="editorial rounded-[var(--radius-md)] p-5 sm:p-6 border-l-2"
      style={{
        background: style.bg,
        borderColor: style.border,
        borderLeftColor: style.accentBorder
      }}
    >
      {icon && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-lg" style={{ color: 'var(--text)' }}>
            {icon}
          </div>
          <div className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {children}
          </div>
        </div>
      )}
      {!icon && (
        <div className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

interface ChipProps {
  label: string;
  variant?: 'default' | 'accent';
  onClick?: () => void;
  active?: boolean;
}

/**
 * Chip/Tag: Small categorical label.
 * Muted by default to avoid visual noise.
 */
export const Chip: React.FC<ChipProps> = ({ label, variant = 'default', onClick, active = false }) => {
  const isInteractive = !!onClick;

  const baseStyles = {
    background: active ? 'var(--surface-3)' : 'var(--surface-1)',
    color: active ? 'var(--text)' : 'var(--muted)',
    borderColor: 'var(--border)',
    transition: `all var(--t-fast) var(--ease)`
  };

  const accentStyles = {
    background: active ? 'var(--accent)' : 'var(--accent-weak)',
    color: active ? 'white' : 'var(--accent)',
    borderColor: 'transparent',
    transition: `all var(--t-fast) var(--ease)`
  };

  const style = variant === 'accent' ? accentStyles : baseStyles;

  const Component = isInteractive ? 'button' : 'span';

  return (
    <Component
      className={`inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border ${isInteractive ? 'cursor-pointer active:scale-95' : ''}`}
      style={style}
      onClick={onClick}
      onMouseEnter={isInteractive ? (e) => {
        (e.currentTarget as HTMLElement).style.background = variant === 'accent' ? 'var(--accent)' : 'var(--surface-2)';
      } : undefined}
      onMouseLeave={isInteractive ? (e) => {
        (e.currentTarget as HTMLElement).style.background = style.background;
      } : undefined}
    >
      {label}
    </Component>
  );
};

/**
 * Divider: Rare, faint separator.
 * Prefer whitespace over dividers.
 */
export const Divider: React.FC<{ spacing?: 'normal' | 'loose' }> = ({ spacing = 'normal' }) => {
  const spacingClasses = spacing === 'loose' ? 'my-12' : 'my-8';

  return (
    <hr
      className={spacingClasses}
      style={{ borderColor: 'var(--border)', borderWidth: '1px' }}
    />
  );
};
