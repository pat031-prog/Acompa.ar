import React, { useState, useEffect } from 'react';
import { getAlerts, type TerritorialAlert } from '../services/analyticsService';
import { LOCAL_RESOURCES } from '../constants';

const ArrowRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const getSeverityStyle = (severity: TerritorialAlert['severity']) => {
  const styles = {
    high: { bg: 'rgba(239, 68, 68, 0.10)', border: 'rgba(239, 68, 68, 0.25)', color: '#f87171', label: 'URGENTE' },
    medium: { bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.20)', color: '#fbbf24', label: 'IMPORTANTE' },
    low: { bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.20)', color: '#60a5fa', label: 'INFO' }
  };
  return styles[severity];
};

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `Hace ${years} año${years > 1 ? 's' : ''}`;
  if (months > 0) return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  if (days > 0) return `Hace ${days}d`;
  return 'Hoy';
};

interface HomeProps {
  onNavigate?: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);
  const [showTour, setShowTour] = useState(false);
  const [alertFilter, setAlertFilter] = useState<'all' | '2025' | '2024'>('all');

  useEffect(() => {
    setAlerts(getAlerts('all'));
  }, []);

  const urgentAlerts = alerts.filter(a => a.severity === 'high');
  const totalResources = LOCAL_RESOURCES.length;
  const freeResources = LOCAL_RESOURCES.filter(r => r.free).length;

  const filteredAlerts = alertFilter === 'all'
    ? alerts
    : alerts.filter(a => a.year === parseInt(alertFilter));

  const tourSteps = [
    { icon: '💬', title: 'Chat Asistente', desc: 'Hacé preguntas sobre sustancias, efectos, interacciones y riesgos. IA entrenada con información científica.', action: 'Ir al Chat', tab: 'chat' },
    { icon: '📚', title: 'Biblioteca', desc: 'Explorá información detallada de más de 500 sustancias con datos de PsychonautWiki y fuentes científicas.', action: 'Ver Biblioteca', tab: 'library' },
    { icon: '🧪', title: 'Guía de Testeo', desc: 'Aprendé a usar reactivos para verificar la composición de sustancias y detectar adulteraciones.', action: 'Aprender a Testear', tab: 'testing' },
    { icon: '🗺️', title: 'Observatorio', desc: 'Consultá alertas territoriales SAT sobre sustancias adulteradas y estadísticas de consumo.', action: 'Ver Alertas', tab: 'observatory' }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">

        {/* ── Welcome ── */}
        <section style={{ animation: 'fadeInUp 0.4s var(--ease-out-strong) both' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[260px]">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-editorial)', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
              >
                Bienvenido a Acompañ<span style={{ color: 'var(--accent-primary)' }}>.</span>Ar
              </h1>
              <p className="text-sm sm:text-base mb-4" style={{ fontFamily: 'var(--font-editorial)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Plataforma de información basada en evidencia para la <strong style={{ color: 'var(--text-primary)' }}>reducción de riesgos y daños</strong> en contextos de consumo de sustancias.
              </p>
              <button
                onClick={() => setShowTour(!showTour)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: showTour ? 'var(--surface-active)' : 'var(--accent-primary)',
                  color: showTour ? 'var(--text-secondary)' : '#fff',
                  borderRadius: 'var(--radius-sm)',
                  border: showTour ? '1px solid var(--border-medium)' : 'none',
                  boxShadow: showTour ? 'none' : '0 2px 8px rgba(199, 112, 92, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  if (!showTour) e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 112, 92, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (!showTour) e.currentTarget.style.boxShadow = '0 2px 8px rgba(199, 112, 92, 0.25)';
                }}
              >
                {showTour ? 'Cerrar tour' : 'Recorrer la plataforma'}
              </button>
            </div>
            {urgentAlerts.length > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all duration-300"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  animation: 'fadeInUp 0.4s var(--ease-out-strong) 0.1s both'
                }}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
                {urgentAlerts.length} Alerta{urgentAlerts.length > 1 ? 's' : ''} Urgente{urgentAlerts.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Tour */}
          {showTour && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              {tourSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => { onNavigate?.(step.tab); setShowTour(false); }}
                  className="text-left p-4 group transition-all duration-300"
                  style={{
                    background: 'var(--surface-1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    animation: `fadeInUp 0.3s var(--ease-out-strong) ${idx * 0.05}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div className="text-2xl mb-2" style={{ display: 'inline-block', transition: 'transform 0.2s' }}>{step.icon}</div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)', lineHeight: '1.5' }}>{step.desc}</p>
                  <span className="text-xs font-medium flex items-center gap-1 transition-all" style={{ color: 'var(--accent-primary)' }}>
                    {step.action} <ArrowRightIcon />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Alertas SAT activas', value: alerts.length.toString(), sub: `${urgentAlerts.length} urgentes`, color: '#f87171' },
            { label: 'Recursos verificados', value: totalResources.toString(), sub: 'centros de atención', color: 'var(--accent-primary)' },
            { label: 'Gratuitos', value: freeResources.toString(), sub: 'acceso libre', color: '#34d399' },
            { label: 'Sustancias', value: '500+', sub: 'en biblioteca', color: '#60a5fa' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-4 transition-all duration-300"
              style={{
                background: 'var(--surface-1)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                animation: `fadeInUp 0.3s var(--ease-out-strong) ${0.08 + idx * 0.04}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <p className="text-2xl font-bold transition-transform duration-200" style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</p>
              <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{stat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Alertas SAT Reales ── */}
        <section style={{ animation: 'fadeInUp 0.4s var(--ease-out-strong) 0.1s both' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Alertas SAT
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Fuente: <a href="https://www.argentina.gob.ar/sat/alertas" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>argentina.gob.ar/sat</a>
              </p>
            </div>
            <div className="flex gap-1">
              {(['all', '2025', '2024'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setAlertFilter(filter)}
                  className="px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: alertFilter === filter ? 'var(--accent-subtle)' : 'var(--surface)',
                    color: alertFilter === filter ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${alertFilter === filter ? 'var(--accent-medium)' : 'var(--border-subtle)'}`
                  }}
                >
                  {filter === 'all' ? 'Todas' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Banner */}
          <div
            className="p-4 mb-4 flex items-center gap-3"
            style={{ background: 'rgba(239, 68, 68, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.15)' }}
          >
            <span className="text-xl flex-shrink-0">🚨</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Emergencias: SAME 107 — 24/7</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Ante sospecha de intoxicación, llamá inmediatamente</p>
            </div>
            <a
              href="tel:107"
              className="flex-shrink-0 px-4 py-2 text-xs font-bold"
              style={{ background: '#ef4444', color: '#fff', borderRadius: 'var(--radius-sm)' }}
            >
              Llamar 107
            </a>
          </div>

          {/* Alert Cards */}
          <div className="space-y-2">
            {filteredAlerts.slice(0, 8).map((alert, idx) => {
              const style = getSeverityStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  className="p-4 transition-all duration-300"
                  style={{
                    background: style.bg,
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${style.color}`,
                    border: `1px solid ${style.border}`,
                    borderLeftWidth: '3px',
                    borderLeftColor: style.color,
                    animation: `fadeInUp 0.3s var(--ease-out-strong) ${0.15 + idx * 0.03}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{ background: `${style.color}22`, color: style.color, borderRadius: '4px' }}
                        >
                          {style.label}
                        </span>
                        {alert.alertNumber && (
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            {alert.alertNumber}
                          </span>
                        )}
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {alert.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {alert.substances?.slice(0, 3).map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-medium" style={{ background: 'var(--surface-active)', color: 'var(--text-secondary)', borderRadius: '4px' }}>
                          {sub}
                        </span>
                      ))}
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {alert.province}
                      </span>
                    </div>
                    {alert.pdfUrl && (
                      <a
                        href={alert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium flex items-center gap-1"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        Ver informe PDF <ArrowRightIcon />
                      </a>
                    )}
                  </div>
                  {alert.source && (
                    <p className="text-[10px] mt-2 pt-2" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
                      Fuente: {alert.source}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAlerts.length > 8 && (
            <button
              onClick={() => onNavigate?.('observatory')}
              className="w-full mt-3 p-3 text-xs font-medium text-center"
              style={{ background: 'var(--surface)', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)' }}
            >
              Ver {filteredAlerts.length - 8} alerta{filteredAlerts.length - 8 !== 1 ? 's' : ''} más en el Observatorio
            </button>
          )}
        </section>

        {/* ── Herramientas ── */}
        <section style={{ animation: 'fadeInUp 0.4s var(--ease-out-strong) 0.15s both' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Herramientas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: '💬', title: 'Chat IA', desc: 'Consultá al asistente sobre sustancias', tab: 'chat', accent: 'var(--accent-primary)' },
              { icon: '📚', title: 'Biblioteca', desc: '500+ sustancias documentadas', tab: 'library', accent: '#60a5fa' },
              { icon: '🧪', title: 'Guía de Testeo', desc: 'Reactivos y verificación', tab: 'testing', accent: '#a78bfa' },
              { icon: '📍', title: 'Recursos', desc: 'Centros de atención cercanos', tab: 'resources', accent: '#34d399' },
            ].map((tool, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(tool.tab)}
                className="text-left p-4 group transition-all duration-300"
                style={{
                  background: 'var(--surface-1)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.3s var(--ease-out-strong) ${0.2 + idx * 0.05}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tool.accent;
                  e.currentTarget.style.background = 'var(--surface-2)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  const icon = e.currentTarget.querySelector('.tool-icon') as HTMLElement;
                  if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--surface-1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  const icon = e.currentTarget.querySelector('.tool-icon') as HTMLElement;
                  if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                <div className="tool-icon text-2xl mb-2 transition-transform duration-200">{tool.icon}</div>
                <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{tool.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{tool.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <div
          className="p-4 text-center"
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', animation: 'fadeInUp 0.4s var(--ease-out-strong) 0.2s both' }}
        >
          <p className="text-xs" style={{ fontFamily: 'var(--font-editorial)', color: 'var(--text-tertiary)', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Esta plataforma NO promueve el consumo de sustancias.</strong> Brindamos información basada en evidencia para reducción de riesgos y daños. La información es educativa y no sustituye el consejo médico profesional.
          </p>
        </div>
      </div>
    </div>
  );
};
