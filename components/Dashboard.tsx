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
import type { SubstanceCategory } from '../types';
import { PageHeader, SectionLabel, Display, Panel, InlineNote, fieldStyle, FieldLabel } from './ui';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// Section medallion — a simple bars/analytics glyph rendered in the coral planet.
const ChartMedallionIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v15a1.5 1.5 0 0 0 1.5 1.5h15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75v1.5M11.25 11.25v6M15 13.5v3.75M18.75 8.25v9" />
  </svg>
);

const getSeverityStyle = (severity: TerritorialAlert['severity']): { accent: string } => ({
  high: { accent: 'var(--color-red)' },
  medium: { accent: 'var(--color-amber)' },
  low: { accent: 'var(--color-blue)' },
}[severity]);

const getSeverityBadge = (severity: TerritorialAlert['severity']): { label: string } => ({
  high: { label: 'URGENTE' },
  medium: { label: 'IMPORTANTE' },
  low: { label: 'INFO' },
}[severity]);

const getTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000); const hours = Math.floor(diff / 3600000); const minutes = Math.floor(diff / 60000);
  if (days > 0) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
  if (hours > 0) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (minutes > 0) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  return 'Hace un momento';
};

const AlertRow: React.FC<{ alert: TerritorialAlert; onDelete: () => void; first: boolean }> = ({ alert, onDelete, first }) => {
  const badge = getSeverityBadge(alert.severity);
  const style = getSeverityStyle(alert.severity);
  const link = alert.sourceUrl || alert.pdfUrl;
  return (
    <div className="group flex gap-4 py-5" style={{ borderTop: first ? 'none' : '1px solid var(--border-subtle)' }}>
      {/* severity rail — dot + fading line */}
      <div className="flex-shrink-0 flex flex-col items-center pt-1.5" style={{ width: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.accent }} />
        <span className="flex-1 mt-2" style={{ width: '2px', background: `linear-gradient(${style.accent}, transparent)`, opacity: 0.4 }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: style.accent }}>{badge.label}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {alert.province}</span>
          <span className="text-xs ml-auto flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            {getTimeAgo(alert.timestamp)}
            <button onClick={onDelete} className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} title="Descartar alerta" aria-label="Descartar alerta">✕</button>
          </span>
        </div>
        <h3 className="mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
              {alert.title} <span className="inline-block ml-0.5">↗</span>
            </a>
          ) : (
            alert.title
          )}
        </h3>
        <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{alert.message}</p>
        {alert.source && (
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Fuente: {alert.source}</a>
            ) : `Fuente: ${alert.source}`}
          </div>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(30);
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);

  useEffect(() => { setAlerts(getAlerts(selectedProvince)); }, [selectedProvince]);

  const stats = useMemo(() => {
    const startDate = new Date(Date.now() - timeRange * 86400000);
    return getAnalyticsStats(startDate, undefined, selectedProvince !== 'all' ? selectedProvince : undefined, selectedCategory !== 'all' ? (selectedCategory as SubstanceCategory) : undefined);
  }, [selectedProvince, selectedCategory, timeRange]);

  // Terracotta-themed chart colors
  const accentRGB = '199, 112, 92';
  const trendData = useMemo(() => {
    const q = getQueriesByDate(timeRange);
    const dates = Object.keys(q).sort();
    return { labels: dates.map(d => { const dt = new Date(d); return `${dt.getDate()}/${dt.getMonth() + 1}`; }), datasets: [{ label: 'Consultas', data: dates.map(d => q[d]), borderColor: `rgb(${accentRGB})`, backgroundColor: `rgba(${accentRGB}, 0.1)`, tension: 0.3, fill: true }] };
  }, [timeRange]);

  const categoryData = useMemo(() => {
    const cats = Object.keys(stats.queriesByCategory);
    return { labels: cats, datasets: [{ label: 'Consultas por categoría', data: cats.map(c => stats.queriesByCategory[c as SubstanceCategory] || 0), backgroundColor: ['rgba(96, 165, 250, 0.6)', 'rgba(52, 211, 153, 0.6)', 'rgba(251, 191, 36, 0.6)', 'rgba(248, 113, 113, 0.6)', 'rgba(167, 139, 250, 0.6)', 'rgba(244, 114, 182, 0.6)'], borderColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'], borderWidth: 1 }] };
  }, [stats]);

  const topSubstancesData = useMemo(() => ({ labels: stats.topSubstances.map(s => s.name), datasets: [{ label: 'Consultas', data: stats.topSubstances.map(s => s.count), backgroundColor: `rgba(${accentRGB}, 0.6)`, borderColor: `rgb(${accentRGB})`, borderWidth: 1 }] }), [stats]);

  const textColor = 'rgb(180, 180, 190)';
  const gridColor = 'rgba(255, 255, 255, 0.05)';
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor, font: { size: 12 }, padding: 10 } } }, scales: { x: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } }, y: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } } } };
  const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { color: textColor, font: { size: 12 }, padding: 8 } } } };

  const handleDeleteAlert = (id: string) => { deleteAlert(id); setAlerts(getAlerts(selectedProvince)); };

  const kpis = [
    { label: 'Total de consultas', value: stats.totalQueries, color: 'var(--text-primary)' },
    { label: 'Sustancias únicas', value: stats.topSubstances.length, color: 'var(--accent-primary)' },
    { label: 'Categorías activas', value: Object.keys(stats.queriesByCategory).length, color: 'var(--text-primary)' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader
        eyebrow="Estadísticas"
        title="Dashboard de gestión"
        description="Análisis de consultas, tendencias y alertas territoriales."
        accent="var(--accent-primary)"
        icon={<ChartMedallionIcon />}
      />

      {/* ── Filters ── */}
      <div className="px-5 sm:px-7 lg:px-8 py-7 sm:py-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl">
          <SectionLabel accent="var(--accent-primary)">Filtros</SectionLabel>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-5">
            <div className="flex-1">
              <FieldLabel>Provincia</FieldLabel>
              <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} style={fieldStyle}>
                <option value="all">Todas las provincias</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <FieldLabel>Categoría</FieldLabel>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={fieldStyle}>
                <option value="all">Todas las categorías</option>
                <option value="Estimulante">Estimulante</option><option value="Depresor">Depresor</option><option value="Psicodélico">Psicodélico</option><option value="Disociativo">Disociativo</option><option value="Empatógeno">Empatógeno</option><option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex-1">
              <FieldLabel>Período</FieldLabel>
              <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} style={fieldStyle}>
                <option value={7}>Última semana</option><option value={30}>Último mes</option><option value={90}>Últimos 3 meses</option><option value={180}>Últimos 6 meses</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto w-full space-y-12 sm:space-y-16">
          {/* ── KPIs — ruled 3-cell strip, big airy Display numbers ── */}
          <section>
            <SectionLabel accent="var(--accent-primary)">Resumen</SectionLabel>
            <div className="grid grid-cols-3 mt-6" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
              {kpis.map((kpi, i) => (
                <div key={i} className="py-8 sm:py-10" style={{ borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none', paddingLeft: i > 0 ? '20px' : 0 }}>
                  <Display size="xl" color={kpi.color} style={{ fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums' }}>{kpi.value}</Display>
                  <p className="mt-4" style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Alertas territoriales — ruled rows with severity rail ── */}
          <section>
            <SectionLabel accent="var(--color-red)" count={alerts.length}>Alertas territoriales</SectionLabel>
            {alerts.length === 0 ? (
              <p className="py-14 text-center" style={{ color: 'var(--text-muted)' }}>No hay alertas activas para esta provincia.</p>
            ) : (
              <div className="mt-3">{alerts.map((a, i) => <AlertRow key={a.id} alert={a} first={i === 0} onDelete={() => handleDeleteAlert(a.id)} />)}</div>
            )}
          </section>

          {/* ── Charts — each in a corner-cut Panel ── */}
          <section>
            <SectionLabel accent="var(--accent-primary)">Tendencias</SectionLabel>
            <Panel cut="sm" className="p-6 sm:p-8 lg:p-10 mt-6">
              <Display size="md" upper>Tendencia de consultas</Display>
              <div className="h-52 sm:h-72 mt-7"><Line data={trendData} options={chartOptions} /></div>
            </Panel>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <Panel cut="sm" className="p-6 sm:p-8 lg:p-10">
              <Display size="md" upper>Por categoría</Display>
              <div className="h-52 sm:h-72 mt-7"><Doughnut data={categoryData} options={doughnutOptions} /></div>
            </Panel>
            <Panel cut="sm" className="p-6 sm:p-8 lg:p-10">
              <Display size="md" upper>Más consultadas</Display>
              <div className="h-52 sm:h-72 mt-7"><Bar data={topSubstancesData} options={chartOptions} /></div>
            </Panel>
          </section>

          {/* ── Privacy note ── */}
          <InlineNote label="Privacidad">
            Todos los datos son anónimos y almacenados localmente en tu dispositivo. No se comparte información personal.
          </InlineNote>
        </div>
      </div>
    </div>
  );
};
