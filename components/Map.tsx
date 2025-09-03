
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

const ProvinceCard: React.FC<ProvinceCardProps> = ({ provinceName, data }) => {
  return (
    <div className="bg-[#1b1d21] p-4 rounded-lg border border-[#2a2d33]">
      <h4 className="font-bold text-gray-100">{provinceName}</h4>
      <div className="mt-3">
        <p className="text-sm text-gray-400">Consultas totales: <span className="font-bold text-gray-200">{data.totalQueries.toLocaleString('es-AR')}</span></p>
      </div>
      <div className="mt-4">
        <h5 className="text-sm font-semibold text-gray-300 mb-2">Categorías principales:</h5>
        {data.topCategories.length > 0 ? (
          <ul className="space-y-3">
            {data.topCategories.map(cat => (
              <li key={cat.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{cat.category}</span>
                  <span className="text-gray-300">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-600/50 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No hay suficientes datos de categorías para esta provincia.</p>
        )}
      </div>
    </div>
  );
};

export const Observatory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const provinceData = useMemo(() => {
        const dataArray = Object.entries(MAP_DATA)
            .map(([provinceName, data]) => ({ provinceName, data }))
            // Sort by total queries descending
            .sort((a, b) => b.data.totalQueries - a.data.totalQueries);
        
        if (!searchTerm) {
            return dataArray;
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        return dataArray.filter(({ provinceName }) => 
            provinceName.toLowerCase().includes(lowercasedFilter)
        );

    }, [searchTerm]);

    return (
        <div className="flex-1 overflow-y-auto pb-4 flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-100">Observatorio Territorial Anónimo</h3>
                <p className="text-xs text-gray-400 mt-1">
                    Datos agregados y anónimos de consultas por provincia, ordenados por cantidad.
                </p>
            </div>
            
            <div className="relative mb-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Buscar provincia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
                        <p className="text-gray-400">No se encontraron resultados para "{searchTerm}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};