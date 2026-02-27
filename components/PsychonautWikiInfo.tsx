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
    setData(null);
    setError(null);
    setIsExpanded(false);
  }, [substanceName]);

  const loadData = async () => {
    if (data || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const alias = getSubstanceAlias(substanceName);
      const result = await fetchPsychonautData(alias);
      if (result) setData(result);
      else setError('No se encontró información adicional');
    } catch (err) {
      console.error('Error loading PsychonautWiki data:', err);
      setError('Error al cargar información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isExpanded && !data && !error) loadData();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6 overflow-hidden" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-1)' }}>
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between transition-colors"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Información Adicional (PsychonautWiki)</span>
          {isLoading && (
            <span className="text-xs" style={{ color: 'var(--text-muted)', animation: 'pulse 1.5s ease-in-out infinite' }}>Cargando...</span>
          )}
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', animation: 'fadeInUp 0.2s var(--ease-out-strong) both' }}>
          {isLoading && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Cargando información...</p>
          )}

          {error && !isLoading && (
            <div className="p-3" style={{ background: 'var(--color-amber-subtle)', border: '1px solid var(--color-amber-medium)', borderRadius: 'var(--radius-sm)' }}>
              <p className="text-sm" style={{ color: 'var(--color-amber)' }}>{error}</p>
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-4">
              {data.summary && (
                <div>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Resumen</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.summary}</p>
                </div>
              )}

              {data.addictionPotential && (
                <div>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Potencial de Adicción</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{data.addictionPotential}</p>
                </div>
              )}

              {data.toxicity && data.toxicity.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-red)' }}>Toxicidad</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {data.toxicity.map((item, idx) => (
                      <li key={idx} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.crossTolerances && data.crossTolerances.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Tolerancia Cruzada Con</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{data.crossTolerances.join(', ')}</p>
                </div>
              )}

              {data.roas && data.roas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Vías de Administración (ROAs)</h4>
                  <div className="space-y-3">
                    {data.roas.map((roa, idx) => (
                      <div key={idx} className="p-3" style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <h5 className="font-semibold text-sm mb-2 capitalize" style={{ color: 'var(--color-blue)' }}>{roa.name}</h5>
                        {roa.dose && (
                          <div className="mb-2">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Dosificación: </span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDoseInfo(roa)}</span>
                          </div>
                        )}
                        {roa.duration && (
                          <div>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Duración: </span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDurationInfo(roa)}</span>
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
                    className="text-sm inline-flex items-center gap-1"
                    style={{ color: 'var(--color-blue)' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Ver más en PsychonautWiki
                    <ExternalLinkIcon />
                  </a>
                </div>
              )}

              <div className="pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
