
import React, { useState, useMemo, useEffect } from 'react';
import { LIBRARY_DATA, SUBSTANCE_CATEGORIES } from '../constants';
import type { LibraryEntry, SubstanceCategory } from '../types';
import { toggleFavorite, isFavorite, getFavorites } from '../services/favoritesService';
import { CompareSubstances } from './CompareSubstances';
import { PsychonautWikiInfo } from './PsychonautWikiInfo';
import { categoryColor, primaryCategoryColor, withAlpha } from './categoryStyles';
import {
  Kicker,
  Display,
  Panel,
  CornerTab,
  CircleThumb,
  SectionLabel,
  DataList,
  InlineNote,
  Pill,
  fieldStyle,
  hexAlpha,
} from './ui';

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
const HeartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);
const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
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
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 max-w-3xl mx-auto w-full" style={{ animation: 'fadeInUp 0.3s var(--ease-out-strong) both' }} key={item.title}>
      {/* Mobile back */}
      <button
        onClick={onBack}
        className="md:hidden inline-flex items-center gap-2 mb-5"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}
      >
        <ArrowLeftIcon /> Volver
      </button>

      {/* ── Hero — corner-cut Panel with coral favorite tab ── */}
      <Panel
        cut="lg"
        tab={<StarIcon filled={isItemFavorite} className="w-[18px] h-[18px]" />}
        onTabClick={handleFavoriteClick}
        className="p-6 sm:p-7 pr-14"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.category.map(cat => (
                <Pill key={cat} as="span" color={categoryColor(cat)} active>{cat}</Pill>
              ))}
            </div>
            <Display size="lg" upper>{item.title}</Display>
            {item.aliases.length > 0 && (
              <p className="mt-3" style={{ fontSize: '13.5px', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                También conocido como{' '}
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.aliases.join(', ')}</span>
              </p>
            )}
          </div>

          {item.structureImage && !imageError ? (
            <CircleThumb size={84} color="#fff" ring style={{ padding: '10px' }}>
              <img src={item.structureImage} alt={`Estructura química de ${item.title}`} className="max-h-full max-w-full object-contain" onError={() => setImageError(true)} />
            </CircleThumb>
          ) : (
            <span
              className="flex-shrink-0 select-all"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                fontSize: '12px',
                letterSpacing: '0.02em',
                color: 'var(--accent-primary)',
                background: hexAlpha(C.accent, 0.14),
                border: `1px solid ${hexAlpha(C.accent, 0.3)}`,
                borderRadius: 'var(--radius-pill)',
                padding: '6px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              {item.chemicalFormula}
            </span>
          )}
        </div>
      </Panel>

      {/* Description on the canvas */}
      <p className="mt-7 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.content.description}</p>

      {/* ── Duración — DataList ── */}
      <div className="mt-9">
        <SectionLabel accent={C.blue}>Duración</SectionLabel>
        <div className="mt-4">
          <DataList
            items={[
              { label: 'Inicio', value: item.content.duration.onset },
              { label: 'Pico / Meseta', value: item.content.duration.peak },
              { label: 'Total', value: item.content.duration.total },
            ]}
          />
        </div>
      </div>

      {/* ── Efectos — two flowing columns, no boxes ── */}
      <div className="mt-9">
        <SectionLabel accent={C.green}>Efectos</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-5">
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.green, marginBottom: '10px' }}>Positivos</p>
            <ul className="space-y-2">
              {item.content.effects.positive.map(e => (
                <li key={e} className="flex gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>＋</span><span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.amber, marginBottom: '10px' }}>Negativos</p>
            <ul className="space-y-2">
              {item.content.effects.negative.map(e => (
                <li key={e} className="flex gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: C.amber, fontWeight: 700 }}>－</span><span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Dosificación — text + InlineNote warning ── */}
      <div className="mt-9">
        <SectionLabel accent={C.violet}>Dosificación</SectionLabel>
        <div className="mt-4 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {item.content.dosage.oral && <p><strong style={{ color: 'var(--text-primary)' }}>Oral:</strong> {item.content.dosage.oral}</p>}
          {item.content.dosage.nasal && <p><strong style={{ color: 'var(--text-primary)' }}>Nasal:</strong> {item.content.dosage.nasal}</p>}
          {item.content.dosage.inhalation && <p><strong style={{ color: 'var(--text-primary)' }}>Inhalado:</strong> {item.content.dosage.inhalation}</p>}
        </div>
        <div className="mt-4">
          <InlineNote label="Importante" accent={C.amber}>{item.content.dosage.warning}</InlineNote>
        </div>
      </div>

      {/* ── Riesgos — ruled list ── */}
      <div className="mt-9">
        <SectionLabel accent={C.red}>Principales riesgos</SectionLabel>
        <div className="mt-2">
          {item.content.risks.map((r, idx) => (
            <div key={r} className="flex items-start gap-3 py-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', marginTop: '7px', flexShrink: 0, background: C.red }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pautas de cuidado — checklist ── */}
      <div className="mt-9">
        <SectionLabel accent={C.green}>Pautas de cuidado</SectionLabel>
        <ul className="mt-4 space-y-3">
          {item.content.guidelines.map((line, index) => (
            <li key={index} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex-shrink-0 mt-0.5" style={{ color: C.green }}><CheckIcon /></span>
              <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: ${C.blue}">$1</strong>`) }} />
            </li>
          ))}
        </ul>
      </div>

      {/* ── Alertas del mercado — deliberate InlineNote (red) ── */}
      <div className="mt-9">
        <SectionLabel accent={C.red}>Alertas del mercado</SectionLabel>
        <div className="mt-4">
          <InlineNote accent={C.red}>{item.content.alerts}</InlineNote>
        </div>
      </div>

      <div className="mt-9">
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

  const actionBtnStyle = (active: boolean, activeColor?: string): React.CSSProperties => ({
    background: active && activeColor ? withAlpha(activeColor, 0.12) : 'transparent',
    color: active && activeColor ? activeColor : 'var(--text-secondary)',
    border: `1px solid ${active && activeColor ? withAlpha(activeColor, 0.4) : 'var(--border-medium)'}`,
    borderRadius: 'var(--radius-pill)',
    padding: '10px 12px',
    fontFamily: 'var(--font-heading)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
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
      <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg-primary)' }}>
        <header className="px-5 sm:px-7 lg:px-8 flex items-center justify-between gap-4" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="min-w-0">
            <Kicker className="mb-3">Modo</Kicker>
            <Display size="lg" upper>Comparación</Display>
          </div>
          <button
            onClick={() => setViewMode('browse')}
            className="flex-shrink-0 inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}
          >
            <ArrowLeftIcon /> Volver
          </button>
        </header>
        <CompareSubstances />
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-h-0" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Pane: Navigation */}
      <div
        className={`${mobileDetailOpen ? 'hidden md:flex' : 'flex'} w-full md:w-[330px] lg:w-[380px] flex-shrink-0 flex-col min-h-0`}
        style={{ borderRight: '1px solid var(--border-subtle)' }}
      >
        <div className="p-4 sm:p-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <Kicker className="mb-3">Biblioteca</Kicker>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: 'var(--text-muted)' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar sustancia o alias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...fieldStyle, paddingLeft: '44px' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.background = 'var(--surface-1)'; }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Pill active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')}>Todas</Pill>
            {SUBSTANCE_CATEGORIES.map(category => (
              <Pill
                key={category}
                color={categoryColor(category)}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Pill>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-4">
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
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <CompareIcon /> Comparar
            </button>
          </div>
        </div>

        <nav className="overflow-y-auto px-4 sm:px-5 flex-1">
          {filteredLibraryData.length === 0 ? (
            <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>Sin resultados.</p>
          ) : (
            <ul>
              {filteredLibraryData.map((item, idx) => {
                const active = selectedItem?.title === item.title;
                const dot = primaryCategoryColor(item.category);
                const fav = isFavorite(item.title);
                return (
                  <li key={item.title}>
                    <button
                      onClick={() => handleSelect(item)}
                      className="group w-full text-left flex items-center gap-3 transition-colors"
                      style={{
                        padding: '13px 8px',
                        borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
                        background: active ? hexAlpha(C.accent, 0.1) : 'transparent',
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-1)'; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: dot, boxShadow: active ? `0 0 0 4px ${withAlpha(dot, 0.18)}` : 'none', transition: 'box-shadow var(--transition-fast)' }}
                      />
                      <span className="flex-1 min-w-0">
                        <span
                          className="block truncate"
                          style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: active ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                        >
                          {item.title}
                        </span>
                        {item.aliases.length > 0 && (
                          <span className="block text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.aliases.slice(0, 3).join(' · ')}</span>
                        )}
                      </span>
                      {fav && <span style={{ color: C.amber }}><StarIcon filled className="w-3.5 h-3.5" /></span>}
                      <span
                        className="flex-shrink-0 transition-opacity"
                        style={{ color: active ? 'var(--accent-primary)' : 'var(--text-muted)', opacity: active ? 1 : 0 }}
                      >
                        <ChevronRightIcon />
                      </span>
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
            <CircleThumb size={56} color="var(--surface-1)" ring><span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span></CircleThumb>
            <p className="mt-4" style={{ color: 'var(--text-muted)' }}>No se encontraron resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
