import React from 'react';
import { motion } from 'motion/react';

/**
 * ── Acompañ.Ar UI primitives — "MARS" ──
 * A bold, graphic editorial language: deep warm-black canvas, coral accent,
 * cream ink. Signatures: corner-cut PANELS with coral TABS, big uppercase
 * grotesque DISPLAY type, tracked-uppercase KICKERS, label:value DATA lists,
 * circular motifs, INDEX markers. Compose screens from these — never a plain
 * wall of rounded boxes.
 */

/* ════════════ Type ════════════ */

/** SafeTrip kicker — coral, wide-tracked uppercase mono-ish label. */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; tick?: boolean; className?: string }> = ({ children, color = 'var(--accent-primary)', tick = false, className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    {tick && <span style={{ width: '18px', height: '2px', background: color, borderRadius: '999px' }} />}
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color }}>{children}</span>
  </div>
);

/** Space Grotesk display title — bold, tracking-tighter, uppercase for `upper`. */
export const Display: React.FC<{ children: React.ReactNode; size?: 'xl' | 'lg' | 'md'; upper?: boolean; color?: string; className?: string; style?: React.CSSProperties }> = ({ children, size = 'lg', upper = false, color = 'var(--text-primary)', className = '', style }) => {
  const sizes = {
    xl: { fontSize: 'clamp(3rem, 6.5vw, 5rem)', lineHeight: 0.92, letterSpacing: '-0.04em' },
    lg: { fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 0.96, letterSpacing: '-0.035em' },
    md: { fontSize: '24px', lineHeight: 1.05, letterSpacing: '-0.02em' },
  }[size];
  return (
    <h1 className={className} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color, textTransform: upper ? 'uppercase' : 'none', ...sizes, ...style }}>
      {children}
    </h1>
  );
};

/** Coral mono label used inside dark data cards ("DURACIÓN", "EFECTOS"). */
export const MonoLabel: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color = 'var(--accent-primary)', className = '' }) => (
  <span className={className} style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color }}>{children}</span>
);

/** A labelled data section: coral mono label + content. */
export const DataBlock: React.FC<{ label: React.ReactNode; children: React.ReactNode; color?: string; className?: string }> = ({ label, children, color, className = '' }) => (
  <div className={className}>
    <MonoLabel color={color}>{label}</MonoLabel>
    <div className="mt-2">{children}</div>
  </div>
);

/** The big coral detail panel with a huge rounded corner (SafeTrip signature). */
export const CoralPanel: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={`rounded-t-[3rem] md:rounded-l-[4rem] md:rounded-tr-none ${className}`}
    style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', ...style }}
  >
    {children}
  </div>
);

/** The dark rounded card that floats on the coral panel, holding the data. */
export const DarkCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={className}
    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: '2.5rem', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', ...style }}
  >
    {children}
  </div>
);

/** List-rail item with an animated outlined-pill selection (motion layoutId).
 *  The signature SafeTrip master-list interaction. */
export const RailItem: React.FC<{ active: boolean; onClick: () => void; layoutId: string; children: React.ReactNode; sub?: React.ReactNode }> = ({ active, onClick, layoutId, children, sub }) => (
  <button
    onClick={onClick}
    className="relative w-full text-center md:text-left transition-colors duration-300 group"
    style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 500, color: active ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
  >
    {active && (
      <motion.div
        layoutId={layoutId}
        className="absolute left-1/2 md:left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:translate-x-0"
        style={{ width: '112%', height: sub ? '76px' : '54px', border: '1px solid var(--accent-primary)', borderRadius: '999px' }}
        initial={false}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
    <span className="relative z-10 block px-4 py-2" style={{ fontSize: sub ? '14px' : '15px' }}>{children}</span>
    {sub && <span className="relative z-10 block px-4 text-xs" style={{ letterSpacing: '0.05em', opacity: 0.5, textTransform: 'none', fontFamily: 'var(--font-ui)' }}>{sub}</span>}
    {active && <span className="hidden md:block absolute right-0 top-1/2 h-px w-8" style={{ background: 'var(--accent-primary)' }} />}
  </button>
);

/** Full-width coral CTA (SafeTrip "Cómo llegar" style). */
export const CoralButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string; type?: 'button' | 'submit' }> = ({ children, onClick, className = '', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 transition-colors ${className}`}
    style={{ padding: '15px 20px', borderRadius: '999px', background: 'var(--accent-primary)', color: 'var(--accent-ink)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
    onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; }}
  >
    {children}
  </button>
);

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

/** The "planet" — a big circular hero orb with a 3D radial sheen and a subtle
 *  speckled surface. The centrepiece of a focused detail screen. */
export const Orb: React.FC<{ color: string; size?: number; label?: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ color, size = 200, label, className = '', style }) => (
  <div
    className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
    style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 34% 27%, rgba(255,255,255,0.5), rgba(255,255,255,0.06) 30%, transparent 46%), radial-gradient(circle at 74% 80%, rgba(0,0,0,0.55), transparent 55%), ${color}`,
      boxShadow: `0 30px 70px ${hexAlpha(color, 0.32)}, inset -6px -10px 42px rgba(0,0,0,0.42)`,
      ...style,
    }}
  >
    <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundImage: 'radial-gradient(rgba(0,0,0,0.22) 1px, transparent 1.5px)', backgroundSize: '15px 15px', opacity: 0.45, mixBlendMode: 'multiply' }} />
    {label && <span className="relative" style={{ color: 'var(--accent-ink)' }}>{label}</span>}
  </div>
);

