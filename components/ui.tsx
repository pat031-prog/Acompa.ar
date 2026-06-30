import React from 'react';

/**
 * ── Acompañ.Ar UI primitives ──
 * One source of truth for the shapes every screen is built from.
 * Inspired by Linear / Things: solid surfaces, hairline borders, 8pt rhythm,
 * one type system. If a screen needs a card, a header, a field or a pill,
 * it uses these — so the whole app shares the same bones.
 */

/* ─────────────── PageHeader ───────────────
   Every section opens the same way: a small uppercase eyebrow, a title,
   and an optional one-line description. No decorative circles, no per-section
   improvisation. `accent` lets a section carry its identity colour. */
export const PageHeader: React.FC<{
  eyebrow: string;
  title: string;
  description?: string;
  accent?: string;
  right?: React.ReactNode;
}> = ({ eyebrow, title, description, accent = 'var(--accent-primary)', right }) => (
  <header
    className="px-5 sm:px-7 lg:px-8"
    style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}
  >
    <div className="flex items-start justify-between gap-4 max-w-5xl">
      <div className="min-w-0">
        <div
          className="mb-2"
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent }}
        >
          {eyebrow}
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </h1>
        {description && (
          <p className="mt-2" style={{ fontSize: '14px', color: 'var(--text-tertiary)', lineHeight: 1.55, maxWidth: '52ch' }}>
            {description}
          </p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  </header>
);

/* ─────────────── SectionTitle ───────────────
   In-page group heading: title + count + hairline rule. Consistent across
   Library detail, Resources groups, Testing sections. */
export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; accent?: string; count?: number }> = ({ children, icon, accent = 'var(--text-tertiary)', count }) => (
  <div className="flex items-center gap-2.5 mb-4" style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
    {icon && <span style={{ color: accent, display: 'inline-flex' }}>{icon}</span>}
    <h2 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{children}</h2>
    {typeof count === 'number' && (
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{count}</span>
    )}
  </div>
);

/* ─────────────── Card ───────────────
   The one card. Tonal surface + hairline border. `interactive` adds the
   standard hover (raise one surface step). No bespoke shadows. */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  accent?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ children, className = '', interactive = false, accent, style, onClick }) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      transition: 'background var(--transition-base), border-color var(--transition-base)',
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}
    onMouseEnter={interactive ? (e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = accent || 'var(--border-medium)'; } : undefined}
    onMouseLeave={interactive ? (e) => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } : undefined}
  >
    {children}
  </div>
);

/* ─────────────── Callout ───────────────
   Tinted box reserved for genuinely critical content (warnings, alerts).
   Stands out precisely because ordinary content is NOT boxed. */
export const Callout: React.FC<{ children: React.ReactNode; accent: string; icon?: React.ReactNode; title?: string }> = ({ children, accent, icon, title }) => (
  <div
    className="p-4 sm:p-5"
    style={{ background: tint(accent, 'subtle'), border: `1px solid ${tint(accent, 'medium')}`, borderRadius: 'var(--radius-lg)' }}
  >
    {title && (
      <div className="flex items-center gap-2 mb-2" style={{ color: accent, fontWeight: 600, fontSize: '14px' }}>
        {icon}{title}
      </div>
    )}
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
);

/* ─────────────── Pill ───────────────
   The one chip/tag. Used for filters, categories, tags. */
export const Pill: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  onClick?: () => void;
  as?: 'button' | 'span';
}> = ({ children, active = false, color = 'var(--accent-primary)', onClick, as = 'button' }) => {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    background: active ? tint(color, 'subtle') : 'var(--surface-1)',
    color: active ? color : 'var(--text-tertiary)',
    border: `1px solid ${active ? tint(color, 'medium') : 'var(--border-subtle)'}`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all var(--transition-fast)',
  };
  if (as === 'span') return <span style={style}>{children}</span>;
  return <button onClick={onClick} style={style}>{children}</button>;
};

/* ─────────────── Field (input / select) ───────────────
   One control style across every form in the app. */
export const fieldStyle: React.CSSProperties = {
  background: 'var(--surface-1)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  outline: 'none',
  width: '100%',
  padding: '9px 12px',
  fontSize: '14px',
  transition: 'border-color var(--transition-fast), background var(--transition-fast)',
};

export const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>{children}</label>
);

/* ─────────────── helpers ───────────────
   Resolve a base accent to its subtle/medium tint. Accepts hex or a
   CSS var() string (mapped to the matching --*-subtle / --*-medium token). */
const VAR_TINTS: Record<string, { subtle: string; medium: string }> = {
  'var(--accent-primary)': { subtle: 'var(--accent-subtle)', medium: 'var(--accent-medium)' },
  'var(--accent-secondary)': { subtle: 'var(--accent-secondary-subtle)', medium: 'var(--accent-secondary-medium)' },
  'var(--color-blue)': { subtle: 'var(--color-blue-subtle)', medium: 'var(--color-blue-medium)' },
  'var(--color-green)': { subtle: 'var(--color-green-subtle)', medium: 'var(--color-green-medium)' },
  'var(--color-amber)': { subtle: 'var(--color-amber-subtle)', medium: 'var(--color-amber-medium)' },
  'var(--color-red)': { subtle: 'var(--color-red-subtle)', medium: 'var(--color-red-medium)' },
  'var(--color-violet)': { subtle: 'var(--color-violet-subtle)', medium: 'var(--color-violet-medium)' },
};

export function tint(color: string, level: 'subtle' | 'medium'): string {
  if (VAR_TINTS[color]) return VAR_TINTS[color][level];
  if (color.startsWith('#')) return hexAlpha(color, level === 'subtle' ? 0.12 : 0.24);
  return color;
}

export function hexAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}
