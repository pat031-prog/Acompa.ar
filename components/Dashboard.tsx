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

// Icons
const ChartBarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ExclamationTriangleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

const getSeverityColor = (severity: TerritorialAlert['severity']) => {
  const colorMap = {
    high: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
    medium: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
    low: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
  };
  return colorMap[severity];
};

const getSeverityBadge = (severity: TerritorialAlert['severity']) => {
  const badgeMap = {
    high: { label: 'URGENTE', color: 'bg-red-500 text-white' },
    medium: { label: 'IMPORTANTE', color: 'bg-yellow-500 text-gray-900' },
    low: { label: 'INFO', color: 'bg-blue-500 text-white' },
  };
  return badgeMap[severity];
};

const AlertCard: React.FC<{ alert: TerritorialAlert; onDelete: () => void }> = ({ alert, onDelete }) => {
  const badge = getSeverityBadge(alert.severity);
  const timeAgo = getTimeAgo(alert.timestamp);

  const getBorderColor = (severity: TerritorialAlert['severity']) => {
    const colors = {
      high: 'border-l-red-500/60',
      medium: 'border-l-yellow-500/60',
      low: 'border-l-blue-500/60',
    };
    return colors[severity];
  };

  return (
    <div className={`border rounded-lg p-5 sm:p-6 border-l-2 ${getSeverityColor(alert.severity)} ${getBorderColor(alert.severity)}`}>
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <ExclamationTriangleIcon />
          <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-xs opacity-75">{alert.province}</span>
        </div>
        <button
          onClick={onDelete}
          className="text-sm sm:text-xs opacity-50 hover:opacity-100 active:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 flex items-center justify-center"
          title="Descartar alerta"
          aria-label="Descartar alerta"
        >
          ✕
        </button>
      </div>

      <h3 className="font-semibold text-sm sm:text-base mb-1">{alert.title}</h3>
      <p className="text-xs sm:text-sm opacity-90 mb-2">{alert.message}</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs opacity-75">
        <span className="truncate">{alert.source && `Fuente: ${alert.source}`}</span>
        <span className="flex-shrink-0">{timeAgo}</span>
      </div>
    </div>
  );
};

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor(diff / (60 * 1000));

  if (days > 0) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
  if (hours > 0) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (minutes > 0) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  return 'Hace un momento';
};

export const Dashboard: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(30); // days
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);

  useEffect(() => {
    setAlerts(getAlerts(selectedProvince));
  }, [selectedProvince]);

  const stats = useMemo(() => {
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
    return getAnalyticsStats(
      startDate,
      undefined,
      selectedProvince !== 'all' ? selectedProvince : undefined,
      selectedCategory !== 'all' ? (selectedCategory as SubstanceCategory) : undefined
    );
  }, [selectedProvince, selectedCategory, timeRange]);

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
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [timeRange]);

  const categoryData = useMemo(() => {
    const categories = Object.keys(stats.queriesByCategory);
    const values = categories.map(cat => stats.queriesByCategory[cat as SubstanceCategory] || 0);

    return {
      labels: categories,
      datasets: [
        {
          label: 'Consultas por categoría',
          data: values,
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(239, 68, 68, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(236, 72, 153, 0.6)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [stats]);

  const topSubstancesData = useMemo(() => {
    return {
      labels: stats.topSubstances.map(s => s.name),
      datasets: [
        {
          label: 'Consultas',
          data: stats.topSubstances.map(s => s.count),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
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
          color: 'rgb(209, 213, 219)',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: window.innerWidth < 640 ? 8 : 10,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: { size: window.innerWidth < 640 ? 9 : 11 },
        },
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: { size: window.innerWidth < 640 ? 9 : 11 },
        },
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: window.innerWidth < 640 ? 6 : 8,
        },
      },
    },
  };

  const handleDeleteAlert = (id: string) => {
    deleteAlert(id);
    setAlerts(getAlerts(selectedProvince));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
          <ChartBarIcon />
          <span className="hidden sm:inline">Dashboard de Estadísticas</span>
          <span className="sm:hidden">Estadísticas</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Análisis de consultas, tendencias y alertas territoriales
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Provincia</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todas las provincias</option>
              {PROVINCES.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todas las categorías</option>
              <option value="Estimulante">Estimulante</option>
              <option value="Depresor">Depresor</option>
              <option value="Psicodélico">Psicodélico</option>
              <option value="Disociativo">Disociativo</option>
              <option value="Empatógeno">Empatógeno</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Período</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={7}>Última semana</option>
              <option value={30}>Último mes</option>
              <option value={90}>Últimos 3 meses</option>
              <option value={180}>Últimos 6 meses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Alerts Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-4 sm:mb-5 flex items-center gap-2">
              <ExclamationTriangleIcon />
              Alertas Territoriales ({alerts.length})
            </h2>

            {alerts.length === 0 ? (
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-10 sm:p-12 text-center">
                <p className="text-gray-400">No hay alertas activas para esta provincia.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:gap-6">
                {alerts.map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDelete={() => handleDeleteAlert(alert.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <div className="bg-white/[0.02] border border-white/[0.06] border-l-2 border-l-blue-500/40 rounded-lg p-6 sm:p-8">
              <h3 className="text-sm font-medium text-white/60 mb-1">Total de Consultas</h3>
              <p className="text-3xl font-bold text-white">{stats.totalQueries}</p>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] border-l-2 border-l-green-500/40 rounded-lg p-6 sm:p-8">
              <h3 className="text-sm font-medium text-white/60 mb-1">Sustancias Únicas</h3>
              <p className="text-3xl font-bold text-white">{stats.topSubstances.length}</p>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] border-l-2 border-l-purple-500/40 rounded-lg p-6 sm:p-8">
              <h3 className="text-sm font-medium text-white/60 mb-1">Categorías Activas</h3>
              <p className="text-3xl font-bold text-white">{Object.keys(stats.queriesByCategory).length}</p>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-5 sm:p-6 lg:p-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-200 mb-4 sm:mb-5 lg:mb-6">Tendencia de Consultas</h3>
            <div className="h-48 sm:h-64">
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>

          {/* Category & Top Substances Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-5 sm:p-6 lg:p-8">
              <h3 className="text-sm sm:text-base font-semibold text-gray-200 mb-4 sm:mb-5 lg:mb-6">Por Categoría</h3>
              <div className="h-48 sm:h-64">
                <Doughnut data={categoryData} options={doughnutOptions} />
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-5 sm:p-6 lg:p-8">
              <h3 className="text-sm sm:text-base font-semibold text-gray-200 mb-4 sm:mb-5 lg:mb-6">Sustancias Más Consultadas</h3>
              <div className="h-48 sm:h-64">
                <Bar data={topSubstancesData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-500 text-center">
              📊 Todos los datos son anónimos y almacenados localmente en tu dispositivo. No se comparte información personal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
