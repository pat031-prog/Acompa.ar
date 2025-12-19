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

interface HomeProps {
  onNavigate?: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setAlerts(getAlerts('all'));
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const urgentAlerts = alerts.filter(a => a.severity === 'high');
  const totalResources = LOCAL_RESOURCES.length;
  const freeResources = LOCAL_RESOURCES.filter(r => r.free).length;

  const quickActions = [
    {
      icon: '💬',
      title: 'Consultar',
      subtitle: 'Chat IA',
      desc: 'Preguntá sobre sustancias, efectos e interacciones',
      tab: 'chat',
      color: 'var(--accent-primary)'
    },
    {
      icon: '🧪',
      title: 'Testear',
      subtitle: 'Guía',
      desc: 'Aprendé a usar reactivos de forma segura',
      tab: 'testing',
      color: '#8b5cf6'
    },
    {
      icon: '📍',
      title: 'Buscar ayuda',
      subtitle: 'Recursos',
      desc: 'Centros de atención y líneas telefónicas',
      tab: 'resources',
      color: '#22c55e'
    },
    {
      icon: '🗺️',
      title: 'Ver alertas',
      subtitle: 'Observatorio',
      desc: 'Señales territoriales y estadísticas SAT',
      tab: 'observatory',
      color: '#ef4444'
    }
  ];

