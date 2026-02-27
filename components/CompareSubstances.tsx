import React, { useState } from 'react';
import { LIBRARY_DATA } from '../constants';
import type { LibraryEntry } from '../types';

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

const selectStyle: React.CSSProperties = {
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
};

interface SubstanceSelectProps {
  label: string;
  selected: LibraryEntry | null;
  onSelect: (substance: LibraryEntry) => void;
  exclude?: string;
}

const SubstanceSelect: React.FC<SubstanceSelectProps> = ({ label, selected, onSelect, exclude }) => (
  <div className="flex-1">
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</label>
    <select
      value={selected?.title || ''}
      onChange={(e) => {
        const substance = LIBRARY_DATA.find(s => s.title === e.target.value);
        if (substance) onSelect(substance);
      }}
      style={selectStyle}
    >
      <option value="">Seleccionar sustancia...</option>
      {LIBRARY_DATA.filter(s => s.title !== exclude).map(substance => (
        <option key={substance.title} value={substance.title}>{substance.title}</option>
      ))}
    </select>
  </div>
);

interface ComparisonRowProps {
  label: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
  highlight?: boolean;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, value1, value2, highlight }) => (
  <div
    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4"
    style={{
      borderRadius: 'var(--radius-sm)',
      background: highlight ? 'var(--color-amber-subtle)' : 'var(--surface-1)',
      border: highlight ? '1px solid var(--color-amber-medium)' : '1px solid var(--border-subtle)',
    }}
  >
    <div className="font-semibold md:col-span-1" style={{ color: 'var(--text-primary)' }}>{label}</div>
    <div className="text-sm md:col-span-1" style={{ color: 'var(--text-secondary)' }}>{value1}</div>
    <div className="text-sm md:col-span-1" style={{ color: 'var(--text-secondary)' }}>{value2}</div>
  </div>
);

