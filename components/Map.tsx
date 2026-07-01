import React, { useState, useMemo } from 'react';
import { MAP_DATA } from '../constants';
import { ArgentinaMap } from './ArgentinaMap';
import { Kicker, Display, DarkCard, DataBlock, RailItem, MonoLabel } from './ui';
import { motion, AnimatePresence } from 'motion/react';
import { listContainer, listItem, detailVariants } from './motion';
import { Globe, Search } from 'lucide-react';

export const Observatory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const provinceData = useMemo(() => {
    const arr = Object.entries(MAP_DATA)
      .map(([provinceName, data]) => ({ provinceName, data }))
      .sort((a, b) => b.data.totalQueries - a.data.totalQueries);
    if (!searchTerm) return arr;
    const l = searchTerm.toLowerCase();
    return arr.filter(({ provinceName }) => provinceName.toLowerCase().includes(l));
  }, [searchTerm]);

  const maxQueries = useMemo(() => Math.max(1, ...Object.values(MAP_DATA).map(d => d.totalQueries)), []);
  const totalAll = useMemo(() => Object.values(MAP_DATA).reduce((s, d) => s + d.totalQueries, 0), []);

  const rampColor = (intensity: number): string => {
    const lo = [0x2A, 0x1B, 0x15];
    const hi = [0xEC, 0x93, 0x6E];
    const t = Math.pow(Math.min(1, Math.max(0, intensity)), 0.8);
    const c = lo.map((v, i) => Math.round(v + (hi[i] - v) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  };

  const getFill = (provinceName: string): string => {
    const data = MAP_DATA[provinceName];
    if (!data) return '#1D1712';
    return rampColor(data.totalQueries / maxQueries);
  };

  const topLabels = useMemo(() =>
    Object.entries(MAP_DATA)
      .filter(([name]) => name !== 'Ciudad Autónoma de Buenos Aires')
      .sort((a, b) => b[1].totalQueries - a[1].totalQueries)
      .slice(0, 5)
      .map(([name, d]) => ({ name, text: d.totalQueries.toLocaleString('es-AR') })),
  []);

  const activeName = hovered || selected;
  const activeData = activeName ? MAP_DATA[activeName] : null;
  // The detail card is driven by the *clicked* province only, so moving the
  // cursor over the map doesn't remount/flicker it.
  const selData = selected ? MAP_DATA[selected] : null;

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-y-auto md:overflow-hidden min-h-0" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Rail: ranking ── */}
      <div className="w-full md:w-1/3 flex-col p-6 md:p-10 relative flex" style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-6">
          <Kicker>Observatorio</Kicker>
          <span style={{ color: 'var(--accent-primary)' }}><Globe size={22} /></span>
        </div>
        <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>Datos figurativos: la visión a futuro de un mapeo epidemiológico anónimo en tiempo real.</p>

        <div className="relative mb-4">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: 'var(--text-muted)' }}><Search size={16} /></span>
          <input
            type="text" placeholder="Buscar provincia…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'var(--surface-1)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-pill)', outline: 'none', width: '100%', padding: '10px 16px 10px 42px', fontSize: '14px' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
          />
        </div>

        <motion.div className="flex flex-col gap-3 flex-1 md:min-h-0 overflow-y-auto no-scrollbar pt-2 md:pb-[120px]" variants={listContainer} initial="initial" animate="animate">
          {provinceData.length === 0 ? (
            <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>Sin resultados.</p>
          ) : (
            provinceData.map(({ provinceName, data }) => (
              <motion.div variants={listItem} key={provinceName}>
                <RailItem
                  active={selected === provinceName}
                  onClick={() => setSelected(prev => prev === provinceName ? null : provinceName)}
                  layoutId="obs-pill"
                  sub={`${data.totalQueries.toLocaleString('es-AR')} consultas`}
                >
                  {provinceName}
                </RailItem>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* ── Detail (coral): map card + stats ── */}
      <div className="w-full md:w-2/3 flex">
        <div className="w-full p-6 md:p-12 flex flex-col overflow-y-auto no-scrollbar rounded-t-[3rem] md:rounded-l-[4rem] md:rounded-tr-none" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', paddingBottom: '120px' }}>
          <div className="max-w-2xl mx-auto w-full">
            <div className="text-center md:text-left mb-8">
              <div className="mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-ink)', opacity: 0.65 }}>Mapa epidemiológico anónimo</div>
              <Display size="lg" upper color="var(--accent-ink)">{activeName || 'Argentina'}</Display>
              <p className="mt-3 font-medium" style={{ fontSize: '15px', opacity: 0.82 }}>{activeData ? `${activeData.totalQueries.toLocaleString('es-AR')} consultas registradas` : `${totalAll.toLocaleString('es-AR')} consultas en todo el país`}</p>
            </div>

            {/* Map framed in a dark card (its native dark canvas) */}
            <DarkCard className="p-6 md:p-8 mb-6">
              <div className="flex items-center justify-center relative">
                <div style={{ height: 'min(52vh, 460px)', aspectRatio: '0.49', maxWidth: '100%' }}>
                  <ArgentinaMap
                    getFill={getFill}
                    onProvinceHover={setHovered}
                    onProvinceClick={(name) => setSelected(prev => prev === name ? null : name)}
                    hoveredProvince={hovered}
                    selectedProvince={selected}
                    labels={topLabels}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5 mt-4">
                <MonoLabel color="var(--text-muted)">Menos</MonoLabel>
                <div style={{ display: 'flex', width: '84px', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
                  {[0.05, 0.3, 0.55, 0.8, 1].map((a, i) => <div key={i} style={{ flex: 1, background: rampColor(a) }} />)}
                </div>
                <MonoLabel color="var(--text-muted)">Más</MonoLabel>
              </div>
            </DarkCard>

            {/* Stats card */}
            {selData ? (
              <AnimatePresence mode="wait">
                <motion.div key={selected} variants={detailVariants} initial="initial" animate="animate" exit="exit">
                  <DarkCard className="p-7 md:p-9">
                    <div className="space-y-6">
                      <DataBlock label="Consultas totales">
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--accent-primary)', lineHeight: 1 }}>{selData.totalQueries.toLocaleString('es-AR')}</p>
                      </DataBlock>
                      {selData.topCategories.length > 0 ? (
                        <DataBlock label="Categorías principales">
                          <div className="mt-2 space-y-3">
                            {selData.topCategories.map((cat) => (
                              <div key={cat.category} className="flex items-center gap-3">
                                <span className="text-sm flex-1 min-w-0" style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
                                <div style={{ width: '90px', height: '4px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
                                  <div style={{ width: `${cat.percentage}%`, height: '100%', background: 'var(--accent-primary)' }} />
                                </div>
                                <span style={{ minWidth: '40px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </DataBlock>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sin datos de categorías para esta provincia.</p>
                      )}
                    </div>
                  </DarkCard>
                </motion.div>
              </AnimatePresence>
            ) : (
              <DarkCard className="p-7 md:p-9">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Tocá una provincia en el mapa —o elegila en la lista— para ver el detalle de consultas por categoría.</p>
              </DarkCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
