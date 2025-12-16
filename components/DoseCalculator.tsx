import React, { useState } from 'react';
import { LIBRARY_DATA } from '../constants';
import type { LibraryEntry } from '../types';

// Icons
const CalculatorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
  </svg>
);

type Tolerance = 'none' | 'low' | 'medium' | 'high';
type ROA = 'oral' | 'nasal' | 'inhalation';

const DoseCalculator: React.FC = () => {
  const [selectedSubstance, setSelectedSubstance] = useState<LibraryEntry | null>(null);
  const [weight, setWeight] = useState<string>('70');
  const [tolerance, setTolerance] = useState<Tolerance>('none');
  const [roa, setRoa] = useState<ROA>('oral');
  const [showResults, setShowResults] = useState(false);

  const calculateDose = () => {
    setShowResults(true);
  };

  const getDoseRecommendation = (): string => {
    if (!selectedSubstance) return '';

    const dosageInfo = selectedSubstance.content.dosage;
    let baseDose = dosageInfo[roa] || dosageInfo.oral || '';

    // Parse dose range (e.g., "75-120 mg")
    const match = baseDose.match(/(\d+)-(\d+)\s*mg/);
    if (!match) return baseDose;

    const [_, minStr, maxStr] = match;
    let min = parseInt(minStr);
    let max = parseInt(maxStr);

    // Adjust for tolerance
    const toleranceMultipliers = {
      none: 1.0,
      low: 1.2,
      medium: 1.4,
      high: 1.6,
    };
    const multiplier = toleranceMultipliers[tolerance];

    min = Math.round(min * multiplier);
    max = Math.round(max * multiplier);

    // Weight adjustment (subtle)
    const weightNum = parseFloat(weight);
    if (weightNum < 60) {
      min = Math.round(min * 0.9);
      max = Math.round(max * 0.9);
    } else if (weightNum > 85) {
      min = Math.round(min * 1.1);
      max = Math.round(max * 1.1);
    }

    return `${min}-${max} mg`;
  };

  const getRiskLevel = (): { level: string; color: string; message: string } => {
    if (tolerance === 'high') {
      return {
        level: 'ALTO',
        color: 'text-red-400 border-red-500/40 bg-red-500/10',
        message: 'Tolerancia alta indica uso frecuente. Considera hacer una pausa o reducir consumo.',
      };
    }
    if (tolerance === 'medium') {
      return {
        level: 'MODERADO',
        color: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
        message: 'Tolerancia en desarrollo. Monitorear frecuencia de uso.',
      };
    }
    return {
      level: 'BAJO',
      color: 'text-green-400 border-green-500/40 bg-green-500/10',
      message: 'Sin tolerancia significativa. Mantener dosis bajas y espaciadas.',
    };
  };

  const getWarnings = (): string[] => {
    if (!selectedSubstance) return [];

    const warnings: string[] = [];

    if (tolerance === 'high') {
      warnings.push('⚠️ La tolerancia alta aumenta riesgos de sobredosis si se interrumpe el consumo y luego se retoma con dosis altas.');
    }

    if (roa === 'nasal' && selectedSubstance.category.includes('Estimulante')) {
      warnings.push('⚠️ Vía nasal aumenta daño a mucosas y riesgo cardiovascular.');
    }

    if (parseFloat(weight) < 50) {
      warnings.push('⚠️ Peso bajo: mayor sensibilidad a sustancias. Comenzar con dosis muy bajas.');
    }

    return warnings;
  };

  const risk = getRiskLevel();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <CalculatorIcon />
          Calculadora de Dosis
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Estimación orientativa basada en factores personales. NO ES CONSEJO MÉDICO.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm text-amber-300">
              <strong>⚠️ IMPORTANTE:</strong> Esta calculadora proporciona estimaciones orientativas SOLAMENTE.
              Los efectos varían enormemente entre personas. Siempre empezar con dosis bajas, testear sustancias,
              y evitar mezclas. En caso de duda, no consumir.
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sustancia</label>
              <select
                value={selectedSubstance?.title || ''}
                onChange={(e) => {
                  const substance = LIBRARY_DATA.find(s => s.title === e.target.value);
                  setSelectedSubstance(substance || null);
                  setShowResults(false);
                }}
                className="w-full p-3 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar sustancia...</option>
                {LIBRARY_DATA.map(substance => (
                  <option key={substance.title} value={substance.title}>
                    {substance.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setShowResults(false);
                  }}
                  min="30"
                  max="150"
                  className="w-full p-3 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tolerancia</label>
                <select
                  value={tolerance}
                  onChange={(e) => {
                    setTolerance(e.target.value as Tolerance);
                    setShowResults(false);
                  }}
                  className="w-full p-3 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="none">Ninguna / Primera vez</option>
                  <option value="low">Baja (uso ocasional)</option>
                  <option value="medium">Media (uso regular)</option>
                  <option value="high">Alta (uso frecuente)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Vía de administración</label>
                <select
                  value={roa}
                  onChange={(e) => {
                    setRoa(e.target.value as ROA);
                    setShowResults(false);
                  }}
                  className="w-full p-3 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="oral">Oral</option>
                  <option value="nasal">Nasal</option>
                  <option value="inhalation">Inhalado</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateDose}
              disabled={!selectedSubstance}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Calcular Dosis Recomendada
            </button>
          </div>

          {/* Results */}
          {showResults && selectedSubstance && (
            <div className="space-y-4">
              {/* Dose Recommendation */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h2 className="text-lg font-bold text-blue-300 mb-2">Dosis Estimada</h2>
                <p className="text-3xl font-bold text-white mb-2">{getDoseRecommendation()}</p>
                <p className="text-sm text-gray-400">
                  Vía: <strong className="text-gray-300">{roa === 'oral' ? 'Oral' : roa === 'nasal' ? 'Nasal' : 'Inhalado'}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Siempre empezar con el extremo inferior del rango y esperar al menos 90 minutos antes de redosificar.
                </p>
              </div>

              {/* Risk Level */}
              <div className={`border rounded-lg p-4 ${risk.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">Nivel de Riesgo:</span>
                  <span className="text-lg font-bold">{risk.level}</span>
                </div>
                <p className="text-sm">{risk.message}</p>
              </div>

              {/* Warnings */}
              {getWarnings().length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-400 mb-2">Advertencias Específicas</h3>
                  <ul className="space-y-1">
                    {getWarnings().map((warning, idx) => (
                      <li key={idx} className="text-sm text-red-300">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* General Guidelines */}
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Pautas de Cuidado para {selectedSubstance.title}</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  {selectedSubstance.content.guidelines.slice(0, 4).map((guideline, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: guideline.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-300">$1</strong>') }} />
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-xs text-gray-500 text-center">
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
