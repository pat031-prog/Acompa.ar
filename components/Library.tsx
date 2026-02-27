
import React, { useState, useMemo, useEffect } from 'react';
import { LIBRARY_DATA, SUBSTANCE_CATEGORIES } from '../constants';
import type { LibraryEntry, SubstanceCategory } from '../types';
import { toggleFavorite, isFavorite, getFavorites } from '../services/favoritesService';
import { CompareSubstances } from './CompareSubstances';
import { PsychonautWikiInfo } from './PsychonautWikiInfo';
import DoseCalculator from './DoseCalculator';

// --- Icon Components ---
const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);
const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ScaleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c-1.472 0-2.882.265-4.185.75M12 4.5c1.472 0 2.882.265 4.185.75M5.25 4.97A48.416 48.416 0 0 1 12 4.5c2.291 0 4.545.16 6.75.47m13.5 0c1.472 0 2.882.265 4.185.75M12 4.5c-1.472 0-2.882.265-4.185.75M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 0A48.11 48.11 0 0 1 12 10.5c2.291 0 4.545.16 6.75.47m-13.5 0a48.11 48.11 0 0 0 13.5 0Z" /></svg>
);
const HeartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);
const WarningIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);
const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const AlertIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
);
const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
);
const CompareIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);
const CalculatorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
  </svg>
);

const InfoSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; color?: string }> = ({ title, icon, children, color }) => (
  <div className="mt-8 lg:mt-10">
    <div className="flex items-center gap-3 mb-4">
      <span style={{ color: color || 'var(--text-secondary)' }}>{icon}</span>
      <h3 className="font-bold" style={{ color: color || 'var(--text-primary)', fontFamily: 'var(--font-editorial)', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
    </div>
    <div className="pl-7 text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </div>
  </div>
);


const LibraryDetailView: React.FC<{ item: LibraryEntry; onFavoriteToggle: () => void }> = ({ item, onFavoriteToggle }) => {
  const [imageError, setImageError] = useState(false);
  const [isItemFavorite, setIsItemFavorite] = useState(isFavorite(item.title));

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
    <div className="p-6 sm:p-8 lg:p-10 xl:p-12" style={{ animation: 'fadeInUp 0.3s var(--ease-out-strong) both' }}>
      {/* Editorial article header */}
      <div className="flex items-center gap-3 mb-6">
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
          SUSTANCIA
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        <button
          onClick={handleFavoriteClick}
          className="flex-shrink-0 p-2 transition-all active:scale-95"
          style={{
            background: isItemFavorite ? 'var(--color-amber-subtle)' : 'transparent',
            color: isItemFavorite ? 'var(--color-amber)' : 'var(--text-muted)',
            borderRadius: '0',
            border: `1.5px solid ${isItemFavorite ? 'var(--color-amber-medium)' : 'rgba(255,255,255,0.08)'}`,
          }}
          title={isItemFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-label={isItemFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <StarIcon filled={isItemFavorite} />
        </button>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        color: 'var(--text-primary)',
      }}>{item.title}</h2>

      <div style={{ width: '40px', height: '3px', background: 'var(--accent-primary)', margin: '12px 0 8px' }} />

      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: '13px',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
      }}>
        También: {item.aliases.join(', ')}
      </p>

      {item.structureImage && !imageError ? (
        <div
          className="my-6 p-4 flex justify-center items-center min-h-[148px]"
          style={{ background: 'var(--surface-1)', borderRadius: '0', border: '2px solid rgba(255,255,255,0.1)' }}
        >
          <img
            src={item.structureImage}
            alt={`Estructura química de ${item.title}`}
            className="max-h-32 p-1 rounded bg-white"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div
          className="my-6 p-4 flex justify-center items-center min-h-[148px]"
          style={{ background: 'var(--surface-1)', borderRadius: '0', border: '2px solid rgba(255,255,255,0.1)' }}
        >
          <p className="font-mono text-xl tracking-wider select-all" style={{ color: 'var(--text-tertiary)' }}>{item.chemicalFormula}</p>
        </div>
      )}

      <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.content.description}</p>

      <InfoSection title="Efectos" icon={<HeartIcon />} color="var(--text-primary)">
        <div>
          <strong style={{ color: 'var(--color-green)', fontWeight: 600 }}>Positivos:</strong>
          <ul className="list-disc pl-5 mt-1">
            {item.content.effects.positive.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>
        <div className="mt-3">
          <strong style={{ color: 'var(--color-amber)', fontWeight: 600 }}>Negativos:</strong>
          <ul className="list-disc pl-5 mt-1">
            {item.content.effects.negative.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>
      </InfoSection>

      <InfoSection title="Duración" icon={<ClockIcon />} color="var(--text-primary)">
        <p><strong style={{ color: 'var(--text-primary)' }}>Inicio:</strong> {item.content.duration.onset}</p>
        <p><strong style={{ color: 'var(--text-primary)' }}>Pico/Meseta:</strong> {item.content.duration.peak}</p>
        <p><strong style={{ color: 'var(--text-primary)' }}>Total:</strong> {item.content.duration.total}</p>
      </InfoSection>

      <InfoSection title="Dosificación" icon={<ScaleIcon />} color="var(--text-primary)">
        {item.content.dosage.oral && <p><strong style={{ color: 'var(--text-primary)' }}>Oral:</strong> {item.content.dosage.oral}</p>}
        {item.content.dosage.nasal && <p><strong style={{ color: 'var(--text-primary)' }}>Nasal:</strong> {item.content.dosage.nasal}</p>}
        {item.content.dosage.inhalation && <p><strong style={{ color: 'var(--text-primary)' }}>Inhalado:</strong> {item.content.dosage.inhalation}</p>}
        <p
          className="mt-2 text-xs p-3"
          style={{
            color: 'var(--text-secondary)',
            background: 'var(--color-amber-subtle)',
            borderRadius: '0',
            border: '1.5px solid var(--color-amber-medium)',
            borderLeft: '4px solid var(--color-amber)',
          }}
        >
          <strong style={{ color: 'var(--color-amber)', fontWeight: 600 }}>Importante:</strong> {item.content.dosage.warning}
        </p>
      </InfoSection>

      <InfoSection title="Principales Riesgos" icon={<WarningIcon />} color="var(--color-red)">
        <ul className="list-disc pl-5">
          {item.content.risks.map(r => <li key={r}>{r}</li>)}
        </ul>
      </InfoSection>

      <InfoSection title="Pautas de Cuidado" icon={<CheckIcon />} color="var(--color-green)">
        <ul className="space-y-2.5">
          {item.content.guidelines.map((line, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: var(--color-blue)">$1</strong>`) }} />
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Alertas del Mercado" icon={<AlertIcon />} color="var(--color-red)">
        <p>{item.content.alerts}</p>
      </InfoSection>

      <PsychonautWikiInfo substanceName={item.title} />
    </div>
  );
};


export const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<LibraryEntry | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoritesUpdateTrigger, setFavoritesUpdateTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'browse' | 'compare' | 'calculator'>('browse');

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

  const handleFavoriteToggle = () => {
    setFavoritesUpdateTrigger(prev => prev + 1);
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--accent-primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-tertiary)',
    border: active ? '1.5px solid var(--accent-primary)' : '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '0',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
  });

  const actionBtnStyle: React.CSSProperties = {
    background: 'var(--surface-1)',
    color: 'var(--text-secondary)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: '0',
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    width: '100%',
  };

  if (viewMode === 'compare') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-5 sm:p-6 flex items-center justify-between" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>MODO</span>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Comparación</h2>
          </div>
          <button
            onClick={() => setViewMode('browse')}
            className="px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
            style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
          >
            Volver a Biblioteca
          </button>
        </div>
        <CompareSubstances />
      </div>
    );
  }

  if (viewMode === 'calculator') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-5 sm:p-6 flex items-center justify-between" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>HERRAMIENTA</span>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Calculadora de Dosis</h2>
          </div>
          <button
            onClick={() => setViewMode('browse')}
            className="px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
            style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
          >
            Volver a Biblioteca
          </button>
        </div>
        <DoseCalculator />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0">
      {/* Left Pane: Navigation */}
      <div className="w-full md:w-1/3 md:max-w-sm flex flex-col" style={{ borderRight: '2.5px solid rgba(255,255,255,0.12)' }}>
        <div className="p-5 sm:p-6" style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: 'var(--text-muted)' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar sustancia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 pl-10 text-sm"
              style={{
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: 'none',
                borderBottom: '2.5px solid rgba(255,255,255,0.15)',
                borderRadius: '0',
                outline: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
              onFocus={(e) => e.currentTarget.style.borderBottomColor = 'var(--accent-primary)'}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('All')}
              style={btnStyle(selectedCategory === 'All')}
            >
              Todas
            </button>
            {SUBSTANCE_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={btnStyle(selectedCategory === category)}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className="mt-4 transition-all active:scale-[0.98]"
            style={{
              ...actionBtnStyle,
              background: showOnlyFavorites ? 'var(--color-amber-subtle)' : 'var(--surface-1)',
              color: showOnlyFavorites ? 'var(--color-amber)' : 'var(--text-secondary)',
              border: `2px solid ${showOnlyFavorites ? 'var(--color-amber-medium)' : 'rgba(255,255,255,0.1)'}`,
              fontWeight: 700,
            }}
          >
            <StarIcon filled={showOnlyFavorites} />
            {showOnlyFavorites ? 'Mostrar Todas' : 'Solo Favoritos'}
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className="mt-3 transition-all active:scale-[0.98]"
            style={actionBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-violet)'; e.currentTarget.style.color = 'var(--color-violet)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <CompareIcon />
            Comparar Sustancias
          </button>
          <button
            onClick={() => setViewMode('calculator')}
            className="mt-3 transition-all active:scale-[0.98]"
            style={actionBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; e.currentTarget.style.color = 'var(--color-blue)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <CalculatorIcon />
            Calculadora de Dosis
          </button>
        </div>
        <nav className="overflow-y-auto p-5 sm:p-6 h-64 md:h-auto md:flex-1">
          <ul className="space-y-1">
            {filteredLibraryData.map(item => (
              <li key={item.title}>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left text-sm p-3 transition-all duration-200 active:scale-[0.98]"
                  style={{
                    borderRadius: '0',
                    background: selectedItem?.title === item.title ? 'var(--accent-subtle)' : 'transparent',
                    color: selectedItem?.title === item.title ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontWeight: selectedItem?.title === item.title ? 700 : 400,
                    borderLeft: selectedItem?.title === item.title ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedItem?.title !== item.title) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedItem?.title !== item.title) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }
                  }}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right Pane: Detail View */}
      <div className="flex-1 overflow-y-auto">
        {selectedItem ? (
          <LibraryDetailView item={selectedItem} onFavoriteToggle={handleFavoriteToggle} />
        ) : (
          <div className="text-center p-10">
            <p style={{ color: 'var(--text-muted)' }}>No se encontraron resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
};