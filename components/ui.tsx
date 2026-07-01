import React from 'react';

/**
 * ── Acompañ.Ar UI primitives — "MARS" ──
 * A bold, graphic editorial language: deep warm-black canvas, coral accent,
 * cream ink. Signatures: corner-cut PANELS with coral TABS, big uppercase
 * grotesque DISPLAY type, tracked-uppercase KICKERS, label:value DATA lists,
 * circular motifs, INDEX markers. Compose screens from these — never a plain
 * wall of rounded boxes.
 */

/* ════════════ Type ════════════ */

/** Small uppercase tracked label — the recurring kicker ("OBSERVATORIO", "DISCOVER"). */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; tick?: boolean; className?: string }> = ({ children, color = 'var(--accent-primary)', tick = true, className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    {tick && <span style={{ width: '18px', height: '2px', background: color, borderRadius: '999px' }} />}
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>{children}</span>
  </div>
);

/** Big bold grotesque display title. `upper` for short titles (poster look). */
export const Display: React.FC<{ children: React.ReactNode; size?: 'xl' | 'lg' | 'md'; upper?: boolean; color?: string; className?: string; style?: React.CSSProperties }> = ({ children, size = 'lg', upper = false, color = 'var(--text-primary)', className = '', style }) => {
  const sizes = {
    xl: { fontSize: 'clamp(2.6rem, 5.5vw, 4rem)', lineHeight: 0.96, letterSpacing: '-0.025em' },
    lg: { fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)', lineHeight: 1, letterSpacing: '-0.02em' },
    md: { fontSize: '20px', lineHeight: 1.1, letterSpacing: '-0.01em' },
  }[size];
  return (
    <h1 className={className} style={{ fontFamily: size === 'xl' ? 'var(--font-display)' : 'var(--font-heading)', fontWeight: 800, color, textTransform: upper ? 'uppercase' : 'none', ...sizes, ...style }}>
      {children}
    </h1>
  );
};

/** "#04" style index marker. */
export const IndexTag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'var(--text-muted)' }) => (
  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', color }}>#{children}</span>
);

/** Oversized ghosted index number (01, 02, …). */
export const IndexNum: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 28, color = 'var(--accent-medium)' }) => (
  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: `${size}px`, lineHeight: 1, letterSpacing: '-0.03em', color, fontVariantNumeric: 'tabular-nums' }}>{children}</span>
);

/* ════════════ Surfaces ════════════ */

/** The signature surface: warm near-black with an asymmetric cut corner and an
 *  optional coral corner tab. Use for feature blocks / hero panels. */