/** Circular icon button — surface / coral / outline variants (expand, more, ...). */
export const CircleButton: React.FC<{ children: React.ReactNode; onClick?: () => void; label?: string; variant?: 'surface' | 'coral' | 'outline' | 'dark'; size?: number; active?: boolean; activeColor?: string }> = ({ children, onClick, label, variant = 'surface', size = 40, active, activeColor = 'var(--accent-primary)' }) => {
  const styles: React.CSSProperties =
    variant === 'coral'
      ? { background: 'var(--accent-primary)', color: 'var(--accent-ink)', border: 'none' }
      : variant === 'dark'
        ? { background: 'var(--bg-primary)', color: 'var(--accent-primary)', border: 'none' }
        : variant === 'outline'
          ? { background: active ? tint(activeColor) : 'transparent', color: active ? activeColor : 'var(--text-secondary)', border: `1px solid ${active ? activeColor : 'var(--border-medium)'}` }
          : { background: 'var(--surface-2)', color: active ? activeColor : 'var(--text-secondary)', border: '1px solid var(--border-subtle)' };
  return (
    <button onClick={onClick} aria-label={label} title={label} className="flex items-center justify-center flex-shrink-0 transition-colors active:scale-95" style={{ width: size, height: size, borderRadius: '50%', ...styles }}>
      {children}
    </button>
  );
};

/** "DISCOVER" strip — related items as small circular orbs with labels. */
export const DiscoverStrip: React.FC<{ label?: string; items: { color: string; name: string; onClick?: () => void }[]; vertical?: boolean }> = ({ label = 'Relacionadas', items, vertical = true }) => (
  <div>
    {label && <div className="mb-3" style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: vertical ? 'right' : 'left' }}>{label}</div>}
    <div className={vertical ? 'flex flex-col items-end gap-3' : 'flex items-center gap-3'}>
      {items.map((it, i) => (
        <button key={i} onClick={it.onClick} className="group flex items-center gap-3" title={it.name}>
          {vertical && <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-tertiary)' }}>{it.name}</span>}
          <Orb color={it.color} size={34} />
          {!vertical && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{it.name}</span>}
        </button>
      ))}
    </div>
  </div>
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
  icon?: React.ReactNode;   // renders a coral "planet" medallion beside the title
}> = ({ eyebrow, title, description, accent = 'var(--accent-primary)', right, icon }) => (
  <header className="px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
    <div className="flex items-center justify-between gap-6 max-w-5xl">
      <div className="min-w-0">
        <Kicker color={accent} className="mb-3">{eyebrow}</Kicker>
        <Display size="lg">{title}</Display>
        {description && (
          <p className="mt-3" style={{ fontSize: '14.5px', color: 'var(--text-tertiary)', lineHeight: 1.55, maxWidth: '56ch' }}>{description}</p>
        )}
      </div>
      {icon ? (
        <Orb color={accent} size={68} className="hidden sm:flex" label={<span style={{ display: 'inline-flex' }}>{icon}</span>} />
      ) : right ? (
        <div className="flex-shrink-0">{right}</div>
      ) : null}
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
