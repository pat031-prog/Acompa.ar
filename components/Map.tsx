
import React, { useState, useMemo } from 'react';
import { MAP_DATA } from '../constants';
import type { MapDataset } from '../types';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

interface ProvinceCardProps {
  provinceName: string;
  data: MapDataset;
}

const ProvinceCard: React.FC<ProvinceCardProps> = ({ provinceName, data }) => (
  <div
    className="p-4 transition-all duration-200"
    style={{
      background: 'var(--surface-1)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-ambient)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>{provinceName}</h4>
    <div className="mt-3">
      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Consultas totales: <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>{data.totalQueries.toLocaleString('es-AR')}</span></p>
    </div>
    <div className="mt-4">
      <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Categorías principales:</h5>
      {data.topCategories.length > 0 ? (
        <ul className="space-y-3">
          {data.topCategories.map(cat => (
            <li key={cat.category}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-tertiary)' }}>{cat.category}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{cat.percentage}%</span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: 'var(--surface-3)' }}>
                <div className="h-1.5 rounded-full" style={{ width: `${cat.percentage}%`, background: 'var(--accent-primary)' }}></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No hay suficientes datos de categorías para esta provincia.</p>
      )}
    </div>
  </div>
);

export const Observatory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const provinceData = useMemo(() => {
    const dataArray = Object.entries(MAP_DATA)
      .map(([provinceName, data]) => ({ provinceName, data }))
      .sort((a, b) => b.data.totalQueries - a.data.totalQueries);
    if (!searchTerm) return dataArray;
    const lowercasedFilter = searchTerm.toLowerCase();
    return dataArray.filter(({ provinceName }) => provinceName.toLowerCase().includes(lowercasedFilter));
  }, [searchTerm]);

  return (
    <div className="flex-1 overflow-y-auto pb-4 flex flex-col p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>Observatorio Territorial Anónimo</h3>
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Datos agregados y anónimos de consultas por provincia, ordenados por cantidad.
        </p>
      </div>

      <div className="relative mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: 'var(--text-muted)' }}>
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Buscar provincia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 text-sm"
          style={{
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {provinceData.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {provinceData.map(({ provinceName, data }) => (
              <ProvinceCard key={provinceName} provinceName={provinceName} data={data} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p style={{ color: 'var(--text-muted)' }}>No se encontraron resultados para "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};