export const Panel: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tab?: React.ReactNode;            // coral CornerTab content (icon)
  onTabClick?: () => void;
  cut?: 'lg' | 'sm' | 'none';       // size of the clipped bottom-right corner
  fill?: 'surface' | 'coral' | 'none';
  interactive?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', style, tab, onTabClick, cut = 'sm', fill = 'surface', interactive, onClick }) => {
  const radius = cut === 'lg' ? '24px 24px 24px 4px' : cut === 'sm' ? '20px 20px 20px 6px' : '20px';
  const bg = fill === 'coral' ? 'linear-gradient(150deg, var(--accent-hover), var(--accent-deep))' : fill === 'none' ? 'transparent' : 'var(--surface-1)';
  return (
    <div
      onClick={onClick}
      className={`relative ${className}`}
      style={{
        background: bg,
        border: fill === 'coral' ? 'none' : '1px solid var(--border-subtle)',
        borderRadius: radius,
        overflow: 'hidden',
        transition: 'background var(--transition-base), border-color var(--transition-base)',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={interactive ? (e) => { if (fill !== 'coral') { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; } } : undefined}
      onMouseLeave={interactive ? (e) => { if (fill !== 'coral') { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } } : undefined}
    >
      {tab && <CornerTab onClick={onTabClick}>{tab}</CornerTab>}
      {children}
    </div>
  );
};

/** Coral folded-corner tab, sits in a Panel's top-right corner. */
export const CornerTab: React.FC<{ children: React.ReactNode; onClick?: () => void; color?: string }> = ({ children, onClick, color = 'var(--accent-primary)' }) => (
  <button
    onClick={onClick}
    className="absolute top-0 right-0 flex items-center justify-center"
    style={{ width: '46px', height: '46px', background: color, color: 'var(--accent-ink)', borderRadius: '0 20px 0 20px', cursor: onClick ? 'pointer' : 'default' }}
    tabIndex={onClick ? 0 : -1}
    aria-hidden={!onClick}
  >
    {children}
  </button>
);

/** Circular thumbnail / avatar / motif. */
export const CircleThumb: React.FC<{ size?: number; color?: string; children?: React.ReactNode; ring?: boolean; style?: React.CSSProperties }> = ({ size = 44, color = 'var(--surface-2)', children, ring = false, style }) => (
  <div
    className="flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size, borderRadius: '50%', background: color, border: ring ? '1px solid var(--border-medium)' : 'none', overflow: 'hidden', ...style }}
  >
    {children}
  </div>
);

/** Circular floating action button (coral). */
export const FAB: React.FC<{ children: React.ReactNode; onClick?: () => void; label?: string }> = ({ children, onClick, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="flex items-center justify-center"
    style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--accent-ink)', boxShadow: 'var(--shadow-lg)' }}
  >
    {children}
  </button>
);

/* ════════════ Data ════════════ */

/** label:value rows (the Mars-stats "ficha técnica"). Values bold. */
export const DataList: React.FC<{ items: { label: string; value: React.ReactNode; accent?: string }[]; ruled?: boolean }> = ({ items, ruled = true }) => (
  <dl>
    {items.map((it, i) => (
      <div key={i} className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderTop: ruled && i > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
        <dt style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{it.label}</dt>
        <dd className="text-right" style={{ fontSize: '14px', fontWeight: 700, color: it.accent || 'var(--text-primary)' }}>{it.value}</dd>
      </div>
    ))}
  </dl>
);

/* ════════════ Lists & structure ════════════ */

/** Uppercase tracked kicker + optional count + hairline rule. Opens a block. */
export const SectionLabel: React.FC<{ children: React.ReactNode; count?: number; accent?: string; rule?: boolean }> = ({ children, count, accent, rule = true }) => (
  <div className="flex items-center gap-3">
    {accent && <span style={{ width: '16px', height: '2px', background: accent, borderRadius: '999px' }} />}
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{children}</span>
    {typeof count === 'number' && <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{count}</span>}
    {rule && <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />}
  </div>
);

/** A list row separated by a top hairline — the anti-box list unit. */
export const RuledRow: React.FC<{ children: React.ReactNode; first?: boolean; className?: string; onMouseEnter?: React.MouseEventHandler; onMouseLeave?: React.MouseEventHandler }> = ({ children, first, className = '', onMouseEnter, onMouseLeave }) => (
  <div className={className} style={{ borderTop: first ? 'none' : '1px solid var(--border-subtle)' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </div>
);

/** A left-ruled note (coral rule + uppercase label) — replaces tinted callout boxes. */
export const InlineNote: React.FC<{ label?: string; accent?: string; children: React.ReactNode }> = ({ label, accent = 'var(--accent-primary)', children }) => (
  <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: '16px' }}>
    {label && <div className="mb-1.5" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>{label}</div>}
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
);

/** Shared switch. */
export const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <label className="flex-shrink-0 relative inline-block cursor-pointer" style={{ width: '44px', height: '24px' }}>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <div style={{ background: checked ? 'var(--accent-primary)' : 'var(--surface-3)', borderRadius: '999px', width: '44px', height: '24px', position: 'relative', transition: 'background var(--transition-fast)' }}>
      <div style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', background: checked ? 'var(--accent-ink)' : '#fff', borderRadius: '50%', transition: 'left var(--transition-fast)' }} />
    </div>
  </label>
);

/* ════════════ Section masthead ════════════ */

/** Every section opens the same way: coral kicker (tick + uppercase), a big
 *  grotesque title, an optional standfirst, and an optional right slot. */
