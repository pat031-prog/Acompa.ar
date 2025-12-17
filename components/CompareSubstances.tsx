import React, { useState, useMemo } from 'react';
import { LIBRARY_DATA } from '../constants';
import type { LibraryEntry } from '../types';
import { Callout } from './ui/Section';

// Icons
const CompareIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
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
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
        {label}
      </label>
      <select
        value={selected?.title || ''}
        onChange={(e) => {
          const substance = LIBRARY_DATA.find(s => s.title === e.target.value);
          if (substance) onSelect(substance);
        }}
        className="w-full p-2.5 text-sm rounded-lg border focus:outline-none"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
          transition: `all var(--t-fast) var(--ease)`
        }}
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
  isDifferent?: boolean;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, value1, value2, isDifferent }) => (
  <div
    className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 py-4 border-b"
    style={{
      borderColor: 'var(--border)',
      background: isDifferent ? 'rgba(245, 158, 11, 0.03)' : 'transparent',
      borderLeftWidth: isDifferent ? '2px' : '0',
      borderLeftColor: isDifferent ? 'rgba(245, 158, 11, 0.4)' : 'transparent'
    }}
  >
    <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>
      {label}
    </div>
    <div className="editorial text-sm" style={{ color: 'var(--muted)' }}>
      {value1}
    </div>
    <div className="editorial text-sm" style={{ color: 'var(--muted)' }}>
      {value2}
    </div>
  </div>
);

