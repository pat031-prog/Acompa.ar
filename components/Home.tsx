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
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    setAlerts(getAlerts('all'));
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const urgentAlerts = alerts.filter(a => a.severity === 'high');
  const totalResources = LOCAL_RESOURCES.length;
  const freeResources = LOCAL_RESOURCES.filter(r => r.free).length;

  // Noticias simuladas - en producción vendría de una API
  const latestNews = [
    {
      id: 1,
      title: 'SEDRONAR lanza nueva campaña de reducción de riesgos',
      source: 'SEDRONAR',
      date: '2025-12-18',
      category: 'Políticas Públicas',
      summary: 'El organismo nacional presenta estrategias de cuidado en festivales y eventos masivos para el verano 2026.',
      url: '#'
    },
    {
      id: 2,
      title: 'Aumentan los puntos de testeo gratuito en CABA y GBA',
      source: 'Ministerio de Salud',
      date: '2025-12-15',
      category: 'Reducción de Daños',
      summary: 'Se instalan 12 nuevos puntos de análisis con reactivos para verificar composición de sustancias.',
      url: '#'
    },
    {
      id: 3,
      title: 'Estudio UBA: Cannabis medicinal en tratamiento del dolor crónico',
      source: 'Universidad de Buenos Aires',
      date: '2025-12-12',
      category: 'Investigación',
      summary: 'Nuevos resultados sobre eficacia y seguridad en pacientes con patologías específicas.',
      url: '#'
    }
  ];

  const tourSteps = [
    {
      icon: '💬',
      title: 'Chat Asistente',
      desc: 'Hacé preguntas sobre sustancias, efectos, interacciones y riesgos. IA entrenada con información científica.',
      action: 'Ir al Chat',
      tab: 'chat'
    },
    {
      icon: '📚',
      title: 'Biblioteca',
      desc: 'Explorá información detallada de más de 500 sustancias con datos de PsychonautWiki y fuentes científicas.',
      action: 'Ver Biblioteca',
      tab: 'library'
    },
    {
      icon: '🧪',
      title: 'Guía de Testeo',
      desc: 'Aprendé a usar reactivos para verificar la composición de sustancias y detectar adulteraciones.',
      action: 'Aprender a Testear',
      tab: 'testing'
    },
    {
      icon: '🗺️',
      title: 'Observatorio',
      desc: 'Consultá alertas territoriales SAT sobre sustancias adulteradas y estadísticas de consumo.',
      action: 'Ver Alertas',
      tab: 'observatory'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-paper-100)' }}>
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Bienvenida y Explicación */}
        <section
          className="space-y-4"
          style={{
            animation: 'fadeInUp 0.5s var(--ease-out-strong) both'
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1
                className="text-3xl sm:text-4xl font-semibold mb-2"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  lineHeight: 'var(--line-height-tight)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Bienvenido a Acompañ.Ar
              </h1>
              <p
                className="text-base sm:text-lg mb-4"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-600)',
                  lineHeight: 'var(--line-height-relaxed)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Tu plataforma de información basada en evidencia para la <strong style={{ color: 'var(--text-ink-900)' }}>reducción de riesgos y daños</strong> en contextos de consumo de sustancias.
              </p>
              <button
                onClick={() => setShowTour(!showTour)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--t-fast) var(--ease-standard)',
                  fontFamily: 'var(--font-ui)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                }}
              >
                {showTour ? '✕ Cerrar' : '🎯 Comenzar tour'} de la plataforma
              </button>
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

          {/* Tour de la Plataforma */}
          {showTour && (
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6"
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-ambient)',
                animation: 'scaleIn 0.3s var(--ease-out-strong) both'
              }}
            >
              {tourSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="text-center space-y-3"
                  style={{
                    animation: `fadeInUp 0.4s var(--ease-out-strong) ${idx * 0.1}s both`
                  }}
                >
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <h3
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-ink-900)'
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      color: 'var(--text-ink-600)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}
                  >
                    {step.desc}
                  </p>
                  <button
                    onClick={() => {
                      setShowTour(false);
                      onNavigate?.(step.tab);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-primary)',
                      fontFamily: 'var(--font-ui)',
                      transition: 'all var(--t-fast) var(--ease-standard)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-primary)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--accent-primary)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                  >
                    {step.action}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

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

        {/* Alertas y Noticias */}
        <section
          style={{
            animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.2s both'
          }}
        >
          <h2
            className="text-xl sm:text-2xl font-semibold mb-4"
            style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-900)',
              letterSpacing: 'var(--letter-spacing-tight)'
            }}
          >
            Información Destacada
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Alertas SAT */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3
                  className="text-base font-semibold flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  <span>⚠️</span> Alertas SAT
                </h3>
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
                  borderRadius: 'var(--radius-lg)',
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-sm"
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
                {alerts.slice(0, 2).map((alert, idx) => {
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
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--text-ink-900)'
                        }}
                      >
                        {alert.title}
                      </h4>
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
            </div>

            {/* Últimas Noticias */}
            <div className="space-y-4">
              <h3
                className="text-base font-semibold flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--text-ink-900)'
                }}
              >
                <span>📰</span> Últimas Noticias
              </h3>

              <div className="space-y-3">
                {latestNews.map((news, idx) => (
                  <div
                    key={news.id}
                    className="p-4"
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-ambient)',
                      transition: 'all var(--t-fast) var(--ease-standard)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 text-xs font-medium"
                        style={{
                          background: 'var(--accent-surface)',
                          color: 'var(--accent-primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-ui)'
                        }}
                      >
                        {news.category}
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--text-ink-400)'
                        }}
                      >
                        {new Date(news.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4
                      className="text-sm font-semibold mb-1"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-900)'
                      }}
                    >
                      {news.title}
                    </h4>
                    <p
                      className="text-xs mb-2"
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        color: 'var(--text-ink-600)',
                        lineHeight: 'var(--line-height-relaxed)'
                      }}
                    >
                      {news.summary}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-400)'
                      }}
                    >
                      Fuente: {news.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Acciones Rápidas */}
        <section
          style={{
            animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.3s both'
          }}
        >
          <h2
            className="text-xl sm:text-2xl font-semibold mb-4"
            style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-900)',
              letterSpacing: 'var(--letter-spacing-tight)'
            }}
          >
            Herramientas
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '💬',
                title: 'Chat',
                desc: 'Consultá al asistente IA',
                tab: 'chat',
                color: 'var(--accent-primary)'
              },
              {
                icon: '📚',
                title: 'Biblioteca',
                desc: '500+ sustancias',
                tab: 'library',
                color: '#3b82f6'
              },
              {
                icon: '🧪',
                title: 'Testeo',
                desc: 'Guía de reactivos',
                tab: 'testing',
                color: '#8b5cf6'
              },
              {
                icon: '📍',
                title: 'Recursos',
                desc: 'Centros de ayuda',
                tab: 'resources',
                color: '#22c55e'
              }
            ].map((tool, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(tool.tab)}
                className="p-4 text-left"
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-ambient)',
                  transition: 'all var(--t-medium) var(--ease-standard)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = tool.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3
                  className="text-base font-semibold mb-1"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  {tool.title}
                </h3>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--text-ink-600)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}
                >
                  {tool.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Información Destacada */}
        <section className="space-y-4">
          <h2
            className="text-lg font-semibold"
            style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-900)',
              letterSpacing: 'var(--letter-spacing-tight)',
              animation: 'fadeInUp 0.5s var(--ease-out-strong) 0.1s both'
            }}
          >
            Información Destacada
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Quick Actions + Featured Info */}
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
        </section>

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
