
import React, { useState, useMemo, useEffect } from 'react';
import { LIBRARY_DATA, SUBSTANCE_CATEGORIES } from '../constants';
import type { LibraryEntry, SubstanceCategory } from '../types';
import { toggleFavorite, isFavorite, getFavorites } from '../services/favoritesService';
import { CompareSubstances } from './CompareSubstances';
import { PsychonautWikiInfo } from './PsychonautWikiInfo';
import { categoryColor, primaryCategoryColor, withAlpha } from './categoryStyles';

// Semantic accent hexes (mirror the CSS custom properties, usable in JS colour math)
const C = {
  green: '#34D399',
  amber: '#FBBF24',
  red: '#F87171',
  blue: '#60A5FA',
  violet: '#A78BFA',
  accent: '#C7705C',
};

// --- Icon Components ---
const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);
const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ScaleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c-1.472 0-2.882.265-4.185.75M12 4.5c1.472 0 2.882.265 4.185.75M5.25 4.97A48.416 48.416 0 0 1 12 4.5c2.291 0 4.545.16 6.75.47m13.5 0c1.472 0 2.882.265 4.185.75M12 4.5c-1.472 0-2.882.265-4.185.75M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 0A48.11 48.11 0 0 1 12 10.5c2.291 0 4.545.16 6.75.47m-13.5 0a48.11 48.11 0 0 0 13.5 0Z" /></svg>
);
const HeartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);
const WarningIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);
const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const AlertIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
);
const StarIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled = false, className = 'w-5 h-5' }) => (
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
);
const CompareIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);
const ChevronRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
);
const ArrowLeftIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
);
// --- End Icon Components ---

