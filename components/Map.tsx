import React, { useState, useMemo } from 'react';
import { MAP_DATA } from '../constants';
import { PageShell } from './ui/PageShell';
import { Section, Callout, Chip, Divider } from './ui/Section';
import type { MapDataset } from '../types';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

interface Signal {
  location: string;
  totalQueries: number;
  severity: 'high' | 'medium' | 'low';
  topCategories: Array<{ category: string; percentage: number }>;
}

const getSeverity = (queries: number): 'high' | 'medium' | 'low' => {
  if (queries > 1500) return 'high';
  if (queries > 800) return 'medium';
  return 'low';
};

const getSeverityStyle = (severity: 'high' | 'medium' | 'low') => {
  const styles = {
    high: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', label: 'Alta' },
    medium: { bg: 'rgba(251, 146, 60, 0.12)', color: '#fb923c', label: 'Media' },
    low: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', label: 'Baja' }
  };
  return styles[severity];
};

const SATAlertCard: React.FC<{ alert: SATAlert; index: number }> = ({ alert, index }) => {
  const getSATSeverityStyle = (severity: 'critical' | 'high' | 'medium') => {
    const styles = {
      critical: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', label: 'Crítico' },
      high: { bg: 'rgba(251, 146, 60, 0.15)', border: '#fb923c', label: 'Alto' },
      medium: { bg: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24', label: 'Medio' }
    };
    return styles[severity];
  };

  const severityStyle = getSATSeverityStyle(alert.severity);
  const formattedDate = new Date(alert.date).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      className="rounded-lg border-l-4 p-5"
      style={{
        background: severityStyle.bg,
        borderColor: severityStyle.border,
        animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase"
              style={{
                background: severityStyle.border,
                color: 'white'
              }}
            >
              {severityStyle.label}
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--faint)' }}>
              {formattedDate}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {alert.title}
          </h3>
          <div className="flex items-center gap-3 text-xs mb-2" style={{ color: 'var(--muted)' }}>
            <span className="font-medium">
              🧪 {alert.substance}
            </span>
            <span>
              📍 {alert.location}
            </span>
          </div>
        </div>
      </div>
      <p className="editorial text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        {alert.description}
      </p>
    </div>
  );
};

const SignalRow: React.FC<{ signal: Signal; index: number }> = ({ signal, index }) => {
  const severityStyle = getSeverityStyle(signal.severity);

  // Generate narrative summary
  const narrative = signal.topCategories.length > 0
    ? `${signal.topCategories[0].category} (${signal.topCategories[0].percentage}%)${
        signal.topCategories.length > 1
          ? `, ${signal.topCategories[1].category} (${signal.topCategories[1].percentage}%)`
          : ''
      }${
        signal.topCategories.length > 2
          ? `, ${signal.topCategories[2].category} (${signal.topCategories[2].percentage}%)`
          : ''
      }`
    : 'Sin datos de categorías';

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg border-l-2"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--border)',
        borderLeftColor: severityStyle.color,
        animation: `fadeIn 0.2s ease-out ${index * 0.05}s both`
      }}
    >
      {/* Location & Severity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--text)' }}
          >
            {signal.location}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: severityStyle.bg,
              color: severityStyle.color
            }}
          >
            {severityStyle.label}
          </span>
        </div>

        {/* Narrative summary */}
        <p
          className="editorial text-sm leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {narrative}
        </p>
      </div>

      {/* Queries count */}
      <div className="flex-shrink-0 text-right">
        <div
          className="text-2xl font-semibold"
          style={{ color: 'var(--text)' }}
        >
          {signal.totalQueries.toLocaleString('es-AR')}
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: 'var(--muted)' }}
        >
          consultas
        </div>
      </div>
    </div>
  );
};

interface SATAlert {
  id: string;
  title: string;
  substance: string;
  description: string;
  location: string;
  date: string;
  severity: 'critical' | 'high' | 'medium';
}

