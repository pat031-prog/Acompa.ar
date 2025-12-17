import React, { useState, useMemo, useEffect } from 'react';
import { LIBRARY_DATA, SUBSTANCE_CATEGORIES } from '../constants';
import type { LibraryEntry, SubstanceCategory } from '../types';
import { toggleFavorite, isFavorite, getFavorites } from '../services/favoritesService';
import { CompareSubstances } from './CompareSubstances';
import { PsychonautWikiInfo } from './PsychonautWikiInfo';
import DoseCalculator from './DoseCalculator';
import { Callout, Chip } from './ui/Section';

// --- Icon Components ---
const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
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

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
    style={{
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: `transform var(--t-fast) var(--ease)`
    }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// Accordion component for detail sections
interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
        style={{ transition: `all var(--t-fast) var(--ease)` }}
      >
        <h3
          className="text-base font-semibold"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h3>
        <ChevronIcon open={isOpen} />
      </button>
      {isOpen && (
        <div
          className="editorial pb-6 text-sm leading-relaxed space-y-3"
          style={{
            color: 'var(--muted)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Detail View with new pattern
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
    <div
      className="p-6 sm:p-8 lg:p-10"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2
            className="text-2xl sm:text-3xl font-semibold"
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-heading)'
            }}
          >
            {item.title}
          </h2>
          <p
            className="editorial text-sm mt-2"
            style={{ color: 'var(--muted)' }}
          >
            También conocido como: {item.aliases.join(', ')}
          </p>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="flex-shrink-0 p-2 rounded-lg active:scale-95"
          style={{
            background: isItemFavorite ? 'var(--accent-weak)' : 'var(--surface-1)',
            color: isItemFavorite ? 'var(--accent)' : 'var(--muted)',
            transition: `all var(--t-fast) var(--ease)`
          }}
          title={isItemFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <StarIcon filled={isItemFavorite} />
        </button>
      </div>

      {/* At a glance chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Chip label={`Inicio: ${item.content.duration.onset}`} />
        <Chip label={`Duración: ${item.content.duration.total}`} />
        <Chip label={item.category.join(', ')} />
      </div>

      {/* Chemical structure or formula */}
      {item.structureImage && !imageError ? (
        <div
          className="my-6 p-4 rounded-lg flex justify-center items-center border min-h-[148px]"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'var(--border)'
          }}
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
          className="my-6 p-4 rounded-lg flex justify-center items-center border min-h-[148px]"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--border)'
          }}
        >
          <p
            className="font-mono text-xl tracking-wider select-all"
            style={{ color: 'var(--muted)' }}
          >
            {item.chemicalFormula}
          </p>
        </div>
      )}

      {/* Description */}
      <p
        className="editorial text-base leading-relaxed mb-8"
        style={{ color: 'var(--text)' }}
      >
        {item.content.description}
      </p>

      {/* Accordions for detailed information */}
      <div className="space-y-0">
        <Accordion title="Efectos" defaultOpen={true}>
          <div>
            <strong style={{ color: '#6ee7b7' }}>Positivos:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {item.content.effects.positive.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <strong style={{ color: '#fbbf24' }}>Negativos:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {item.content.effects.negative.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </Accordion>

        <Accordion title="Dosificación">
          {item.content.dosage.oral && (
            <p><strong>Oral:</strong> {item.content.dosage.oral}</p>
          )}
          {item.content.dosage.nasal && (
            <p><strong>Nasal:</strong> {item.content.dosage.nasal}</p>
          )}
          {item.content.dosage.inhalation && (
            <p><strong>Inhalado:</strong> {item.content.dosage.inhalation}</p>
          )}
          <Callout variant="warning" icon="⚠️">
            <strong>Importante:</strong> {item.content.dosage.warning}
          </Callout>
        </Accordion>

        <Accordion title="Duración completa">
          <p><strong>Inicio:</strong> {item.content.duration.onset}</p>
          <p><strong>Pico/Meseta:</strong> {item.content.duration.peak}</p>
          <p><strong>Total:</strong> {item.content.duration.total}</p>
        </Accordion>

        <Accordion title="Principales Riesgos">
          <Callout variant="warning" icon="🚨">
            <ul className="list-disc pl-5 space-y-1">
              {item.content.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Callout>
        </Accordion>

        <Accordion title="Pautas de Cuidado">
          <ul className="space-y-2.5">
            {item.content.guidelines.map((line, index) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{
                  __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent)">$1</strong>')
                }}
              />
            ))}
          </ul>
        </Accordion>

        <Accordion title="Alertas del Mercado">
          <Callout variant="warning" icon="📢">
            {item.content.alerts}
          </Callout>
        </Accordion>
      </div>

      {/* PsychonautWiki additional information */}
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

  // Compare mode
  if (viewMode === 'compare') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div
          className="border-b px-6 py-4 flex items-center justify-between"
          style={{
            background: 'var(--bg)',
            borderColor: 'var(--border)'
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            Modo Comparación
          </h2>
          <button
            onClick={() => setViewMode('browse')}
            className="px-3 py-1.5 text-sm rounded-lg"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--muted)',
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            Volver a Biblioteca
          </button>
        </div>
        <CompareSubstances />
      </div>
    );
  }

  // Calculator mode
  if (viewMode === 'calculator') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div
          className="border-b px-6 py-4 flex items-center justify-between"
          style={{
            background: 'var(--bg)',
            borderColor: 'var(--border)'
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            Calculadora de Dosis
          </h2>
          <button
            onClick={() => setViewMode('browse')}
            className="px-3 py-1.5 text-sm rounded-lg"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--muted)',
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            Volver a Biblioteca
          </button>
        </div>
        <DoseCalculator />
      </div>
    );
  }

  // Browse mode - Split View Knowledge Browser
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Left column: Search and substance list */}
      <div
        className="w-full lg:w-80 xl:w-96 flex flex-col border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Search and filters */}
        <div
          className="p-5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Search input */}
          <div className="relative mb-4">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              style={{ color: 'var(--muted)' }}
            >
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar sustancia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 pl-10 text-sm rounded-lg border focus:outline-none"
              style={{
                background: 'var(--surface-1)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                transition: `all var(--t-fast) var(--ease)`
              }}
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Chip
              label="Todas"
              active={selectedCategory === 'All'}
              onClick={() => setSelectedCategory('All')}
            />
            {SUBSTANCE_CATEGORIES.map(category => (
              <Chip
                key={category}
                label={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className="w-full px-3 py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 border active:scale-[0.98]"
            style={{
              background: showOnlyFavorites ? 'var(--surface-3)' : 'var(--surface-1)',
              borderColor: 'var(--border)',
              color: showOnlyFavorites ? 'var(--text)' : 'var(--muted)',
              fontWeight: showOnlyFavorites ? 500 : 400,
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            <StarIcon filled={showOnlyFavorites} />
            {showOnlyFavorites ? 'Mostrar Todas' : 'Solo Favoritos'}
          </button>

          {/* Tools */}
          <div className="space-y-2 mt-4">
            <button
              onClick={() => setViewMode('compare')}
              className="w-full px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2 border active:scale-[0.98]"
              style={{
                background: 'var(--surface-1)',
                borderColor: 'var(--border)',
                color: 'var(--muted)',
                transition: `all var(--t-fast) var(--ease)`
              }}
            >
              <CompareIcon />
              Comparar
            </button>
            <button
              onClick={() => setViewMode('calculator')}
              className="w-full px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2 border active:scale-[0.98]"
              style={{
                background: 'var(--surface-1)',
                borderColor: 'var(--border)',
                color: 'var(--muted)',
                transition: `all var(--t-fast) var(--ease)`
              }}
            >
              <CalculatorIcon />
              Calculadora
            </button>
          </div>
        </div>

        {/* Substance list */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {filteredLibraryData.map((item, idx) => (
              <li
                key={item.title}
                style={{
                  animation: `fadeIn 0.2s ease-out ${idx * 0.02}s both`
                }}
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left text-sm px-3 py-2.5 rounded-lg active:scale-[0.99]"
                  style={{
                    background: selectedItem?.title === item.title ? 'var(--surface-3)' : 'transparent',
                    color: selectedItem?.title === item.title ? 'var(--text)' : 'var(--muted)',
                    fontWeight: selectedItem?.title === item.title ? 500 : 400,
                    borderLeft: selectedItem?.title === item.title ? `2px solid var(--accent)` : '2px solid transparent',
                    transition: `all var(--t-fast) var(--ease)`
                  }}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right column: Detail preview panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedItem ? (
          <LibraryDetailView item={selectedItem} onFavoriteToggle={handleFavoriteToggle} />
        ) : (
          <div className="flex items-center justify-center h-full p-10">
            <p className="editorial text-center" style={{ color: 'var(--muted)' }}>
              No se encontraron sustancias. Intentá ajustar los filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