export const CompareSubstances: React.FC = () => {
  const [substance1, setSubstance1] = useState<LibraryEntry | null>(null);
  const [substance2, setSubstance2] = useState<LibraryEntry | null>(null);

  const resetComparison = () => {
    setSubstance1(null);
    setSubstance2(null);
  };

  // Derive key differences
  const keyDifferences = useMemo(() => {
    if (!substance1 || !substance2) return [];

    const differences: string[] = [];

    // Category difference
    const hasSharedCategory = substance1.category.some(cat => substance2.category.includes(cat));
    if (!hasSharedCategory) {
      differences.push(`Pertenecen a categorías distintas: ${substance1.category[0]} vs ${substance2.category[0]}`);
    }

    // Duration difference (rough heuristic)
    if (substance1.content.duration.total !== substance2.content.duration.total) {
      differences.push(`Duración total: ${substance1.content.duration.total} vs ${substance2.content.duration.total}`);
    }

    // Onset difference
    if (substance1.content.duration.onset !== substance2.content.duration.onset) {
      differences.push(`Inicio de efectos: ${substance1.content.duration.onset} vs ${substance2.content.duration.onset}`);
    }

    return differences;
  }, [substance1, substance2]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Selection header */}
      <div
        className="p-5 sm:p-6 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <SubstanceSelect
              label="Sustancia 1"
              selected={substance1}
              onSelect={setSubstance1}
              exclude={substance2?.title}
            />
            <div className="flex-shrink-0 hidden md:flex items-center justify-center pb-2">
              <CompareIcon />
            </div>
            <SubstanceSelect
              label="Sustancia 2"
              selected={substance2}
              onSelect={setSubstance2}
              exclude={substance1?.title}
            />
            {(substance1 || substance2) && (
              <button
                onClick={resetComparison}
                className="px-4 py-2.5 text-sm rounded-lg active:scale-95"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--muted)',
                  transition: `all var(--t-fast) var(--ease)`
                }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
        {!substance1 && !substance2 && (
          <div className="flex flex-col items-center justify-center h-full">
            <CompareIcon />
            <p className="editorial text-center mt-4" style={{ color: 'var(--muted)' }}>
              Selecciona dos sustancias para comparar sus características
            </p>
          </div>
        )}

        {substance1 && !substance2 && (
          <div className="flex items-center justify-center h-full">
            <p className="editorial text-center" style={{ color: 'var(--muted)' }}>
              Selecciona una segunda sustancia para comparar con{' '}
              <strong style={{ color: 'var(--text)' }}>{substance1.title}</strong>
            </p>
          </div>
        )}

        {!substance1 && substance2 && (
          <div className="flex items-center justify-center h-full">
            <p className="editorial text-center" style={{ color: 'var(--muted)' }}>
              Selecciona una primera sustancia para comparar con{' '}
              <strong style={{ color: 'var(--text)' }}>{substance2.title}</strong>
            </p>
          </div>
        )}

        {substance1 && substance2 && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Sticky header row with substance names */}
            <div
              className="sticky top-0 z-10 grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 py-4 -mx-5 px-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
              style={{
                background: 'var(--bg)',
                borderBottom: `1px solid var(--border)`,
                backdropFilter: 'blur(12px)'
              }}
            >
              <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                Atributo
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                {substance1.title}
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                {substance2.title}
              </div>
            </div>

            {/* Key differences summary */}
            {keyDifferences.length > 0 && (
              <Callout variant="info" icon="ℹ️">
                <strong>Diferencias clave:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {keyDifferences.map((diff, i) => (
                    <li key={i}>{diff}</li>
                  ))}
                </ul>
              </Callout>
            )}

            {/* Comparison table */}
            <div>
              <ComparisonRow
                label="También conocido como"
                value1={substance1.aliases.join(', ')}
                value2={substance2.aliases.join(', ')}
              />

              <ComparisonRow
                label="Categoría"
                value1={substance1.category.join(', ')}
                value2={substance2.category.join(', ')}
                isDifferent={!substance1.category.some(cat => substance2.category.includes(cat))}
              />

              <ComparisonRow
                label="Fórmula química"
                value1={
                  <code
                    className="font-mono px-2 py-1 rounded"
                    style={{
                      background: 'var(--surface-1)',
                      color: 'var(--text)'
                    }}
                  >
                    {substance1.chemicalFormula}
                  </code>
                }
                value2={
                  <code
                    className="font-mono px-2 py-1 rounded"
                    style={{
                      background: 'var(--surface-1)',
                      color: 'var(--text)'
                    }}
                  >
                    {substance2.chemicalFormula}
                  </code>
                }
              />

              <ComparisonRow
                label="Descripción"
                value1={substance1.content.description}
                value2={substance2.content.description}
              />

              <ComparisonRow
                label="Efectos positivos"
                value1={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance1.content.effects.positive.map((e, i) => (
                      <li key={i} style={{ color: '#6ee7b7' }}>{e}</li>
                    ))}
                  </ul>
                }
                value2={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance2.content.effects.positive.map((e, i) => (
                      <li key={i} style={{ color: '#6ee7b7' }}>{e}</li>
                    ))}
                  </ul>
                }
              />

              <ComparisonRow
                label="Efectos negativos"
                value1={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance1.content.effects.negative.map((e, i) => (
                      <li key={i} style={{ color: '#fbbf24' }}>{e}</li>
                    ))}
                  </ul>
                }
                value2={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance2.content.effects.negative.map((e, i) => (
                      <li key={i} style={{ color: '#fbbf24' }}>{e}</li>
                    ))}
                  </ul>
                }
              />

              <ComparisonRow
                label="Inicio de efectos"
                value1={substance1.content.duration.onset}
                value2={substance2.content.duration.onset}
                isDifferent={substance1.content.duration.onset !== substance2.content.duration.onset}
              />

              <ComparisonRow
                label="Pico / Meseta"
                value1={substance1.content.duration.peak}
                value2={substance2.content.duration.peak}
              />

              <ComparisonRow
                label="Duración total"
                value1={substance1.content.duration.total}
                value2={substance2.content.duration.total}
                isDifferent={substance1.content.duration.total !== substance2.content.duration.total}
              />

              {(substance1.content.dosage.oral || substance2.content.dosage.oral) && (
                <ComparisonRow
                  label="Dosificación oral"
                  value1={substance1.content.dosage.oral || 'N/A'}
                  value2={substance2.content.dosage.oral || 'N/A'}
                />
              )}

              {(substance1.content.dosage.nasal || substance2.content.dosage.nasal) && (
                <ComparisonRow
                  label="Dosificación nasal"
                  value1={substance1.content.dosage.nasal || 'N/A'}
                  value2={substance2.content.dosage.nasal || 'N/A'}
                />
              )}

              {(substance1.content.dosage.inhalation || substance2.content.dosage.inhalation) && (
                <ComparisonRow
                  label="Dosificación inhalada"
                  value1={substance1.content.dosage.inhalation || 'N/A'}
                  value2={substance2.content.dosage.inhalation || 'N/A'}
                />
              )}

              <ComparisonRow
                label="Principales riesgos"
                value1={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance1.content.risks.map((r, i) => (
                      <li key={i} style={{ color: '#fca5a5' }}>{r}</li>
                    ))}
                  </ul>
                }
                value2={
                  <ul className="list-disc pl-5 space-y-1">
                    {substance2.content.risks.map((r, i) => (
                      <li key={i} style={{ color: '#fca5a5' }}>{r}</li>
                    ))}
                  </ul>
                }
              />
            </div>

            {/* Combination warning */}
            <Callout variant="warning" icon="⚠️">
              <strong>Advertencia sobre combinaciones:</strong> Mezclar{' '}
              <strong>{substance1.title}</strong> y <strong>{substance2.title}</strong>{' '}
              puede ser peligroso. Consulta las pautas de cuidado de cada sustancia y evita
              mezclas sin conocer las interacciones posibles.
            </Callout>
          </div>
        )}
      </div>
    </div>
  );
};