// Mock SAT alerts - In production, these would come from argentina.gob.ar/sat/alertas API
const MOCK_SAT_ALERTS: SATAlert[] = [
  {
    id: '1',
    title: 'Alerta por MDMA adulterado',
    substance: 'MDMA/Éxtasis',
    description: 'Se detectó MDMA con alta concentración de adulterantes peligrosos (PMA/PMMA). Riesgo de hipertermia severa.',
    location: 'Buenos Aires (AMBA)',
    date: '2025-12-15',
    severity: 'critical'
  },
  {
    id: '2',
    title: 'Cocaína con levamisol',
    substance: 'Cocaína',
    description: 'Muestras analizadas contienen levamisol, un antiparasitario que puede causar inmunosupresión y necrosis cutánea.',
    location: 'Córdoba',
    date: '2025-12-10',
    severity: 'high'
  }
];

export const Observatory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [satAlerts] = useState<SATAlert[]>(MOCK_SAT_ALERTS);

  const signals = useMemo((): Signal[] => {
    const signalsArray = Object.entries(MAP_DATA)
      .map(([location, data]) => ({
        location,
        totalQueries: data.totalQueries,
        severity: getSeverity(data.totalQueries),
        topCategories: data.topCategories
      }))
      .sort((a, b) => b.totalQueries - a.totalQueries);

    if (!searchTerm) {
      return signalsArray;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    return signalsArray.filter(signal =>
      signal.location.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold"
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-heading)'
            }}
          >
            Observatorio Territorial
          </h1>
          <p className="editorial text-sm mt-2" style={{ color: 'var(--muted)' }}>
            Señales agregadas y anónimas de consultas por provincia
          </p>
        </div>

        {/* SAT Alerts Section */}
        {satAlerts.length > 0 && (
          <Section
            title="Alertas SAT - Sistema de Alerta Temprana"
            meta={`${satAlerts.length} alerta${satAlerts.length !== 1 ? 's' : ''} activa${satAlerts.length !== 1 ? 's' : ''}`}
          >
            <Callout variant="warning" icon="⚠️">
              <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--text)' }}>Alertas oficiales de argentina.gob.ar/sat:</strong> Estos avisos provienen del Sistema de Alerta Temprana nacional y reportan sustancias adulteradas o de alto riesgo circulando en el territorio. Si tenés o consumiste alguna de estas sustancias, extremá las precauciones y considerá testear antes de usar.
              </p>
            </Callout>

            <div className="space-y-4 mt-4">
              {satAlerts.map((alert, idx) => (
                <SATAlertCard key={alert.id} alert={alert} index={idx} />
              ))}
            </div>

            <div className="mt-4 p-4 rounded-lg border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--text)' }}>Fuente:</strong> Las alertas mostradas son obtenidas del Sistema de Alerta Temprana del gobierno argentino (
                <a
                  href="https://www.argentina.gob.ar/sat/alertas"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)' }}
                  className="underline"
                >
                  argentina.gob.ar/sat/alertas
                </a>
                ). En esta versión de demostración se muestran alertas de ejemplo. En producción, se sincronizarían automáticamente con la fuente oficial.
              </p>
            </div>
          </Section>
        )}

        <Divider />

        {/* Search */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: 'var(--muted)' }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar provincia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 text-sm rounded-[var(--radius-md)] border focus:outline-none focus:ring-2"
            style={{
              background: 'var(--surface-1)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
              transition: `all var(--t-fast) var(--ease)`
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--accent-weak)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Signal Timeline */}
        <Section
          title="Señales de Actividad"
          meta={`${signals.length} provincia${signals.length !== 1 ? 's' : ''} registrada${signals.length !== 1 ? 's' : ''}`}
        >
          {signals.length > 0 ? (
            <div className="space-y-3">
              {signals.map((signal, idx) => (
                <SignalRow key={signal.location} signal={signal} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
                No se encontraron resultados para "{searchTerm}"
              </p>
            </div>
          )}
        </Section>

        <Divider />

        {/* Context callout */}
        <Callout variant="neutral" icon="ℹ️">
          <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Sobre estos datos:</strong> Las señales territoriales muestran consultas agregadas y completamente anónimas. No se recopila información personal identificable. La actividad alta en una provincia no indica necesariamente mayor consumo, sino mayor acceso a información de reducción de daños.
          </p>
        </Callout>

        {/* Map Visualization Section - Placeholder */}
        <Section title="Visualización Territorial" meta="Mapa interactivo de Argentina">
          <div
            className="w-full rounded-lg border p-8 flex items-center justify-center min-h-[400px]"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border)'
            }}
          >
            <p className="editorial text-sm text-center" style={{ color: 'var(--muted)' }}>
              Visualización de mapa en desarrollo
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
};