export const PageHeader: React.FC<{
  eyebrow: string;
  title: string;
  description?: string;
  accent?: string;
  right?: React.ReactNode;
}> = ({ eyebrow, title, description, accent = 'var(--accent-primary)', right }) => (
  <header className="px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
    <div className="flex items-start justify-between gap-4 max-w-5xl">
      <div className="min-w-0">
        <Kicker color={accent} className="mb-3">{eyebrow}</Kicker>
        <Display size="lg">{title}</Display>
        {description && (
          <p className="mt-3" style={{ fontSize: '14.5px', color: 'var(--text-tertiary)', lineHeight: 1.55, maxWidth: '56ch' }}>{description}</p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  </header>
);

/** In-page group heading: uppercase title + count + rule. */
export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; accent?: string; count?: number }> = ({ children, icon, accent = 'var(--text-tertiary)', count }) => (
  <div className="flex items-center gap-2.5 mb-4" style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
    {icon && <span style={{ color: accent, display: 'inline-flex' }}>{icon}</span>}
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{children}</h2>
    {typeof count === 'number' && <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{count}</span>}
  </div>
);

/* ════════════ Back-compat card / chips / fields ════════════ */

/** Legacy symmetric card. Prefer <Panel/> for new work. */
export const Card: React.FC<{ children: React.ReactNode; className?: string; interactive?: boolean; accent?: string; style?: React.CSSProperties; onClick?: () => void }> = ({ children, className = '', interactive = false, accent, style, onClick }) => (
  <div
    onClick={onClick}
    className={className}
    style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', transition: 'background var(--transition-base), border-color var(--transition-base)', cursor: onClick ? 'pointer' : undefined, ...style }}
    onMouseEnter={interactive ? (e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = accent || 'var(--border-medium)'; } : undefined}
    onMouseLeave={interactive ? (e) => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } : undefined}
  >
    {children}
  </div>
);

/** Tinted box reserved for genuinely critical content (warnings). */
export const Callout: React.FC<{ children: React.ReactNode; accent: string; icon?: React.ReactNode; title?: string }> = ({ children, accent, icon, title }) => (
  <div className="p-4 sm:p-5" style={{ background: tint(accent, 'subtle'), border: `1px solid ${tint(accent, 'medium')}`, borderRadius: 'var(--radius-lg)' }}>
    {title && <div className="flex items-center gap-2 mb-2" style={{ color: accent, fontWeight: 600, fontSize: '14px' }}>{icon}{title}</div>}
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
);

/** Chip / tag / filter. */
export const Pill: React.FC<{ children: React.ReactNode; active?: boolean; color?: string; onClick?: () => void; as?: 'button' | 'span' }> = ({ children, active = false, color = 'var(--accent-primary)', onClick, as = 'button' }) => {
  const style: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: 'var(--radius-pill)',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    background: active ? tint(color, 'subtle') : 'transparent',
    color: active ? color : 'var(--text-tertiary)',
    border: `1px solid ${active ? color : 'var(--border-medium)'}`,
    cursor: onClick ? 'pointer' : 'default', transition: 'all var(--transition-fast)',
  };
  if (as === 'span') return <span style={style}>{children}</span>;
  return <button onClick={onClick} style={style}>{children}</button>;
};

/** One control style across every form. */
export const fieldStyle: React.CSSProperties = {
  background: 'var(--surface-1)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-pill)', outline: 'none', width: '100%', padding: '10px 16px', fontSize: '14px',
  transition: 'border-color var(--transition-fast), background var(--transition-fast)',
};

export const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block mb-1.5" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{children}</label>
);

/* ════════════ helpers ════════════ */

const VAR_TINTS: Record<string, { subtle: string; medium: string }> = {
  'var(--accent-primary)': { subtle: 'var(--accent-subtle)', medium: 'var(--accent-medium)' },
  'var(--accent-secondary)': { subtle: 'var(--accent-secondary-subtle)', medium: 'var(--accent-secondary-medium)' },
  'var(--color-blue)': { subtle: 'var(--color-blue-subtle)', medium: 'var(--color-blue-medium)' },
  'var(--color-green)': { subtle: 'var(--color-green-subtle)', medium: 'var(--color-green-medium)' },
  'var(--color-amber)': { subtle: 'var(--color-amber-subtle)', medium: 'var(--color-amber-medium)' },
  'var(--color-red)': { subtle: 'var(--color-red-subtle)', medium: 'var(--color-red-medium)' },
  'var(--color-violet)': { subtle: 'var(--color-violet-subtle)', medium: 'var(--color-violet-medium)' },
};

export function tint(color: string, level: 'subtle' | 'medium' = 'subtle'): string {
  if (VAR_TINTS[color]) return VAR_TINTS[color][level];
  if (color.startsWith('#')) return hexAlpha(color, level === 'subtle' ? 0.13 : 0.26);
  return color;
}

export function hexAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}
