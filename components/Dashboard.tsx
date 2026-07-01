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
import { Kicker, Display, MonoLabel } from './ui';
import { BarChart3, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const surfaceCard: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-surface)' };
const selectStyle: React.CSSProperties = { background: 'var(--surface-1)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-pill)', outline: 'none', width: '100%', padding: '10px 16px', fontSize: '14px' };

const getSeverityAccent = (s: TerritorialAlert['severity']) => ({ high: 'var(--color-red)', medium: 'var(--color-amber)', low: 'var(--color-blue)' }[s]);
const getSeverityLabel = (s: TerritorialAlert['severity']) => ({ high: 'URGENTE', medium: 'IMPORTANTE', low: 'INFO' }[s]);

const getTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000); const hours = Math.floor(diff / 3600000); const minutes = Math.floor(diff / 60000);
  if (days > 0) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
  if (hours > 0) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (minutes > 0) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  return 'Hace un momento';
};

const AlertRow: React.FC<{ alert: TerritorialAlert; onDelete: () => void; first: boolean }> = ({ alert, onDelete, first }) => {
  const accent = getSeverityAccent(alert.severity);
  const link = alert.sourceUrl || alert.pdfUrl;
  return (
    <div className="group flex gap-4 py-5" style={{ borderTop: first ? 'none' : '1px solid var(--border-subtle)' }}>
      <div className="flex-shrink-0 flex flex-col items-center pt-1.5" style={{ width: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
        <span className="flex-1 mt-2" style={{ width: '2px', background: `linear-gradient(${accent}, transparent)`, opacity: 0.4 }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>{getSeverityLabel(alert.severity)}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {alert.province}</span>
          <span className="text-xs ml-auto flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            {getTimeAgo(alert.timestamp)}
            <button onClick={onDelete} className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} title="Descartar alerta" aria-label="Descartar alerta"><X size={13} /></button>
          </span>
        </div>
        <h3 className="mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          {link ? <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>{alert.title} ↗</a> : alert.title}
        </h3>
        <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{alert.message}</p>
        {alert.source && (
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {link ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Fuente: {alert.source}</a> : `Fuente: ${alert.source}`}
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

  const accentRGB = '232, 122, 93';
  const trendData = useMemo(() => {
    const q = getQueriesByDate(timeRange);
    const dates = Object.keys(q).sort();
    return { labels: dates.map(d => { const dt = new Date(d); return `${dt.getDate()}/${dt.getMonth() + 1}`; }), datasets: [{ label: 'Consultas', data: dates.map(d => q[d]), borderColor: `rgb(${accentRGB})`, backgroundColor: `rgba(${accentRGB}, 0.12)`, tension: 0.3, fill: true }] };
  }, [timeRange]);

  const categoryData = useMemo(() => {
    const cats = Object.keys(stats.queriesByCategory);
    return { labels: cats, datasets: [{ label: 'Consultas por categoría', data: cats.map(c => stats.queriesByCategory[c as SubstanceCategory] || 0), backgroundColor: ['rgba(96, 165, 250, 0.65)', 'rgba(74, 222, 158, 0.65)', 'rgba(251, 191, 36, 0.65)', 'rgba(248, 113, 113, 0.65)', 'rgba(167, 139, 250, 0.65)', 'rgba(232, 122, 93, 0.65)'], borderColor: ['#60A5FA', '#4ADE9E', '#FBBF24', '#F87171', '#A78BFA', '#E87A5D'], borderWidth: 1 }] };
  }, [stats]);

  const topSubstancesData = useMemo(() => ({ labels: stats.topSubstances.map(s => s.name), datasets: [{ label: 'Consultas', data: stats.topSubstances.map(s => s.count), backgroundColor: `rgba(${accentRGB}, 0.65)`, borderColor: `rgb(${accentRGB})`, borderWidth: 1 }] }), [stats]);

  const textColor = 'rgb(180, 180, 180)';
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
    <div className="h-full w-full overflow-y-auto no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto w-full px-6 md:px-10 pt-10" style={{ paddingBottom: '120px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Kicker className="mb-3">Estadísticas</Kicker>
            <Display size="lg" upper>Dashboard</Display>
          </div>
          <span style={{ color: 'var(--accent-primary)' }}><BarChart3 size={24} /></span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} style={selectStyle}>
            <option value="all">Todas las provincias</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={selectStyle}>
            <option value="all">Todas las categorías</option>
            <option value="Estimulante">Estimulante</option><option value="Depresor">Depresor</option><option value="Psicodélico">Psicodélico</option><option value="Disociativo">Disociativo</option><option value="Empatógeno">Empatógeno</option><option value="Otro">Otro</option>
          </select>
          <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} style={selectStyle}>
            <option value={7}>Última semana</option><option value={30}>Último mes</option><option value={90}>Últimos 3 meses</option><option value={180}>Últimos 6 meses</option>
          </select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          {kpis.map((kpi, i) => (
            <div key={i} className="p-5 sm:p-7" style={surfaceCard}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 0.9, letterSpacing: '-0.03em', color: kpi.color, fontVariantNumeric: 'tabular-nums' }}>{kpi.value}</div>
              <p className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="mb-12">
          <MonoLabel color="var(--color-red)">Alertas territoriales · {alerts.length}</MonoLabel>
          {alerts.length === 0 ? (
            <p className="py-10 text-center" style={{ color: 'var(--text-muted)' }}>No hay alertas activas para esta provincia.</p>
          ) : (
            <div className="mt-3 p-6" style={surfaceCard}>{alerts.map((a, i) => <AlertRow key={a.id} alert={a} first={i === 0} onDelete={() => handleDeleteAlert(a.id)} />)}</div>
          )}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8" style={surfaceCard}>
            <MonoLabel>Tendencia de consultas</MonoLabel>
            <div className="h-52 sm:h-72 mt-6"><Line data={trendData} options={chartOptions} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8" style={surfaceCard}>
              <MonoLabel>Por categoría</MonoLabel>
              <div className="h-52 sm:h-72 mt-6"><Doughnut data={categoryData} options={doughnutOptions} /></div>
            </div>
            <div className="p-6 sm:p-8" style={surfaceCard}>
              <MonoLabel>Más consultadas</MonoLabel>
              <div className="h-52 sm:h-72 mt-6"><Bar data={topSubstancesData} options={chartOptions} /></div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6" style={{ borderLeft: '2px solid var(--accent-primary)' }}>
          <MonoLabel>Privacidad</MonoLabel>
          <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>Todos los datos son anónimos y se almacenan localmente en tu dispositivo. No se comparte información personal.</p>
        </div>
      </div>
    </div>
  );
};
