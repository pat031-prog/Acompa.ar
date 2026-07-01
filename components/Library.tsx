import React, { useState, useMemo, useEffect } from 'react';
import { LIBRARY_DATA, SUBSTANCE_CATEGORIES } from '../constants';
import type { LibraryEntry, SubstanceCategory } from '../types';
import { toggleFavorite, isFavorite, getFavorites } from '../services/favoritesService';
import { CompareSubstances } from './CompareSubstances';
import { PsychonautWikiInfo } from './PsychonautWikiInfo';
import { categoryColor, primaryCategoryColor } from './categoryStyles';
import { Kicker, Display, CoralPanel, DarkCard, DataBlock, RailItem, CircleButton, Pill, fieldStyle } from './ui';
import { Search, Star, Maximize2, ArrowLeft, GitCompare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { listContainer, listItem, detailVariants } from './motion';

const Detail: React.FC<{ item: LibraryEntry; index: number; onFavoriteToggle: () => void; onBack: () => void }> = ({ item, index, onFavoriteToggle, onBack }) => {
  const [fav, setFav] = useState(isFavorite(item.title));
  useEffect(() => { setFav(isFavorite(item.title)); }, [item.title]);
  const toggleFav = () => { toggleFavorite(item.title); setFav(!fav); onFavoriteToggle(); };
  const d = item.content;

  return (
    <CoralPanel className="w-full md:w-2/3 min-h-0 p-6 md:p-12 flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar" style={{ paddingBottom: '120px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.title}
          variants={detailVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="max-w-2xl mx-auto w-full"
        >
          {/* Top row */}
          <div className="flex justify-between items-center mb-8 pt-2 md:pt-0">
            <button onClick={onBack} className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ border: '1px solid rgba(0,0,0,0.15)', color: 'var(--accent-ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <ArrowLeft size={15} /> Volver
            </button>
            <span className="hidden md:inline" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>#{String(index).padStart(2, '0')} · {item.title.slice(0, 3)}</span>
            <CircleButton variant="dark" size={44} onClick={toggleFav} label={fav ? 'Quitar de favoritos' : 'Favorito'}>
              <Star size={19} fill={fav ? 'currentColor' : 'none'} />
            </CircleButton>
          </div>

          {/* Title block */}
          <div className="text-center md:text-left mb-10">
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {item.category.map(cat => (
                <span key={cat} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-ink)', opacity: 0.65 }}>{cat}</span>
              ))}
            </div>
            <Display size="xl" upper color="var(--accent-ink)">{item.title}</Display>
            <p className="mt-4 font-medium" style={{ fontSize: '18px', opacity: 0.82, lineHeight: 1.5 }}>{d.description}</p>
            {item.aliases.length > 0 && (
              <p className="mt-2" style={{ fontSize: '13px', opacity: 0.55, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{item.aliases.join(' · ')}</p>
            )}
          </div>

          {/* Dark data card on the coral */}
          <DarkCard className="p-7 md:p-9">
            <div className="space-y-6">
              <DataBlock label="Duración">
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{d.duration.onset}</span> · {d.duration.peak} · <span style={{ color: 'var(--accent-primary)' }}>{d.duration.total}</span>
                </p>
              </DataBlock>

              <DataBlock label="Efectos">
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-1">
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-green)', marginBottom: '6px' }}>Positivos</p>
                    <ul className="space-y-1">{d.effects.positive.map(e => <li key={e} className="text-sm" style={{ color: 'var(--text-secondary)' }}>· {e}</li>)}</ul>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-amber)', marginBottom: '6px' }}>Negativos</p>
                    <ul className="space-y-1">{d.effects.negative.map(e => <li key={e} className="text-sm" style={{ color: 'var(--text-secondary)' }}>· {e}</li>)}</ul>
                  </div>
                </div>
              </DataBlock>

              <DataBlock label="Dosificación">
                <ul className="space-y-1 mt-1">
                  {d.dosage.oral && <li className="text-sm" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Oral</span> — {d.dosage.oral}</li>}
                  {d.dosage.nasal && <li className="text-sm" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Nasal</span> — {d.dosage.nasal}</li>}
                  {d.dosage.inhalation && <li className="text-sm" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Inhalado</span> — {d.dosage.inhalation}</li>}
                </ul>
                {d.dosage.warning && <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--color-amber)' }}>⚠ {d.dosage.warning}</p>}
              </DataBlock>

              <DataBlock label="Riesgos" color="var(--color-red)">
                <ul className="space-y-1 mt-1">{d.risks.map(r => <li key={r} className="text-sm" style={{ color: 'var(--text-secondary)' }}>· {r}</li>)}</ul>
              </DataBlock>

              <div className="pt-5" style={{ borderTop: '1px solid var(--border-medium)' }}>
                <DataBlock label={<span className="flex items-center gap-2"><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} /> Reducción de daños</span>}>
                  <ul className="space-y-2.5 mt-2">
                    {d.guidelines.map((g, i) => (
                      <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }} dangerouslySetInnerHTML={{ __html: '- ' + g.replace(/\*\*(.*?)\*\*/g, `<strong style="color: var(--text-secondary); font-weight:600">$1</strong>`) }} />
                    ))}
                  </ul>
                </DataBlock>
              </div>

              {d.alerts && (
                <DataBlock label="Alertas del mercado" color="var(--color-red)">
                  <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>{d.alerts}</p>
                </DataBlock>
              )}
            </div>
          </DarkCard>

          <div className="mt-6">
            <PsychonautWikiInfo substanceName={item.title} />
          </div>
        </motion.div>
      </AnimatePresence>
    </CoralPanel>
  );
};