  const featuredInfo = [
    {
      icon: '🛡️',
      title: 'Reducción de Riesgos',
      desc: 'Estrategias basadas en evidencia científica para minimizar daños asociados al consumo de sustancias'
    },
    {
      icon: '🔬',
      title: 'Información Verificada',
      desc: 'Datos de PsychonautWiki, Energy Control, y organismos oficiales como SEDRONAR'
    },
    {
      icon: '📊',
      title: 'Sistema de Alertas',
      desc: 'Monitoreo territorial de sustancias adulteradas y alertas tempranas (SAT)'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-paper-100)' }}>
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div
          className="space-y-2"
          style={{
            animation: 'fadeInUp 0.5s var(--ease-out-strong) both'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-semibold"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  lineHeight: 'var(--line-height-tight)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Dashboard
              </h1>
              <p
                className="text-sm mt-1"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--text-ink-600)'
                }}
              >
                {currentTime.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2"
              style={{
                background: urgentAlerts.length > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${urgentAlerts.length > 0 ? '#ef4444' : 'var(--border-subtle)'}`
              }}
            >
              <span className="text-lg">{urgentAlerts.length > 0 ? '⚠️' : '✓'}</span>
              <span
                className="text-xs font-semibold"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: urgentAlerts.length > 0 ? '#ef4444' : 'var(--text-ink-600)'
                }}
              >
                {urgentAlerts.length > 0 ? `${urgentAlerts.length} Alerta${urgentAlerts.length > 1 ? 's' : ''} Urgente${urgentAlerts.length > 1 ? 's' : ''}` : 'Sistema Operativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          style={{
            animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.1s both'
          }}
        >
          <div
            className="p-4"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-ambient)'
            }}
          >
            <div className="text-2xl mb-2">📊</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: 'var(--font-editorial)',
                color: 'var(--text-ink-900)'
              }}
            >
              {alerts.length}
            </div>
            <div
              className="text-xs"
              style={{
                fontFamily: 'var(--font-ui)',
                color: 'var(--text-ink-600)'
              }}
            >
              Alertas activas
            </div>
          </div>

          <div
            className="p-4"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-ambient)'
            }}
          >
            <div className="text-2xl mb-2">📍</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: 'var(--font-editorial)',
                color: 'var(--text-ink-900)'
              }}
            >
              {totalResources}
            </div>
            <div
              className="text-xs"
              style={{
                fontFamily: 'var(--font-ui)',
                color: 'var(--text-ink-600)'
              }}
            >
              Recursos disponibles
            </div>
          </div>

          <div
            className="p-4"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-ambient)'
            }}
          >
            <div className="text-2xl mb-2">🆓</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: 'var(--font-editorial)',
                color: 'var(--text-ink-900)'
              }}
            >
              {freeResources}
            </div>
            <div
              className="text-xs"
              style={{
                fontFamily: 'var(--font-ui)',
                color: 'var(--text-ink-600)'
              }}
            >
              Gratuitos
            </div>
          </div>

          <div
            className="p-4"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-ambient)'
            }}
          >
            <div className="text-2xl mb-2">📚</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: 'var(--font-editorial)',
                color: 'var(--text-ink-900)'
              }}
            >
              500+
            </div>
            <div
              className="text-xs"
              style={{
                fontFamily: 'var(--font-ui)',
                color: 'var(--text-ink-600)'
              }}
            >
              Sustancias en base
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div
              style={{
                animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.2s both'
              }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Acciones rápidas
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate?.(action.tab)}
                    className="text-left p-4 group"
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-ambient)',
                      transition: 'all var(--t-medium) var(--ease-standard)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="text-3xl"
                        style={{
                          transition: 'transform var(--t-medium) var(--ease-out-strong)'
                        }}
                      >
                        {action.icon}
                      </div>
                      <div
                        style={{
                          color: action.color,
                          opacity: 0,
                          transition: 'opacity var(--t-fast) var(--ease-standard)'
                        }}
                        className="group-hover:opacity-100"
                      >
                        <ArrowRightIcon />
                      </div>
                    </div>
                    <h3
                      className="text-base font-semibold mb-1"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-900)'
                      }}
                    >
                      {action.title}
                    </h3>
                    <p
                      className="text-xs font-medium mb-2"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: action.color,
                        opacity: 0.8
                      }}
                    >
                      {action.subtitle}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        color: 'var(--text-ink-600)',
                        lineHeight: 'var(--line-height-relaxed)'
                      }}
                    >
                      {action.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Info */}
            <div
              style={{
                animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.3s both'
              }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Sobre la plataforma
              </h2>
              <div className="space-y-3">
                {featuredInfo.map((info, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex gap-4"
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div className="text-2xl flex-shrink-0">{info.icon}</div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-1"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--text-ink-900)'
                        }}
                      >
                        {info.title}
                      </h3>
                      <p
                        className="text-xs"
                        style={{
                          fontFamily: 'var(--font-editorial)',
                          color: 'var(--text-ink-600)',
                          lineHeight: 'var(--line-height-relaxed)'
                        }}
                      >
                        {info.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Alerts */}
          <div
            className="space-y-4"
            style={{
              animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.4s both'
            }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-semibold"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Alertas SAT
              </h2>
              <button
                onClick={() => onNavigate?.('observatory')}
                className="text-xs font-medium flex items-center gap-1"
                style={{
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-ui)',
                  transition: 'gap var(--t-fast) var(--ease-standard)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.gap = '6px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.gap = '4px';
                }}
              >
                Ver todas
                <ArrowRightIcon />
              </button>
            </div>

            {/* Emergency CTA */}
            <div
              className="p-4 border-l-4"
              style={{
                background: 'var(--bg-surface)',
                borderColor: '#ef4444',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-ambient)',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚨</span>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-ink-900)'
                    }}
                  >
                    Emergencias
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-ink-600)'
                    }}
                  >
                    SAME 107 — 24/7
                  </p>
                </div>
              </div>
              <a
                href="tel:107"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-sm"
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  transition: `all var(--t-fast) var(--ease-standard)`,
                  fontFamily: 'var(--font-ui)',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                📞 Llamar ahora
              </a>
            </div>

            {/* Alert Cards */}
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert, idx) => {
                const severityStyle = getSeverityStyle(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className="p-4 border-l-4"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: severityStyle.color,
                      borderRadius: 'var(--radius-lg)',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      boxShadow: 'var(--shadow-ambient)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 text-xs font-semibold"
                        style={{
                          background: severityStyle.bg,
                          color: severityStyle.color,
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-ui)'
                        }}
                      >
                        {severityStyle.label}
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--text-ink-400)'
                        }}
                      >
                        {getTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-900)'
                      }}
                    >
                      {alert.title}
                    </h3>
                    <p
                      className="text-xs line-clamp-2"
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        color: 'var(--text-ink-600)',
                        lineHeight: 'var(--line-height-relaxed)'
                      }}
                    >
                      {alert.message}
                    </p>
                    <p
                      className="text-xs mt-2"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-400)'
                      }}
                    >
                      📍 {alert.province}
                    </p>
                  </div>
                );
              })}
            </div>

            {alerts.length > 3 && (
              <button
                onClick={() => onNavigate?.('observatory')}
                className="w-full p-3 text-sm font-medium"
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--text-ink-600)',
                  fontFamily: 'var(--font-ui)',
                  transition: 'all var(--t-fast) var(--ease-standard)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface)';
                  e.currentTarget.style.borderStyle = 'solid';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderStyle = 'dashed';
                }}
              >
                Ver {alerts.length - 3} alerta{alerts.length - 3 !== 1 ? 's' : ''} más
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="p-4 text-center"
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.5s both'
          }}
        >
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-600)',
              lineHeight: 'var(--line-height-relaxed)'
            }}
          >
            <strong style={{ color: 'var(--text-ink-900)' }}>Esta plataforma NO promueve el consumo de sustancias.</strong> Brindamos información basada en evidencia para reducción de riesgos y daños. La información es educativa y no sustituye el consejo médico profesional.
          </p>
        </div>
      </div>
    </div>
  );
};
