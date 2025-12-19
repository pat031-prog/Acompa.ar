import React, { useState, useEffect } from 'react';
import { Section, Callout, Chip, Divider } from './ui/Section';
import { getAlerts, type TerritorialAlert } from '../services/analyticsService';

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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setAlerts(getAlerts('all'));
  }, []);

  const tools = [
    {
      icon: '💬',
      title: 'Chat',
      subtitle: 'Asistente IA',
      desc: 'Consultá sobre sustancias, efectos e interacciones',
      tab: 'chat',
      gradient: 'linear-gradient(135deg, rgba(217, 119, 87, 0.08) 0%, rgba(217, 119, 87, 0.02) 100%)',
      accentColor: 'var(--accent-primary)'
    },
    {
      icon: '🗺️',
      title: 'Observatorio',
      subtitle: 'Alertas SAT',
      desc: 'Señales territoriales y estadísticas en tiempo real',
      tab: 'observatory',
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
      accentColor: '#ef4444'
    },
    {
      icon: '📚',
      title: 'Biblioteca',
      subtitle: 'Base de datos',
      desc: 'Información detallada sobre sustancias',
      tab: 'library',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
      accentColor: '#3b82f6'
    },
    {
      icon: '🧪',
      title: 'Testeo',
      subtitle: 'Guía práctica',
      desc: 'Aprendé a testear con reactivos',
      tab: 'testing',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.02) 100%)',
      accentColor: '#8b5cf6'
    },
    {
      icon: '📍',
      title: 'Recursos',
      subtitle: 'Red de ayuda',
      desc: 'Centros y líneas de atención',
      tab: 'resources',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 100%)',
      accentColor: '#22c55e'
    },
    {
      icon: '🔔',
      title: 'Recordatorios',
      subtitle: 'Cuidado personal',
      desc: 'Configurá alertas de reducción de riesgos',
      tab: 'reminders',
      gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(251, 146, 60, 0.02) 100%)',
      accentColor: '#fb923c'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-paper-100)' }}>
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* Compact Hero Section */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6 lg:gap-8 mb-8">
          {/* Left: Hero Content */}
          <div className="space-y-6">
            <header
              className="space-y-3"
              style={{
                animation: 'fadeInUp 0.6s var(--ease-out-strong) both'
              }}
            >
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-900)',
                  lineHeight: 'var(--line-height-tight)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Reducción de riesgos
                <br />
                basada en evidencia
              </h1>
              <p
                className="text-base sm:text-lg max-w-xl"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-600)',
                  lineHeight: 'var(--line-height-relaxed)',
                  letterSpacing: 'var(--letter-spacing-tight)'
                }}
              >
                Información, asistencia y recursos para estrategias de cuidado en contextos de consumo
              </p>
            </header>

            {/* Emergency CTA - Compact */}
            <div
              className="p-5 border-l-4 flex items-center gap-4"
              style={{
                background: 'var(--bg-surface)',
                borderColor: '#ef4444',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-ambient)',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                animation: 'fadeInUp 0.6s var(--ease-out-strong) 0.1s both'
              }}
            >
              <span className="text-3xl">🚨</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold mb-1"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  Emergencias médicas
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-600)'
                  }}
                >
                  SAME 107 — Disponible 24/7 en todo el país
                </p>
              </div>
              <a
                href="tel:107"
                className="flex-shrink-0 px-4 py-2 font-semibold text-sm"
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  transition: `all var(--t-fast) var(--ease-standard)`,
                  fontFamily: 'var(--font-ui)',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Llamar
              </a>
            </div>
          </div>

          {/* Right: Latest Alert Preview */}
          {alerts.length > 0 && (
            <div
              className="lg:sticky lg:top-6"
              style={{
                animation: 'fadeInUp 0.6s var(--ease-out-strong) 0.2s both',
                alignSelf: 'start'
              }}
            >
              <div
                className="p-5 border-l-4"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: getSeverityStyle(alerts[0].severity).color,
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lifted)',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2.5 py-1 text-xs font-semibold"
                    style={{
                      background: getSeverityStyle(alerts[0].severity).bg,
                      color: getSeverityStyle(alerts[0].severity).color,
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-ui)'
                    }}
                  >
                    {getSeverityStyle(alerts[0].severity).label}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-ink-400)'
                    }}
                  >
                    {getTimeAgo(alerts[0].timestamp)}
                  </span>
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  {alerts[0].title}
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--text-ink-600)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}
                >
                  {alerts[0].message}
                </p>
                <button
                  onClick={() => onNavigate?.('observatory')}
                  className="text-sm font-medium flex items-center gap-1"
                  style={{
                    color: getSeverityStyle(alerts[0].severity).color,
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
                  Ver todas las alertas
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modern Tool Grid */}
        <div className="mb-8">
          <h2
            className="text-xl sm:text-2xl font-semibold mb-6"
            style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-900)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              animation: 'fadeInUp 0.6s var(--ease-out-strong) 0.3s both'
            }}
          >
            Explorá las herramientas
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(tool.tab)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden text-left"
                style={{
                  background: hoveredCard === idx ? tool.gradient : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: `1px solid ${hoveredCard === idx ? 'transparent' : 'var(--border-subtle)'}`,
                  boxShadow: hoveredCard === idx ? 'var(--shadow-lifted)' : 'var(--shadow-ambient)',
                  transition: `all var(--t-medium) var(--ease-standard)`,
                  transform: hoveredCard === idx ? 'translateY(-4px)' : 'translateY(0)',
                  animation: `fadeInUp 0.5s var(--ease-out-strong) ${0.4 + idx * 0.05}s both`,
                  cursor: 'pointer'
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: tool.accentColor,
                    opacity: hoveredCard === idx ? 1 : 0,
                    transition: `opacity var(--t-medium) var(--ease-standard)`
                  }}
                />

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="text-4xl"
                      style={{
                        transform: hoveredCard === idx ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                        transition: `transform var(--t-medium) var(--ease-out-strong)`
                      }}
                    >
                      {tool.icon}
                    </div>
                    <div
                      style={{
                        opacity: hoveredCard === idx ? 1 : 0,
                        transform: hoveredCard === idx ? 'translateX(0)' : 'translateX(-8px)',
                        transition: `all var(--t-fast) var(--ease-standard)`,
                        color: tool.accentColor
                      }}
                    >
                      <ArrowRightIcon />
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <h3
                      className="text-lg font-semibold"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-900)'
                      }}
                    >
                      {tool.title}
                    </h3>
                    <p
                      className="text-xs font-medium"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: tool.accentColor,
                        opacity: 0.8
                      }}
                    >
                      {tool.subtitle}
                    </p>
                  </div>

                  <p
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      color: 'var(--text-ink-600)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}
                  >
                    {tool.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Compact About Section */}
        <details
          className="group"
          style={{
            animation: 'fadeInUp 0.6s var(--ease-out-strong) 0.7s both'
          }}
        >
          <summary
            className="cursor-pointer list-none p-5"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-ambient)',
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-ink-900)',
              fontWeight: 600,
              fontSize: '14px',
              transition: `all var(--t-fast) var(--ease-standard)`
            }}
          >
            <div className="flex items-center justify-between">
              <span>Sobre esta plataforma</span>
              <span
                style={{
                  transition: 'transform var(--t-medium) var(--ease-standard)',
                  transform: 'rotate(0deg)',
                  display: 'inline-block'
                }}
                className="group-open:rotate-180"
              >
                ▼
              </span>
            </div>
          </summary>

          <div
            className="mt-4 p-6 space-y-4"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-ambient)',
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-600)',
              fontSize: '14px',
              lineHeight: 'var(--line-height-relaxed)'
            }}
          >
            <div>
              <p className="mb-2">
                <strong style={{ color: 'var(--text-ink-900)', fontFamily: 'var(--font-ui)' }}>
                  Esta plataforma NO promueve ni hace apología del consumo de sustancias.
                </strong>
              </p>
              <p>
                Nuestro propósito es brindar información basada en evidencia para reducir riesgos y daños asociados al consumo. Operamos sin fines de lucro y sin conflictos de interés.
              </p>
            </div>

            <div
              className="text-xs"
              style={{
                fontFamily: 'var(--font-ui)',
                color: 'var(--text-ink-400)',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <p>
                La información proporcionada tiene fines educativos y no sustituye el consejo médico profesional. Los datos son anónimos y se almacenan localmente en tu dispositivo.
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