export const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<LibraryEntry | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favTrigger, setFavTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'browse' | 'compare'>('browse');
  const [mobileDetail, setMobileDetail] = useState(false);

  const filtered = useMemo(() => {
    let data = LIBRARY_DATA;
    if (showOnlyFavorites) { const f = getFavorites(); data = data.filter(i => f.includes(i.title)); }
    if (selectedCategory !== 'All') data = data.filter(i => i.category.includes(selectedCategory));
    if (searchTerm) { const l = searchTerm.toLowerCase(); data = data.filter(i => `${i.title} ${i.aliases.join(' ')}`.toLowerCase().includes(l)); }
    return data;
  }, [searchTerm, selectedCategory, showOnlyFavorites, favTrigger]);

  useEffect(() => {
    if (!selectedItem || !filtered.some(i => i.title === selectedItem.title)) {
      setSelectedItem(filtered.length > 0 ? filtered[0] : null);
    }
  }, [filtered, selectedItem]);

  const select = (item: LibraryEntry) => { setSelectedItem(item); setMobileDetail(true); };

  if (viewMode === 'compare') {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex items-center justify-between px-6 md:px-10 pt-8 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <Kicker className="mb-2">Comparación</Kicker>
            <Display size="md" upper>Comparar sustancias</Display>
          </div>
          <CircleButton variant="surface" size={44} onClick={() => setViewMode('browse')} label="Cerrar"><X size={19} /></CircleButton>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: '100px' }}><CompareSubstances /></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ── List rail ── */}
      <div className={`w-full md:w-1/3 min-h-0 flex-1 md:flex-none flex-col p-6 md:p-10 relative ${mobileDetail ? 'hidden md:flex' : 'flex'}`} style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-6">
          <Kicker>Biblioteca</Kicker>
          <button onClick={() => setViewMode('compare')} title="Comparar" style={{ color: 'var(--accent-primary)' }}><GitCompare size={22} /></button>
        </div>

        <div className="relative mb-4">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: 'var(--text-muted)' }}><Search size={16} /></span>
          <input
            type="text" placeholder="Buscar sustancia o alias..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...fieldStyle, paddingLeft: '42px' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Pill active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')}>Todas</Pill>
          {SUBSTANCE_CATEGORIES.map(c => (
            <Pill key={c} color={categoryColor(c)} active={selectedCategory === c} onClick={() => setSelectedCategory(c)}>{c}</Pill>
          ))}
          <Pill color="var(--color-amber)" active={showOnlyFavorites} onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}>★ Favoritos</Pill>
        </div>

        <motion.div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pt-3" style={{ paddingBottom: '120px' }} variants={listContainer} initial="initial" animate="animate">
          {filtered.length === 0 ? (
            <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>Sin resultados.</p>
          ) : (
            filtered.map(item => (
              <motion.div variants={listItem} key={item.title}>
                <RailItem active={selectedItem?.title === item.title} onClick={() => select(item)} layoutId="library-pill">
                  {item.title}
                </RailItem>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* ── Detail (coral) ── */}
      <div className={`w-full md:w-2/3 min-h-0 flex-1 md:flex-none ${mobileDetail ? 'flex' : 'hidden md:flex'}`}>
        {selectedItem ? (
          <Detail item={selectedItem} index={LIBRARY_DATA.findIndex(s => s.title === selectedItem.title) + 1} onFavoriteToggle={() => setFavTrigger(v => v + 1)} onBack={() => setMobileDetail(false)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10" style={{ color: 'var(--text-muted)' }}>
            <Maximize2 size={28} /><p className="mt-4">Elegí una sustancia.</p>
          </div>
        )}
      </div>
    </div>
  );
};
