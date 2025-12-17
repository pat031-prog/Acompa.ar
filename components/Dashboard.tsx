import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  getAnalyticsStats,
  getQueriesByDate,
  getAlerts,
  deleteAlert,
  type TerritorialAlert,
} from '../services/analyticsService';
import { PROVINCES } from '../constants';
import { Section, Callout, Chip, Divider } from './ui/Section';
import type { SubstanceCategory } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ArrowRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const getSeverityStyle = (severity: TerritorialAlert['severity']) => {
  const styles = {
    high: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', label: 'Urgente' },
    medium: { bg: 'rgba(251, 146, 60, 0.12)', color: '#fb923c', label: 'Importante' },
    low: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', label: 'Info' }
  };
  return styles[severity];
};

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor(diff / (60 * 1000));

  if (days > 0) return `Hace ${days}d`;
  if (hours > 0) return `Hace ${hours}h`;
  if (minutes > 0) return `Hace ${minutes}m`;
  return 'Ahora';
};

export const Dashboard: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(30);
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setAlerts(getAlerts(selectedProvince));
  }, [selectedProvince]);

  const stats = useMemo(() => {
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
    return getAnalyticsStats(
      startDate,
      undefined,
      selectedProvince !== 'all' ? selectedProvince : undefined,
      undefined
    );
  }, [selectedProvince, timeRange]);

  const trendData = useMemo(() => {
    const queriesByDate = getQueriesByDate(timeRange);
    const dates = Object.keys(queriesByDate).sort();
    const values = dates.map(date => queriesByDate[date]);

    return {
      labels: dates.map(date => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
      datasets: [
        {
          label: 'Consultas',
          data: values,
          borderColor: 'rgb(209, 153, 91)',
          backgroundColor: 'rgba(209, 153, 91, 0.1)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [timeRange]);

  const topSubstancesData = useMemo(() => {
    return {
      labels: stats.topSubstances.map(s => s.name),
      datasets: [
        {
          label: 'Consultas',
          data: stats.topSubstances.map(s => s.count),
          backgroundColor: 'rgba(209, 153, 91, 0.6)',
          borderColor: 'rgb(209, 153, 91)',
          borderWidth: 1,
        },
      ],
    };
  }, [stats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.68)',
          font: { size: 11 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.48)', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.48)', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  const handleDeleteAlert = (id: string) => {
    deleteAlert(id);
    setAlerts(getAlerts(selectedProvince));
  };

  const topCategory = Object.entries(stats.queriesByCategory)
    .sort(([, a], [, b]) => b - a)[0];
  const topCategoryName = topCategory ? topCategory[0] : 'N/A';
  const topCategoryCount = topCategory ? topCategory[1] : 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold"
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-heading)'
            }}
          >
            Resumen Diario
          </h1>
          <p className="editorial text-sm mt-2" style={{ color: 'var(--muted)' }}>
            Tu actividad de reducción de daños y señales relevantes
          </p>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-[var(--radius-sm)] border"
            style={{
              background: 'var(--surface-1)',
              color: 'var(--text)',
              borderColor: 'var(--border)'
            }}
          >
            <option value={7}>Última semana</option>
            <option value={30}>Último mes</option>
            <option value={90}>Últimos 3 meses</option>
          </select>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-3 py-2 text-sm rounded-[var(--radius-sm)] border"
            style={{
              background: 'var(--surface-1)',
              color: 'var(--text)',
              borderColor: 'var(--border)'
            }}
          >
            <option value="all">Todas las provincias</option>
            {PROVINCES.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* 1. Today Summary */}
        <Section title="Hoy">
          <div className="editorial leading-relaxed space-y-4" style={{ color: 'var(--muted)' }}>
            <p>
              En los últimos <strong style={{ color: 'var(--text)' }}>{timeRange} días</strong>, se registraron{' '}
              <strong style={{ color: 'var(--text)' }}>{stats.totalQueries} consultas</strong> sobre{' '}
              <strong style={{ color: 'var(--text)' }}>{stats.topSubstances.length} sustancias</strong> diferentes.
            </p>
            {topCategory && (
              <p>
                La categoría más consultada fue{' '}
                <strong style={{ color: 'var(--text)' }}>{topCategoryName}</strong> con{' '}
                <strong style={{ color: 'var(--text)' }}>{topCategoryCount} consultas</strong>.
                {stats.topSubstances.length > 0 && (
                  <>
                    {' '}Las sustancias más buscadas incluyen{' '}
                    <strong style={{ color: 'var(--text)' }}>
                      {stats.topSubstances.slice(0, 3).map(s => s.name).join(', ')}
                    </strong>.
                  </>
                )}
              </p>
            )}
          </div>
        </Section>

        <Divider />

        {/* 2. You Can Do */}
        <Section title="Podés hacer ahora" meta="Accesos rápidos">
          <div className="space-y-3">
            {[
              { label: 'Consultar sustancias en la Biblioteca', tab: 'library' },
              { label: 'Aprender sobre testeo de sustancias', tab: 'testing' },
              { label: 'Encontrar recursos y líneas de ayuda', tab: 'resources' },
              { label: 'Configurar recordatorios de cuidado', tab: 'reminders' }
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // This would typically trigger tab navigation
                  // For now, just a visual button
                }}
                className="w-full flex items-center justify-between p-4 rounded-lg border-l-2 active:scale-[0.99]"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  borderLeftColor: 'var(--accent)',
                  transition: `all var(--t-fast) var(--ease)`,
                  animation: `fadeIn 0.2s ease-out ${idx * 0.05}s both`
                }}
              >
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {action.label}
                </span>
                <ArrowRightIcon />
              </button>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 3. Signals Preview */}
        <Section
          title="Señales"
          meta={alerts.length > 0 ? `${alerts.length} alerta${alerts.length !== 1 ? 's' : ''} activa${alerts.length !== 1 ? 's' : ''}` : 'Sin alertas'}
        >
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
                No hay alertas activas para esta provincia.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert, idx) => {
                const severityStyle = getSeverityStyle(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg border-l-2"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                      borderLeftColor: severityStyle.color,
                      animation: `fadeIn 0.2s ease-out ${idx * 0.05}s both`
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: severityStyle.bg,
                            color: severityStyle.color
                          }}
                        >
                          {severityStyle.label}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {alert.province}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-xs"
                        style={{ color: 'var(--faint)' }}
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                      {alert.title}
                    </h3>
                    <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--faint)' }}>
                      {alert.source && <span>Fuente: {alert.source}</span>}
                      <span>{getTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                );
              })}
              {alerts.length > 3 && (
                <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
                  +{alerts.length - 3} alerta{alerts.length - 3 !== 1 ? 's' : ''} más
                </p>
              )}
            </div>
          )}
        </Section>

        <Divider />

        {/* Supporting Data - Expandable */}
        <Section title="Datos de soporte" meta="Gráficos y análisis detallados">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 rounded-[var(--radius-sm)] border text-sm font-medium active:scale-95"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            {showCharts ? 'Ocultar gráficos' : 'Ver gráficos'}
          </button>

          {showCharts && (
            <div className="mt-6 space-y-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {/* Trend Chart */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)'
                }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  Tendencia de Consultas
                </h3>
                <div className="h-64">
                  <Line data={trendData} options={chartOptions} />
                </div>
              </div>

              {/* Top Substances Chart */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)'
                }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  Sustancias Más Consultadas
                </h3>
                <div className="h-64">
                  <Bar data={topSubstancesData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Privacy notice */}
        <div className="text-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="editorial text-xs" style={{ color: 'var(--faint)' }}>
            Todos los datos son anónimos y almacenados localmente. No se comparte información personal.
          </p>
        </div>
      </div>
    </div>
  );
};
