
import React, { useState, useMemo } from 'react';
import { MAP_DATA } from '../constants';
import type { MapDataset } from '../types';
import { ArgentinaMap } from './ArgentinaMap';
import { PageHeader, InlineNote, Kicker, Display, DataList, IndexNum, Orb, fieldStyle, tint } from './ui';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

/** Section medallion glyph — a stroked globe with meridian/parallel. */
const GlobeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9s1.3-6.6 3.8-9Z" />
  </svg>
);

const SAGE = 'var(--accent-primary)';
// Warm terracotta, cohesive with the choropleth ramp's bright-coral top stop.
const TERRACOTTA = '#EC936E';

/** Ruled province list row: name + coral value bar (∝ value/max) + number. */
const ProvinceRow: React.FC<{ name: string; data: MapDataset; isSelected: boolean; onClick: () => void; maxQueries: number; first?: boolean }> = ({ name, data, isSelected, onClick, maxQueries, first }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 py-3.5 text-left transition-colors duration-150"
    style={{
      borderTop: first ? 'none' : '1px solid var(--border-subtle)',
      background: isSelected ? tint(SAGE, 'subtle') : 'transparent',
      paddingLeft: '10px',
      paddingRight: '10px',
    }}
    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--surface-1)'; }}
    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
  >
    <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500, color: isSelected ? SAGE : 'var(--text-secondary)', flex: 1, minWidth: 0 }}>{name}</span>
    <div className="flex items-center gap-3 flex-shrink-0">
      <div style={{ width: '56px', height: '3px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(6, (data.totalQueries / maxQueries) * 100)}%`, height: '100%', background: SAGE }} />
      </div>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, color: isSelected ? SAGE : 'var(--text-primary)', minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{data.totalQueries}</span>
    </div>
  </button>
);

/** Active-province detail: Kicker + Display + label:value stats (totals + categories). */
const ProvinceDetail: React.FC<{ name: string; data: MapDataset; isTop?: boolean }> = ({ name, data, isTop }) => (
  <div className="px-5 sm:px-7 py-8" style={{ animation: 'fadeInUp 0.25s var(--ease-out-strong) both' }}>
    <Kicker className="mb-4">Provincia seleccionada</Kicker>
    <div className="flex items-center gap-4">
      {isTop && <Orb color={TERRACOTTA} size={44} />}
      <Display size="md" upper>{name}</Display>
    </div>

    <div className="mt-6">
      <DataList
        items={[
          { label: 'Consultas totales', value: data.totalQueries.toLocaleString('es-AR'), accent: SAGE },
          ...data.topCategories.map(cat => ({
            label: cat.category,
            value: (
              <div className="flex items-center justify-end gap-3">
                <div style={{ width: '64px', height: '3px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percentage}%`, height: '100%', background: SAGE }} />
                </div>
                <span style={{ minWidth: '38px', textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' }}>{cat.percentage}%</span>
              </div>
            ),
          })),
        ]}
      />
    </div>

    {data.topCategories.length === 0 && (
      <div className="mt-5">
        <InlineNote>
          No hay suficientes datos de categorías para esta provincia.
        </InlineNote>
      </div>
    )}
  </div>
);

export const Observatory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const provinceData = useMemo(() => {
    const dataArray = Object.entries(MAP_DATA)
      .map(([provinceName, data]) => ({ provinceName, data }))
      .sort((a, b) => b.data.totalQueries - a.data.totalQueries);
    if (!searchTerm) return dataArray;
    const lowercasedFilter = searchTerm.toLowerCase();
    return dataArray.filter(({ provinceName }) => provinceName.toLowerCase().includes(lowercasedFilter));
  }, [searchTerm]);

  const maxQueries = useMemo(() => Math.max(1, ...Object.values(MAP_DATA).map(d => d.totalQueries)), []);

  // Highest-volume province — surfaced as a small terracotta Orb identity.
  const topProvince = useMemo(() => {
    const entries = Object.entries(MAP_DATA);
    if (entries.length === 0) return null;
    return entries.reduce((best, cur) => (cur[1].totalQueries > best[1].totalQueries ? cur : best))[0];
  }, []);

  // Warm terracotta sequential ramp (deep ember → bright coral) — cohesive
  // with the editorial palette. Solid colours, not alpha-over-canvas.
  const rampColor = (intensity: number): string => {
    const lo = [0x2A, 0x1B, 0x15]; // #2A1B15 deep ember
    const hi = [0xEC, 0x93, 0x6E]; // #EC936E bright coral
    const t = Math.pow(Math.min(1, Math.max(0, intensity)), 0.8);
    const c = lo.map((l, i) => Math.round(l + (hi[i] - l) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  };

  const getFill = (provinceName: string): string => {
    const data = MAP_DATA[provinceName];
    if (!data) return '#1D1712'; // no-data: near-canvas warm neutral
    return rampColor(data.totalQueries / maxQueries);
  };

  // Top provinces get a value label drawn on the map (skip CABA — too small,
  // its centroid overlaps Buenos Aires).
  const topLabels = useMemo(() =>
    Object.entries(MAP_DATA)
      .filter(([name]) => name !== 'Ciudad Autónoma de Buenos Aires')
      .sort((a, b) => b[1].totalQueries - a[1].totalQueries)
      .slice(0, 5)
      .map(([name, d]) => ({ name, text: d.totalQueries.toLocaleString('es-AR') })),
  []);

  const activeName = hovered || selected;
  const activeData = activeName ? MAP_DATA[activeName] : null;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header — coral globe medallion beside the title */}
      <PageHeader
        eyebrow="Observatorio territorial"
        title="Mapa epidemiológico anónimo"
        description="Datos agregados y anónimos de consultas por provincia. Cuanto más intenso el color, mayor el volumen de consultas registradas."
        accent={SAGE}
        icon={<GlobeIcon />}
      />
      <div className="px-5 sm:px-7 lg:px-8 pt-7 pb-1">
        <InlineNote label="Nota">
          Los datos mostrados son actualmente figurativos e inventados. Representan la visión a futuro de lo que Acompañ.Ar aspira a ser: una herramienta de mapeo epidemiológico anónimo en tiempo real para informar políticas públicas de salud preventiva.
        </InlineNote>
      </div>

      {/* Map + Panel */}
      <section className="flex-1 flex flex-col lg:flex-row min-h-0 mt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {/* Map — kept big and central */}
        <div className="lg:w-[48%] flex-shrink-0 flex items-center justify-center px-6 py-12 relative" style={{ borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
          <div style={{ height: 'min(70vh, 560px)', aspectRatio: '0.49', maxWidth: '100%' }}>
            <ArgentinaMap
              getFill={getFill}
              onProvinceHover={setHovered}
              onProvinceClick={(name) => setSelected(prev => prev === name ? null : name)}
              hoveredProvince={hovered}
              selectedProvince={selected}
              labels={topLabels}
            />
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-6 sm:left-8 flex items-center gap-2.5">
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Menos</span>
            <div style={{ display: 'flex', width: '72px', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
              {[0.05, 0.3, 0.55, 0.8, 1].map((a, i) => (
                <div key={i} style={{ flex: 1, background: rampColor(a) }} />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Más</span>
          </div>
        </div>

        {/* Side panel: detail or list */}
        <div className="flex-1 min-h-0 flex flex-col">
          {activeData && activeName ? (
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <ProvinceDetail name={activeName} data={activeData} isTop={activeName === topProvince} />
            </div>
          ) : null}

          <div className="px-5 sm:px-7 py-8">
            {/* Search field */}
            <div className="relative mb-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: 'var(--text-muted)' }}>
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Buscar provincia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...fieldStyle, paddingLeft: '38px' }}
                onFocus={(e) => e.currentTarget.style.borderColor = SAGE}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
              />
            </div>

            {provinceData.length > 0 ? (
              <div>
                {provinceData.map(({ provinceName, data }, idx) => (
                  <ProvinceRow
                    key={provinceName}
                    name={provinceName}
                    data={data}
                    first={idx === 0}
                    isSelected={selected === provinceName}
                    onClick={() => setSelected(prev => prev === provinceName ? null : provinceName)}
                    maxQueries={maxQueries}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-14 gap-3">
                <IndexNum size={40} color="var(--accent-weak)">00</IndexNum>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No se encontraron resultados para "{searchTerm}".</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