export const CompareSubstances: React.FC = () => {
  const [substance1, setSubstance1] = useState<LibraryEntry | null>(null);
  const [substance2, setSubstance2] = useState<LibraryEntry | null>(null);

  const resetComparison = () => {
    setSubstance1(null);
    setSubstance2(null);
  };

  const hasOverlappingCategories = () => {
    if (!substance1 || !substance2) return false;
    return substance1.category.some(cat => substance2.category.includes(cat));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>
          <span style={{ color: 'var(--color-violet)' }}><CompareIcon /></span>
          Comparador de Sustancias
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Compara dos sustancias lado a lado para entender sus diferencias y similitudes
        </p>
      </div>

      <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <SubstanceSelect label="Sustancia 1" selected={substance1} onSelect={setSubstance1} exclude={substance2?.title} />
          <SubstanceSelect label="Sustancia 2" selected={substance2} onSelect={setSubstance2} exclude={substance1?.title} />
          {(substance1 || substance2) && (
            <button
              onClick={resetComparison}
              className="md:mt-7 px-4 py-2 text-sm transition-colors"
              style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!substance1 && !substance2 && (
          <div className="text-center p-10" style={{ color: 'var(--text-muted)' }}>
            <CompareIcon />
            <p className="mt-4">Selecciona dos sustancias para comparar</p>
          </div>
        )}

        {substance1 && !substance2 && (
          <div className="text-center p-10" style={{ color: 'var(--text-muted)' }}>
            <p>Selecciona una segunda sustancia para comparar con <strong style={{ color: 'var(--text-primary)' }}>{substance1.title}</strong></p>
          </div>
        )}

        {!substance1 && substance2 && (
          <div className="text-center p-10" style={{ color: 'var(--text-muted)' }}>
            <p>Selecciona una primera sustancia para comparar con <strong style={{ color: 'var(--text-primary)' }}>{substance2.title}</strong></p>
          </div>
        )}

        {substance1 && substance2 && (
          <div className="max-w-6xl mx-auto space-y-4" style={{ animation: 'fadeInUp 0.3s var(--ease-out-strong) both' }}>
            {hasOverlappingCategories() && (
              <div className="p-4" style={{ background: 'var(--color-blue-subtle)', border: '1px solid var(--color-blue-medium)', borderRadius: 'var(--radius-md)' }}>
                <p className="text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--color-blue)' }}><CheckIcon /></span>
                  <strong>Categorías compartidas:</strong> {substance1.category.filter(cat => substance2.category.includes(cat)).join(', ')}
                </p>
              </div>
            )}

            <ComparisonRow label="Nombre" value1={<strong className="text-lg">{substance1.title}</strong>} value2={<strong className="text-lg">{substance2.title}</strong>} />
            <ComparisonRow label="También conocido como" value1={substance1.aliases.join(', ')} value2={substance2.aliases.join(', ')} />
            <ComparisonRow label="Categoría" value1={substance1.category.join(', ')} value2={substance2.category.join(', ')} highlight={!hasOverlappingCategories()} />
            <ComparisonRow label="Fórmula química" value1={<code className="font-mono px-2 py-1" style={{ background: 'var(--surface-2)', borderRadius: '4px', color: 'var(--text-primary)' }}>{substance1.chemicalFormula}</code>} value2={<code className="font-mono px-2 py-1" style={{ background: 'var(--surface-2)', borderRadius: '4px', color: 'var(--text-primary)' }}>{substance2.chemicalFormula}</code>} />

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>Descripción</h2>
              <ComparisonRow label="" value1={substance1.content.description} value2={substance2.content.description} />
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>Efectos</h2>
              <ComparisonRow label="Positivos" value1={<ul className="list-disc pl-5 space-y-1">{substance1.content.effects.positive.map((e, i) => (<li key={i} style={{ color: 'var(--color-green)' }}>{e}</li>))}</ul>} value2={<ul className="list-disc pl-5 space-y-1">{substance2.content.effects.positive.map((e, i) => (<li key={i} style={{ color: 'var(--color-green)' }}>{e}</li>))}</ul>} />
              <ComparisonRow label="Negativos" value1={<ul className="list-disc pl-5 space-y-1">{substance1.content.effects.negative.map((e, i) => (<li key={i} style={{ color: 'var(--color-amber)' }}>{e}</li>))}</ul>} value2={<ul className="list-disc pl-5 space-y-1">{substance2.content.effects.negative.map((e, i) => (<li key={i} style={{ color: 'var(--color-amber)' }}>{e}</li>))}</ul>} />
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>Duración</h2>
              <ComparisonRow label="Inicio" value1={substance1.content.duration.onset} value2={substance2.content.duration.onset} />
              <ComparisonRow label="Pico" value1={substance1.content.duration.peak} value2={substance2.content.duration.peak} />
              <ComparisonRow label="Total" value1={substance1.content.duration.total} value2={substance2.content.duration.total} />
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>Dosificación</h2>
              {substance1.content.dosage.oral && substance2.content.dosage.oral && <ComparisonRow label="Oral" value1={substance1.content.dosage.oral} value2={substance2.content.dosage.oral} />}
              {substance1.content.dosage.nasal && substance2.content.dosage.nasal && <ComparisonRow label="Nasal" value1={substance1.content.dosage.nasal} value2={substance2.content.dosage.nasal} />}
              {substance1.content.dosage.inhalation && substance2.content.dosage.inhalation && <ComparisonRow label="Inhalado" value1={substance1.content.dosage.inhalation} value2={substance2.content.dosage.inhalation} />}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--color-red)', fontFamily: 'var(--font-editorial)' }}>Principales Riesgos</h2>
              <ComparisonRow label="" value1={<ul className="list-disc pl-5 space-y-1">{substance1.content.risks.map((r, i) => (<li key={i} style={{ color: 'var(--color-red)' }}>{r}</li>))}</ul>} value2={<ul className="list-disc pl-5 space-y-1">{substance2.content.risks.map((r, i) => (<li key={i} style={{ color: 'var(--color-red)' }}>{r}</li>))}</ul>} />
            </div>

            <div className="p-4 mt-6" style={{ background: 'var(--color-red-subtle)', border: '1px solid var(--color-red-medium)', borderRadius: 'var(--radius-md)' }}>
              <p className="text-sm flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--color-red)' }}><XMarkIcon /></span>
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
