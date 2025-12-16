import React, { useState, useEffect } from 'react';
import {
  fetchPsychonautData,
  formatDoseInfo,
  formatDurationInfo,
  getSubstanceAlias,
  type PsychonautSubstance,
} from '../services/psychonautWikiService';

interface PsychonautWikiInfoProps {
  substanceName: string;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ExternalLinkIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export const PsychonautWikiInfo: React.FC<PsychonautWikiInfoProps> = ({ substanceName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<PsychonautSubstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when substance changes
    setData(null);
    setError(null);
    setIsExpanded(false);
  }, [substanceName]);

  const loadData = async () => {
    if (data || isLoading) return; // Already loaded or loading

    setIsLoading(true);
    setError(null);

    try {
      const alias = getSubstanceAlias(substanceName);
      const result = await fetchPsychonautData(alias);

      if (result) {
        setData(result);
      } else {
        setError('No se encontró información adicional');
      }
    } catch (err) {
      console.error('Error loading PsychonautWiki data:', err);
      setError('Error al cargar información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isExpanded && !data && !error) {
      loadData();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6 border border-gray-700 rounded-lg overflow-hidden bg-gray-800/20">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-200">Información Adicional (PsychonautWiki)</span>
          {isLoading && (
            <span className="text-xs text-gray-400 animate-pulse">Cargando...</span>
          )}
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/30">
          {isLoading && (
            <p className="text-sm text-gray-400 text-center py-4">Cargando información...</p>
          )}

          {error && !isLoading && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-300">{error}</p>
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-4">
              {data.summary && (
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm mb-2">Resumen</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{data.summary}</p>
                </div>
              )}

              {data.addictionPotential && (
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm mb-2">Potencial de Adicción</h4>
                  <p className="text-sm text-gray-300">{data.addictionPotential}</p>
                </div>
              )}

              {data.toxicity && data.toxicity.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm mb-2">Toxicidad</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {data.toxicity.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.crossTolerances && data.crossTolerances.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm mb-2">Tolerancia Cruzada Con</h4>
                  <p className="text-sm text-gray-300">{data.crossTolerances.join(', ')}</p>
                </div>
              )}

              {data.roas && data.roas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm mb-3">Vías de Administración (ROAs)</h4>
                  <div className="space-y-3">
                    {data.roas.map((roa, idx) => (
                      <div key={idx} className="bg-gray-800/40 rounded-lg p-3">
                        <h5 className="font-semibold text-blue-300 text-sm mb-2 capitalize">{roa.name}</h5>
                        {roa.dose && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-400">Dosificación: </span>
                            <span className="text-xs text-gray-300">{formatDoseInfo(roa)}</span>
                          </div>
                        )}
                        {roa.duration && (
                          <div>
                            <span className="text-xs text-gray-400">Duración: </span>
                            <span className="text-xs text-gray-300">{formatDurationInfo(roa)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.url && (
                <div className="pt-2">
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    Ver más en PsychonautWiki
                    <ExternalLinkIcon />
                  </a>
                </div>
              )}

              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Fuente: PsychonautWiki - Información complementaria. Siempre consultar con profesionales de la salud.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