const CategoryChip: React.FC<{ category: SubstanceCategory }> = ({ category }) => {
  const c = categoryColor(category);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ color: c, background: withAlpha(c, 0.12), border: `1px solid ${withAlpha(c, 0.30)}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
      {category}
    </span>
  );
};

/** Timeline strip — one element, three segments, instead of three separate boxes. */
const DurationStrip: React.FC<{ onset: string; peak: string; total: string }> = ({ onset, peak, total }) => (
  <div className="flex rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
    {[{ label: 'Inicio', value: onset }, { label: 'Pico / Meseta', value: peak }, { label: 'Total', value: total }].map((seg, i) => (
      <div key={seg.label} className="flex-1 p-3.5" style={{ borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
        <div className="text-[10px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--text-muted)' }}>{seg.label}</div>
        <div className="mt-1 text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{seg.value}</div>
      </div>
    ))}
  </div>
);

/** Editorial section — icon + title + thin rule, content flows free (no box). Used for the bulk of the dossier. */
const Section: React.FC<{ title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }> = ({ title, icon, accent, children }) => (
  <section>
    <header className="flex items-center gap-2.5 mb-3.5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ color: accent }}>{icon}</span>
      <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</h3>
    </header>
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </section>
);

/** Tonal callout — reserved for genuinely critical content (warnings, market alerts) so it still stands out once the rest of the page stops using boxes everywhere. */
const Callout: React.FC<{ title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }> = ({ title, icon, accent, children }) => (
  <section className="rounded-2xl p-5 sm:p-6" style={{ background: withAlpha(accent, 0.07), border: `1px solid ${withAlpha(accent, 0.25)}` }}>
    <header className="flex items-center gap-3 mb-3">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: withAlpha(accent, 0.16), color: accent }}>{icon}</span>
      <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)', fontSize: '17px' }}>{title}</h3>
    </header>
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </section>
);


const LibraryDetailView: React.FC<{ item: LibraryEntry; onFavoriteToggle: () => void; onBack: () => void }> = ({ item, onFavoriteToggle, onBack }) => {
  const [imageError, setImageError] = useState(false);
  const [isItemFavorite, setIsItemFavorite] = useState(isFavorite(item.title));
  const color = primaryCategoryColor(item.category);

  useEffect(() => {
    setImageError(false);
    setIsItemFavorite(isFavorite(item.title));
  }, [item.title]);

  const handleFavoriteClick = () => {
    toggleFavorite(item.title);
    setIsItemFavorite(!isItemFavorite);
    onFavoriteToggle();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-3xl mx-auto w-full" style={{ animation: 'fadeInUp 0.3s var(--ease-out-strong) both' }} key={item.title}>
      {/* Mobile back */}
      <button
        onClick={onBack}
        className="md:hidden inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-full text-sm font-medium"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
      >
        <ArrowLeftIcon /> Volver
      </button>

      {/* Hero */}
      <div
        className="relative overflow-hidden p-5 sm:p-7"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(color, 0.20)}, ${withAlpha(color, 0.05)} 45%, transparent 75%)`,
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px 22px 22px 6px',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.category.map(cat => <CategoryChip key={cat} category={cat} />)}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1, color: 'var(--text-primary)' }}>
              {item.title}
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              También conocido como <span style={{ color: 'var(--text-secondary)' }}>{item.aliases.join(', ')}</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <button
              onClick={handleFavoriteClick}
              className="p-2.5 rounded-full transition-all active:scale-90"
              style={{
                background: isItemFavorite ? withAlpha(C.amber, 0.14) : 'var(--surface-2)',
                color: isItemFavorite ? C.amber : 'var(--text-muted)',
                border: `1px solid ${isItemFavorite ? withAlpha(C.amber, 0.35) : 'var(--border-subtle)'}`,
              }}
              title={isItemFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-label={isItemFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <StarIcon filled={isItemFavorite} />
            </button>
            {item.structureImage && !imageError ? (
              <div className="hidden sm:flex w-24 h-24 items-center justify-center rounded-2xl p-1.5 bg-white">
                <img src={item.structureImage} alt={`Estructura química de ${item.title}`} className="max-h-full max-w-full object-contain" onError={() => setImageError(true)} />
              </div>
            ) : (
              <div className="hidden sm:flex w-24 h-24 items-center justify-center rounded-2xl px-2 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}>
                <span className="font-mono text-xs tracking-wide select-all" style={{ color: 'var(--text-tertiary)' }}>{item.chemicalFormula}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.content.description}</p>

      {/* Duración — single strip, three segments */}
      <div className="mt-7">
        <div className="flex items-center gap-2.5 mb-3">
          <span style={{ color: C.blue }}><ClockIcon /></span>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)', fontSize: '17px' }}>Duración</h3>
        </div>
        <DurationStrip onset={item.content.duration.onset} peak={item.content.duration.peak} total={item.content.duration.total} />
      </div>

      {/* Efectos — one section, two flowing columns, no boxes */}
      <div className="mt-8">
        <Section title="Efectos" icon={<HeartIcon />} accent={C.green}>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.green }}>Positivos</p>
              <ul className="space-y-1.5">
                {item.content.effects.positive.map(e => (
                  <li key={e} className="flex gap-2"><span style={{ color: C.green }}>＋</span><span>{e}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.amber }}>Negativos</p>
              <ul className="space-y-1.5">
                {item.content.effects.negative.map(e => (
                  <li key={e} className="flex gap-2"><span style={{ color: C.amber }}>－</span><span>{e}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>

      {/* Dosificación */}
      <div className="mt-8">
        <Section title="Dosificación" icon={<ScaleIcon />} accent={C.violet}>
          <div className="space-y-1.5">
            {item.content.dosage.oral && <p><strong style={{ color: 'var(--text-primary)' }}>Oral:</strong> {item.content.dosage.oral}</p>}
            {item.content.dosage.nasal && <p><strong style={{ color: 'var(--text-primary)' }}>Nasal:</strong> {item.content.dosage.nasal}</p>}
            {item.content.dosage.inhalation && <p><strong style={{ color: 'var(--text-primary)' }}>Inhalado:</strong> {item.content.dosage.inhalation}</p>}
          </div>
          <p
            className="mt-3.5 text-xs p-3.5 rounded-xl"
            style={{ color: 'var(--text-secondary)', background: withAlpha(C.amber, 0.10), border: `1px solid ${withAlpha(C.amber, 0.28)}`, borderLeft: `3px solid ${C.amber}` }}
          >
            <strong style={{ color: C.amber, fontWeight: 600 }}>Importante: </strong>{item.content.dosage.warning}
          </p>
        </Section>
      </div>

      {/* Riesgos — left accent rule, not a box */}
      <div className="mt-8">
        <Section title="Principales riesgos" icon={<AlertIcon />} accent={C.red}>
          <ul className="space-y-2 pl-4" style={{ borderLeft: `2px solid ${withAlpha(C.red, 0.3)}` }}>
            {item.content.risks.map(r => <li key={r}>{r}</li>)}
          </ul>
        </Section>
      </div>

      {/* Pautas de Cuidado */}
      <div className="mt-8">
        <Section title="Pautas de cuidado" icon={<CheckIcon />} accent={C.green}>
          <ul className="space-y-2.5">
            {item.content.guidelines.map((line, index) => (
              <li key={index} className="flex gap-2.5">
                <span className="flex-shrink-0 mt-0.5" style={{ color: C.green }}><CheckIcon /></span>
                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: ${C.blue}">$1</strong>`) }} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Alertas del Mercado — the one deliberate callout box; stands out precisely because nothing else above is boxed */}
      <div className="mt-8">
        <Callout title="Alertas del mercado" icon={<AlertIcon />} accent={C.red}>
          {item.content.alerts}
        </Callout>
      </div>

      <div className="mt-8">
        <PsychonautWikiInfo substanceName={item.title} />
      </div>
    </div>
  );
};


export const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<LibraryEntry | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoritesUpdateTrigger, setFavoritesUpdateTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'browse' | 'compare'>('browse');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const filteredLibraryData = useMemo(() => {
    let data = LIBRARY_DATA;
    if (showOnlyFavorites) {
      const favorites = getFavorites();
      data = data.filter(item => favorites.includes(item.title));
    }
    if (selectedCategory !== 'All') {
      data = data.filter(item => item.category.includes(selectedCategory));
    }
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      data = data.filter(item => {
        const contentString = `${item.title} ${item.aliases.join(' ')}`;
        return contentString.toLowerCase().includes(lowercasedFilter);
      });
    }
    return data;
  }, [searchTerm, selectedCategory, showOnlyFavorites, favoritesUpdateTrigger]);

  useEffect(() => {
    if (!selectedItem || !filteredLibraryData.some(item => item.title === selectedItem.title)) {
      setSelectedItem(filteredLibraryData.length > 0 ? filteredLibraryData[0] : null);
    }
  }, [filteredLibraryData, selectedItem]);

  const handleSelect = (item: LibraryEntry) => {
    setSelectedItem(item);
    setMobileDetailOpen(true);
  };

  const handleFavoriteToggle = () => setFavoritesUpdateTrigger(prev => prev + 1);

  const pillStyle = (active: boolean, color?: string): React.CSSProperties => ({
    background: active ? (color ? withAlpha(color, 0.16) : withAlpha(C.accent, 0.18)) : 'var(--surface-1)',
    color: active ? (color || C.accent) : 'var(--text-tertiary)',
    border: `1px solid ${active ? withAlpha(color || C.accent, 0.4) : 'var(--border-subtle)'}`,
    borderRadius: '999px',
    padding: '5px 13px',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const actionBtnStyle = (active: boolean, activeColor?: string): React.CSSProperties => ({
    background: active && activeColor ? withAlpha(activeColor, 0.12) : 'var(--surface-1)',
    color: active && activeColor ? activeColor : 'var(--text-secondary)',
    border: `1px solid ${active && activeColor ? withAlpha(activeColor, 0.3) : 'var(--border-subtle)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    width: '100%',
  });

  if (viewMode === 'compare') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 sm:p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>MODO</span>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Comparación</h2>
          </div>
          <button
            onClick={() => setViewMode('browse')}
            className="px-3.5 py-2 text-sm flex items-center gap-2 rounded-full transition-colors"
            style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <ArrowLeftIcon /> Volver a Biblioteca
          </button>
        </div>
        <CompareSubstances />
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-h-0">
      {/* Left Pane: Navigation */}
      <div
        className={`${mobileDetailOpen ? 'hidden md:flex' : 'flex'} w-full md:w-[330px] lg:w-[380px] flex-shrink-0 flex-col min-h-0`}
        style={{ borderRight: '1px solid var(--border-subtle)' }}
      >
        <div className="p-4 sm:p-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: 'var(--text-muted)' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar sustancia o alias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-11 pr-3 text-sm"
              style={{
                background: 'var(--surface-1)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                transition: 'border-color var(--transition-fast), background var(--transition-fast)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--surface-1)'; }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3.5">
            <button onClick={() => setSelectedCategory('All')} style={pillStyle(selectedCategory === 'All')}>Todas</button>
            {SUBSTANCE_CATEGORIES.map(category => (
              <button key={category} onClick={() => setSelectedCategory(category)} style={pillStyle(selectedCategory === category, categoryColor(category))}>
                {category}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className="transition-all active:scale-[0.98]"
              style={actionBtnStyle(showOnlyFavorites, C.amber)}
            >
              <StarIcon filled={showOnlyFavorites} className="w-4 h-4" />
              {showOnlyFavorites ? 'Todas' : 'Favoritos'}
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className="transition-all active:scale-[0.98]"
              style={actionBtnStyle(false)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = withAlpha(C.violet, 0.4); e.currentTarget.style.color = C.violet; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <CompareIcon /> Comparar
            </button>
          </div>
        </div>

        <nav className="overflow-y-auto p-3 flex-1">
          {filteredLibraryData.length === 0 ? (
            <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>Sin resultados.</p>
          ) : (
            <ul className="space-y-1">
              {filteredLibraryData.map(item => {
                const active = selectedItem?.title === item.title;
                const dot = primaryCategoryColor(item.category);
                const fav = isFavorite(item.title);
                return (
                  <li key={item.title}>
                    <button
                      onClick={() => handleSelect(item)}
                      className="group w-full text-left p-3 flex items-center gap-3 transition-all active:scale-[0.99]"
                      style={{
                        borderRadius: 'var(--radius-md)',
                        background: active ? 'var(--surface-2)' : 'transparent',
                        border: `1px solid ${active ? 'var(--border-medium)' : 'transparent'}`,
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-1)'; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: dot, boxShadow: active ? `0 0 0 4px ${withAlpha(dot, 0.18)}` : 'none', transition: 'box-shadow var(--transition-fast)' }}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm truncate" style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 500 }}>{item.title}</span>
                        {item.aliases.length > 0 && (
                          <span className="block text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.aliases.slice(0, 3).join(' · ')}</span>
                        )}
                      </span>
                      {fav && <span style={{ color: C.amber }}><StarIcon filled className="w-3.5 h-3.5" /></span>}
                      <span className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }}><ChevronRightIcon /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </div>

      {/* Right Pane: Detail View */}
      <div className={`${mobileDetailOpen ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0 overflow-y-auto`}>
        {selectedItem ? (
          <LibraryDetailView item={selectedItem} onFavoriteToggle={handleFavoriteToggle} onBack={() => setMobileDetailOpen(false)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--surface-1)', color: 'var(--text-muted)' }}><SearchIcon /></div>
            <p style={{ color: 'var(--text-muted)' }}>No se encontraron resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
