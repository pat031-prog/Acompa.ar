import React, { useState } from 'react';
import { LIBRARY_DATA } from '../constants';
import type { LibraryEntry } from '../types';

// Icons
const CompareIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const XMarkIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

interface SubstanceSelectProps {
  label: string;
  selected: LibraryEntry | null;
  onSelect: (substance: LibraryEntry) => void;
  exclude?: string;
}

const SubstanceSelect: React.FC<SubstanceSelectProps> = ({ label, selected, onSelect, exclude }) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <select
        value={selected?.title || ''}
        onChange={(e) => {
          const substance = LIBRARY_DATA.find(s => s.title === e.target.value);
          if (substance) onSelect(substance);
        }}
        className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Seleccionar sustancia...</option>
        {LIBRARY_DATA.filter(s => s.title !== exclude).map(substance => (
          <option key={substance.title} value={substance.title}>
            {substance.title}
          </option>
        ))}
      </select>
    </div>
  );
};

interface ComparisonRowProps {
  label: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
  highlight?: boolean;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, value1, value2, highlight }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg ${highlight ? 'bg-yellow-500/5 border border-yellow-500/20' : 'bg-gray-800/30'}`}>
    <div className="font-semibold text-gray-200 md:col-span-1">{label}</div>
    <div className="text-gray-300 text-sm md:col-span-1">{value1}</div>
    <div className="text-gray-300 text-sm md:col-span-1">{value2}</div>
  </div>
);

export const CompareSubstances: React.FC = () => {
  const [substance1, setSubstance1] = useState<LibraryEntry | null>(null);
  const [substance2, setSubstance2] = useState<LibraryEntry | null>(null);

  const resetComparison = () => {
    setSubstance1(null);
    setSubstance2(null);
  };

  // Helper to check if categories overlap
  const hasOverlappingCategories = () => {
    if (!substance1 || !substance2) return false;
    return substance1.category.some(cat => substance2.category.includes(cat));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <CompareIcon />
          Comparador de Sustancias
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Compara dos sustancias lado a lado para entender sus diferencias y similitudes
        </p>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <SubstanceSelect
            label="Sustancia 1"
            selected={substance1}
            onSelect={setSubstance1}
            exclude={substance2?.title}
          />
          <SubstanceSelect
            label="Sustancia 2"
            selected={substance2}
            onSelect={setSubstance2}
            exclude={substance1?.title}
          />
          {(substance1 || substance2) && (
            <button
              onClick={resetComparison}
              className="md:mt-7 px-4 py-2 text-sm bg-gray-700/40 hover:bg-gray-700/60 text-gray-300 rounded-lg transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!substance1 && !substance2 && (
          <div className="text-center p-10">
            <CompareIcon />
            <p className="text-gray-400 mt-4">Selecciona dos sustancias para comparar</p>
          </div>
        )}

        {substance1 && !substance2 && (
          <div className="text-center p-10">
            <p className="text-gray-400">Selecciona una segunda sustancia para comparar con <strong className="text-gray-200">{substance1.title}</strong></p>
          </div>
        )}

        {!substance1 && substance2 && (
          <div className="text-center p-10">
            <p className="text-gray-400">Selecciona una primera sustancia para comparar con <strong className="text-gray-200">{substance2.title}</strong></p>
          </div>
        )}

        {substance1 && substance2 && (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Category overlap alert */}
            {hasOverlappingCategories() && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-200 flex items-center gap-2">
                  <CheckIcon />
                  <strong>Categorías compartidas:</strong> {substance1.category.filter(cat => substance2.category.includes(cat)).join(', ')}
                </p>
              </div>
            )}

            {/* Basic Info */}
            <ComparisonRow
              label="Nombre"
              value1={<strong className="text-lg">{substance1.title}</strong>}
              value2={<strong className="text-lg">{substance2.title}</strong>}
            />

            <ComparisonRow
              label="También conocido como"
              value1={substance1.aliases.join(', ')}
              value2={substance2.aliases.join(', ')}
            />

            <ComparisonRow
              label="Categoría"
              value1={substance1.category.join(', ')}
              value2={substance2.category.join(', ')}
              highlight={!hasOverlappingCategories()}
            />

            <ComparisonRow
              label="Fórmula química"
              value1={<code className="font-mono bg-gray-900/60 px-2 py-1 rounded">{substance1.chemicalFormula}</code>}
              value2={<code className="font-mono bg-gray-900/60 px-2 py-1 rounded">{substance2.chemicalFormula}</code>}
            />

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-100 mb-3">Descripción</h2>
              <ComparisonRow
                label=""
                value1={substance1.content.description}
                value2={substance2.content.description}
              />
            </div>

            {/* Effects */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-100 mb-3">Efectos</h2>
              <ComparisonRow
                label="Positivos"
                value1={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance1.content.effects.positive.map((e, i) => (
                      <li key={i} className="text-green-300">{e}</li>
                    ))}
                  </ul>
                }
                value2={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance2.content.effects.positive.map((e, i) => (
                      <li key={i} className="text-green-300">{e}</li>
                    ))}
                  </ul>
                }
              />
              <ComparisonRow
                label="Negativos"
                value1={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance1.content.effects.negative.map((e, i) => (
                      <li key={i} className="text-yellow-300">{e}</li>
                    ))}
                  </ul>
                }
                value2={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance2.content.effects.negative.map((e, i) => (
                      <li key={i} className="text-yellow-300">{e}</li>
                    ))}
                  </ul>
                }
              />
            </div>

            {/* Duration */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-100 mb-3">Duración</h2>
              <ComparisonRow
                label="Inicio"
                value1={substance1.content.duration.onset}
                value2={substance2.content.duration.onset}
              />
              <ComparisonRow
                label="Pico"
                value1={substance1.content.duration.peak}
                value2={substance2.content.duration.peak}
              />
              <ComparisonRow
                label="Total"
                value1={substance1.content.duration.total}
                value2={substance2.content.duration.total}
              />
            </div>

            {/* Dosage */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-100 mb-3">Dosificación</h2>
              {substance1.content.dosage.oral && substance2.content.dosage.oral && (
                <ComparisonRow
                  label="Oral"
                  value1={substance1.content.dosage.oral}
                  value2={substance2.content.dosage.oral}
                />
              )}
              {substance1.content.dosage.nasal && substance2.content.dosage.nasal && (
                <ComparisonRow
                  label="Nasal"
                  value1={substance1.content.dosage.nasal}
                  value2={substance2.content.dosage.nasal}
                />
              )}
              {substance1.content.dosage.inhalation && substance2.content.dosage.inhalation && (
                <ComparisonRow
                  label="Inhalado"
                  value1={substance1.content.dosage.inhalation}
                  value2={substance2.content.dosage.inhalation}
                />
              )}
            </div>

            {/* Risks */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-100 mb-3">Principales Riesgos</h2>
              <ComparisonRow
                label=""
                value1={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance1.content.risks.map((r, i) => (
                      <li key={i} className="text-red-300">{r}</li>
                    ))}
                  </ul>
                }
                value2={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance2.content.risks.map((r, i) => (
                      <li key={i} className="text-red-300">{r}</li>
                    ))}
                  </ul>
                }
              />
            </div>

            {/* Combination warning */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-200 flex items-start gap-2">
                <XMarkIcon />
                <span>
                  <strong>⚠️ Advertencia:</strong> Combinar <strong>{substance1.title}</strong> y <strong>{substance2.title}</strong> puede ser peligroso.
                  Consulta las pautas de cuidado de cada sustancia y evita mezclas sin conocer las interacciones.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
