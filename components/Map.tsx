
import React, { useState, useMemo } from 'react';
import { MAP_DATA } from '../constants';
import type { MapDataset } from '../types';
import { ArgentinaMap } from './ArgentinaMap';
import { PageHeader, Callout } from './ui';
import { withAlpha } from './categoryStyles';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

const SAGE = 'var(--accent-secondary)';

const ProvinceRow: React.FC<{ name: string; data: MapDataset; isSelected: boolean; onClick: () => void; maxQueries: number }> = ({ name, data, isSelected, onClick, maxQueries }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
    style={{
      background: isSelected ? 'var(--accent-secondary-subtle)' : 'transparent',
      border: `1px solid ${isSelected ? 'var(--accent-secondary-medium)' : 'transparent'}`,
      borderRadius: 'var(--radius-md)',
    }}
    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--surface-hover)'; }}
    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
  >
    <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', flex: 1 }}>{name}</span>
    <div className="flex items-center gap-2">
      <div style={{ width: '48px', height: '4px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(6, (data.totalQueries / maxQueries) * 100)}%`, height: '100%', background: SAGE }} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', minWidth: '32px', textAlign: 'right' }}>{data.totalQueries}</span>
    </div>
  </button>
);

const ProvinceDetail: React.FC<{ name: string; data: MapDataset }> = ({ name, data }) => (
  <div className="p-5 sm:p-6" style={{ animation: 'fadeInUp 0.25s var(--ease-out-strong) both' }}>
    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: SAGE }}>Provincia seleccionada</p>
    <h3 className="mt-1" style={{ fontFamily: 'var(--font-editorial)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{name}</h3>
    <p className="mt-2" style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
      Consultas totales: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.totalQueries.toLocaleString('es-AR')}</span>
    </p>

    {data.topCategories.length > 0 ? (
      <div className="mt-5 space-y-3">
        <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Categorías principales</h4>
        {data.topCategories.map(cat => (
          <div key={cat.category}>
            <div className="flex justify-between mb-1.5" style={{ fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{cat.percentage}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
              <div style={{ width: `${cat.percentage}%`, height: '100%', background: `linear-gradient(90deg, ${SAGE}, var(--accent-primary))`, borderRadius: '999px' }} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-5" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No hay suficientes datos de categorías para esta provincia.</p>
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

  const getFill = (provinceName: string): string => {
    const data = MAP_DATA[provinceName];
    if (!data) return 'var(--surface-2)';
    const intensity = Math.min(1, data.totalQueries / maxQueries);
    return withAlpha('#7C9885', 0.18 + intensity * 0.72);
  };

  const activeName = hovered || selected;
  const activeData = activeName ? MAP_DATA[activeName] : null;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Header */}
      <PageHeader
        eyebrow="Observatorio territorial"
        title="Mapa epidemiológico anónimo"
        description="Datos agregados y anónimos de consultas por provincia. Cuanto más intenso el color, mayor el volumen de consultas registradas."
        accent={SAGE}
      />
      <div className="px-5 sm:px-7 lg:px-8 pt-4">
        <Callout accent="var(--accent-secondary)">
          <strong style={{ color: 'var(--text-primary)' }}>Nota:</strong> Los datos mostrados son actualmente figurativos e inventados. Representan la visión a futuro de lo que Acompañ.Ar aspira a ser: una herramienta de mapeo epidemiológico anónimo en tiempo real para informar políticas públicas de salud preventiva.
        </Callout>
      </div>

      {/* Map + Panel */}
      <section className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Map */}
        <div className="lg:w-[46%] flex-shrink-0 flex items-center justify-center p-6 sm:p-8 relative" style={{ borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
          <div className="w-full max-w-[340px]" style={{ aspectRatio: '0.49' }}>
            <ArgentinaMap
              getFill={getFill}
              onProvinceHover={setHovered}
              onProvinceClick={(name) => setSelected(prev => prev === name ? null : name)}
              hoveredProvince={hovered}
              selectedProvince={selected}
            />
          </div>

          {/* Legend */}
          <div className="absolute bottom-5 left-6 sm:left-8 flex items-center gap-2">
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menos</span>
            <div style={{ display: 'flex', width: '64px', height: '8px', borderRadius: '999px', overflow: 'hidden' }}>
              {[0.18, 0.35, 0.52, 0.69, 0.9].map((a, i) => (
                <div key={i} style={{ flex: 1, background: withAlpha('#7C9885', a) }} />
              ))}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Más</span>
          </div>
        </div>

        {/* Side panel: detail or list */}
        <div className="flex-1 min-h-0 flex flex-col">
          {activeData && activeName ? (
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <ProvinceDetail name={activeName} data={activeData} />
            </div>
          ) : null}

          <div className="p-5 sm:p-6">
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: 'var(--text-muted)' }}>
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Buscar provincia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-9 pr-3 text-sm"
                style={{
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = SAGE}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              />
            </div>

            {provinceData.length > 0 ? (
              <div className="space-y-1">
                {provinceData.map(({ provinceName, data }) => (
                  <ProvinceRow
                    key={provinceName}
                    name={provinceName}
                    data={data}
                    isSelected={selected === provinceName}
                    onClick={() => setSelected(prev => prev === provinceName ? null : provinceName)}
                    maxQueries={maxQueries}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No se encontraron resultados para "{searchTerm}".</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
