import React, { useState } from 'react';
import { LIBRARY_DATA } from '../constants';
import type { LibraryEntry } from '../types';

const CalculatorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
  </svg>
);

type Tolerance = 'none' | 'low' | 'medium' | 'high';
type ROA = 'oral' | 'nasal' | 'inhalation';

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  width: '100%',
  padding: '12px',
  fontSize: '14px',
};

const DoseCalculator: React.FC = () => {
  const [selectedSubstance, setSelectedSubstance] = useState<LibraryEntry | null>(null);
  const [weight, setWeight] = useState<string>('70');
  const [tolerance, setTolerance] = useState<Tolerance>('none');
  const [roa, setRoa] = useState<ROA>('oral');
  const [showResults, setShowResults] = useState(false);

  const calculateDose = () => setShowResults(true);

  const getDoseRecommendation = (): string => {
    if (!selectedSubstance) return '';
    const dosageInfo = selectedSubstance.content.dosage;
    let baseDose = dosageInfo[roa] || dosageInfo.oral || '';
    const match = baseDose.match(/(\d+)-(\d+)\s*mg/);
    if (!match) return baseDose;
    const [_, minStr, maxStr] = match;
    let min = parseInt(minStr);
    let max = parseInt(maxStr);
    const toleranceMultipliers = { none: 1.0, low: 1.2, medium: 1.4, high: 1.6 };
    const multiplier = toleranceMultipliers[tolerance];
    min = Math.round(min * multiplier);
    max = Math.round(max * multiplier);
    const weightNum = parseFloat(weight);
    if (weightNum < 60) { min = Math.round(min * 0.9); max = Math.round(max * 0.9); }
    else if (weightNum > 85) { min = Math.round(min * 1.1); max = Math.round(max * 1.1); }
    return `${min}-${max} mg`;
  };

  const getRiskLevel = (): { level: string; color: string; bg: string; border: string; message: string } => {
    if (tolerance === 'high') return { level: 'ALTO', color: 'var(--color-red)', bg: 'var(--color-red-subtle)', border: 'var(--color-red-medium)', message: 'Tolerancia alta indica uso frecuente. Considera hacer una pausa o reducir consumo.' };
    if (tolerance === 'medium') return { level: 'MODERADO', color: 'var(--color-amber)', bg: 'var(--color-amber-subtle)', border: 'var(--color-amber-medium)', message: 'Tolerancia en desarrollo. Monitorear frecuencia de uso.' };
    return { level: 'BAJO', color: 'var(--color-green)', bg: 'var(--color-green-subtle)', border: 'var(--color-green-medium)', message: 'Sin tolerancia significativa. Mantener dosis bajas y espaciadas.' };
  };

  const getWarnings = (): string[] => {
    if (!selectedSubstance) return [];
    const warnings: string[] = [];
    if (tolerance === 'high') warnings.push('⚠️ La tolerancia alta aumenta riesgos de sobredosis si se interrumpe el consumo y luego se retoma con dosis altas.');
    if (roa === 'nasal' && selectedSubstance.category.includes('Estimulante')) warnings.push('⚠️ Vía nasal aumenta daño a mucosas y riesgo cardiovascular.');
    if (parseFloat(weight) < 50) warnings.push('⚠️ Peso bajo: mayor sensibilidad a sustancias. Comenzar con dosis muy bajas.');
    return warnings;
  };

  const risk = getRiskLevel();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>
          <span style={{ color: 'var(--color-blue)' }}><CalculatorIcon /></span>
          Calculadora de Dosis
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Estimación orientativa basada en factores personales. NO ES CONSEJO MÉDICO.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Warning Banner */}
          <div className="p-4" style={{ background: 'var(--color-amber-subtle)', border: '1px solid var(--color-amber-medium)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-sm" style={{ color: 'var(--color-amber)' }}>
              <strong>⚠️ IMPORTANTE:</strong> Esta calculadora proporciona estimaciones orientativas SOLAMENTE.
              Los efectos varían enormemente entre personas. Siempre empezar con dosis bajas, testear sustancias,
              y evitar mezclas. En caso de duda, no consumir.
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Sustancia</label>
              <select
                value={selectedSubstance?.title || ''}
                onChange={(e) => { const s = LIBRARY_DATA.find(s => s.title === e.target.value); setSelectedSubstance(s || null); setShowResults(false); }}
                style={inputStyle}
              >
                <option value="">Seleccionar sustancia...</option>
                {LIBRARY_DATA.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Peso (kg)</label>
                <input type="number" value={weight} onChange={(e) => { setWeight(e.target.value); setShowResults(false); }} min="30" max="150" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tolerancia</label>
                <select value={tolerance} onChange={(e) => { setTolerance(e.target.value as Tolerance); setShowResults(false); }} style={inputStyle}>
                  <option value="none">Ninguna / Primera vez</option>
                  <option value="low">Baja (uso ocasional)</option>
                  <option value="medium">Media (uso regular)</option>
                  <option value="high">Alta (uso frecuente)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Vía de administración</label>
                <select value={roa} onChange={(e) => { setRoa(e.target.value as ROA); setShowResults(false); }} style={inputStyle}>
                  <option value="oral">Oral</option>
                  <option value="nasal">Nasal</option>
                  <option value="inhalation">Inhalado</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateDose}
              disabled={!selectedSubstance}
              className="w-full py-3 px-4 font-semibold transition-all duration-200"
              style={{
                background: !selectedSubstance ? 'var(--surface-2)' : 'var(--accent-primary)',
                color: !selectedSubstance ? 'var(--text-muted)' : '#fff',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: !selectedSubstance ? 'not-allowed' : 'pointer',
                boxShadow: !selectedSubstance ? 'none' : '0 2px 8px rgba(199, 112, 92, 0.25)',
              }}
              onMouseEnter={(e) => { if (selectedSubstance) { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={(e) => { if (selectedSubstance) { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              Calcular Dosis Recomendada
            </button>
          </div>

          {/* Results */}
          {showResults && selectedSubstance && (
            <div className="space-y-4" style={{ animation: 'fadeInUp 0.3s var(--ease-out-strong) both' }}>
              <div className="p-6" style={{ background: 'var(--color-blue-subtle)', border: '1px solid var(--color-blue-medium)', borderRadius: 'var(--radius-md)' }}>
                <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--color-blue)' }}>Dosis Estimada</h2>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{getDoseRecommendation()}</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Vía: <strong style={{ color: 'var(--text-secondary)' }}>{roa === 'oral' ? 'Oral' : roa === 'nasal' ? 'Nasal' : 'Inhalado'}</strong>
                </p>
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  💡 Siempre empezar con el extremo inferior del rango y esperar al menos 90 minutos antes de redosificar.
                </p>
              </div>

              <div className="p-4" style={{ background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: 'var(--radius-md)', color: risk.color }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">Nivel de Riesgo:</span>
                  <span className="text-lg font-bold">{risk.level}</span>
                </div>
                <p className="text-sm">{risk.message}</p>
              </div>

              {getWarnings().length > 0 && (
                <div className="p-4" style={{ background: 'var(--color-red-subtle)', border: '1px solid var(--color-red-medium)', borderRadius: 'var(--radius-md)' }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-red)' }}>Advertencias Específicas</h3>
                  <ul className="space-y-1">
                    {getWarnings().map((w, i) => <li key={i} className="text-sm" style={{ color: 'var(--color-red)' }}>{w}</li>)}
                  </ul>
                </div>
              )}

              <div className="p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Pautas de Cuidado para {selectedSubstance.title}</h3>
                <ul className="space-y-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {selectedSubstance.content.guidelines.slice(0, 4).map((g, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: g.replace(/\*\*(.*?)\*\*/g, `<strong style="color: var(--text-secondary)">$1</strong>`) }} />
                  ))}
                </ul>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Esta calculadora NO reemplaza consejo médico profesional. Los cálculos son estimativos y pueden no aplicar a todas las personas.
                  La única forma 100% segura de evitar riesgos es no consumir. Si elegís consumir, testeá las sustancias, no mezcles,
                  y tené cerca personas de confianza.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoseCalculator;
