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
import { PageHeader, SectionLabel } from './ui';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const ChartBarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
);
const ExclamationTriangleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);

const getSeverityStyle = (severity: TerritorialAlert['severity']): { bg: string; border: string; accent: string } => ({
  high: { bg: 'var(--color-red-subtle)', border: 'var(--color-red-medium)', accent: 'var(--color-red)' },
  medium: { bg: 'var(--color-amber-subtle)', border: 'var(--color-amber-medium)', accent: 'var(--color-amber)' },
  low: { bg: 'var(--color-blue-subtle)', border: 'var(--color-blue-medium)', accent: 'var(--color-blue)' },
}[severity]);

const getSeverityBadge = (severity: TerritorialAlert['severity']) => ({
  high: { label: 'URGENTE', bg: 'var(--color-red)', color: '#fff' },
  medium: { label: 'IMPORTANTE', bg: 'var(--color-amber)', color: '#1a1a2e' },
  low: { label: 'INFO', bg: 'var(--color-blue)', color: '#fff' },
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
  return (
    <div className="group flex gap-4 py-5" style={{ borderTop: first ? 'none' : '1px solid var(--border-subtle)' }}>
      {/* severity rail */}
      <div className="flex-shrink-0 flex flex-col items-center pt-1.5" style={{ width: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.accent }} />
        <span className="flex-1 mt-2" style={{ width: '2px', background: `linear-gradient(${style.accent}, transparent)`, opacity: 0.4 }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: style.accent }}>{badge.label}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {alert.province}</span>
          <span className="text-xs ml-auto flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            {getTimeAgo(alert.timestamp)}
            <button onClick={onDelete} className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} title="Descartar alerta" aria-label="Descartar alerta">✕</button>
          </span>
        </div>
        <h3 className="font-semibold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>
          {alert.sourceUrl || alert.pdfUrl ? (
            <a href={alert.sourceUrl || alert.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--text-primary)' }}>
              {alert.title} <span className="inline-block ml-0.5" style={{ color: style.accent }}>↗</span>
            </a>
          ) : (
            alert.title
          )}
        </h3>
        <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{alert.message}</p>
        {alert.source && (
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {alert.sourceUrl || alert.pdfUrl ? (
              <a href={alert.sourceUrl || alert.pdfUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Fuente: {alert.source}</a>
            ) : `Fuente: ${alert.source}`}
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', outline: 'none', width: '100%', padding: '10px 12px', fontSize: '14px' };

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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader
        eyebrow="Estadísticas"
        title="Dashboard de gestión"
        description="Análisis de consultas, tendencias y alertas territoriales."
      />

      <div className="p-6 sm:p-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Provincia</label>
            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} style={inputStyle}>
              <option value="all">Todas las provincias</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Categoría</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={inputStyle}>
              <option value="all">Todas las categorías</option>
              <option value="Estimulante">Estimulante</option><option value="Depresor">Depresor</option><option value="Psicodélico">Psicodélico</option><option value="Disociativo">Disociativo</option><option value="Empatógeno">Empatógeno</option><option value="Otro">Otro</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Período</label>
            <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} style={inputStyle}>
              <option value={7}>Última semana</option><option value={30}>Último mes</option><option value={90}>Últimos 3 meses</option><option value={180}>Últimos 6 meses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8 py-6">
        <div className="max-w-6xl space-y-9">
          {/* KPIs — a ruled 3-cell strip, no boxes */}
          <div className="grid grid-cols-3" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            {[
              { label: 'Total de consultas', value: stats.totalQueries, color: 'var(--text-primary)' },
              { label: 'Sustancias únicas', value: stats.topSubstances.length, color: 'var(--accent-primary)' },
              { label: 'Categorías activas', value: Object.keys(stats.queriesByCategory).length, color: 'var(--text-primary)' },
            ].map((kpi, i) => (
              <div key={i} className="py-5" style={{ borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none', paddingLeft: i > 0 ? '24px' : 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: kpi.color }}>{kpi.value}</p>
                <p className="mt-2" style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>

          <div>
            <SectionLabel accent="var(--color-red)" count={alerts.length}>Alertas territoriales</SectionLabel>
            {alerts.length === 0 ? (
              <p className="py-10 text-center" style={{ color: 'var(--text-muted)' }}>No hay alertas activas para esta provincia.</p>
            ) : (
              <div className="mt-1">{alerts.map((a, i) => <AlertRow key={a.id} alert={a} first={i === 0} onDelete={() => handleDeleteAlert(a.id)} />)}</div>
            )}
          </div>

          <div className="p-5 sm:p-6 lg:p-8" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-5 lg:mb-6" style={{ color: 'var(--text-primary)' }}>Tendencia de Consultas</h3>
            <div className="h-48 sm:h-64"><Line data={trendData} options={chartOptions} /></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <div className="p-5 sm:p-6 lg:p-8" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-5 lg:mb-6" style={{ color: 'var(--text-primary)' }}>Por Categoría</h3>
              <div className="h-48 sm:h-64"><Doughnut data={categoryData} options={doughnutOptions} /></div>
            </div>
            <div className="p-5 sm:p-6 lg:p-8" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-5 lg:mb-6" style={{ color: 'var(--text-primary)' }}>Sustancias Más Consultadas</h3>
              <div className="h-48 sm:h-64"><Bar data={topSubstancesData} options={chartOptions} /></div>
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>📊 Todos los datos son anónimos y almacenados localmente en tu dispositivo. No se comparte información personal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
