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

  useEffect(() => {
    setAlerts(getAlerts('all'));
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-paper-100)' }}>
      <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 lg:p-12 space-y-12">
        {/* Editorial Masthead */}
        <header className="text-center space-y-6 pt-4">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold"
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
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--text-ink-600)',
              lineHeight: 'var(--line-height-loose)',
              letterSpacing: 'var(--letter-spacing-tight)'
            }}
          >
            Plataforma de información y asistencia para la reducción de riesgos y mejora de estrategias de cuidado en contextos de consumo.
          </p>
        </header>

        {/* Declaración de Principios */}
        <Callout variant="info" icon="ℹ️">
          <div className="space-y-3">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              Declaración de Principios
            </h3>
            <div className="editorial text-sm leading-relaxed space-y-2" style={{ color: 'var(--muted)' }}>
              <p>
                <strong style={{ color: 'var(--text)' }}>Esta plataforma NO promueve ni hace apología del consumo de sustancias.</strong> Nuestro propósito es brindar información basada en evidencia para reducir riesgos y daños asociados al consumo.
              </p>
              <p>
                Operamos sin fines de lucro y sin conflictos de interés. La información proporcionada tiene fines educativos y no constituye consejo médico profesional.
              </p>
            </div>
          </div>
        </Callout>

        {/* Emergency - PROMINENT */}
        <div
          className="p-6 border-l-4"
          style={{
            background: 'var(--bg-surface)',
            borderColor: '#ef4444',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lifted)',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🚨</span>
            <div className="flex-1">
              <h3
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--text-ink-900)'
                }}
              >
                Emergencias
              </h3>
              <p
                className="text-sm mb-4"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-600)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}
              >
                Si estás experimentando una emergencia médica o necesitás atención urgente:
              </p>
              <a
                href="tel:107"
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-base"
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  transition: `all var(--t-fast) var(--ease-standard)`,
                  fontFamily: 'var(--font-ui)',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
                }}
              >
                📞 Llamá al SAME 107
              </a>
              <p
                className="text-xs mt-3"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--text-ink-400)'
                }}
              >
                Servicio de Atención Médica de Emergencias - Disponible 24/7 en todo el país
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* What is Acompañ.Ar */}
        <Section title="¿Qué encontrás acá?">
          <div className="editorial leading-relaxed space-y-4" style={{ color: 'var(--muted)' }}>
            <p>
              <strong style={{ color: 'var(--text)' }}>Acompañ.Ar</strong> es un asistente informativo de reducción de riesgos que te proporciona:
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>Información basada en evidencia sobre sustancias, efectos y riesgos</li>
              <li>Guías de testeo y análisis de sustancias</li>
              <li>Recursos locales de atención y apoyo</li>
              <li>Estrategias de cuidado y reducción de daños</li>
              <li>Alertas territoriales sobre sustancias adulteradas</li>
            </ul>
          </div>
        </Section>

        {/* Tipología de Usos - Expandida */}
        <Section title="No todo consumo es igual" meta="Tipología de usos y patrones">
          <div className="editorial text-sm leading-relaxed space-y-4" style={{ color: 'var(--muted)' }}>
            <div>
              <p className="mb-3">
                Es fundamental entender que <strong style={{ color: 'var(--text)' }}>no todo consumo es consumo problemático</strong>. Los patrones de uso forman un continuo, no categorías rígidas.
              </p>
              <p className="text-xs" style={{ color: 'var(--faint)' }}>
                Esta tipología es descriptiva, no prescriptiva. Sirve para comprender mejor los propios hábitos sin juicios morales.
              </p>
            </div>

            <div className="space-y-4">
              {/* Experimental */}
              <div
                className="p-5 border-l-4"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderLeftColor: 'rgba(59, 130, 246, 0.6)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-ambient)',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
              >
                <h4
                  className="text-sm font-semibold mb-2 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  <span>🌱</span> Consumo Experimental
                </h4>
                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--text-ink-600)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}
                >
                  Primer contacto motivado por curiosidad o exploración. Contextos específicos, frecuencia muy baja.
                </p>
                <p
                  className="text-xs italic"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-400)'
                  }}
                >
                  Ejemplo: Probar MDMA por primera vez en un evento.
                </p>
              </div>

              {/* Ocasional */}
              <div
                className="p-5 border-l-4"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderLeftColor: 'rgba(34, 197, 94, 0.6)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-ambient)',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
              >
                <h4
                  className="text-sm font-semibold mb-2 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  <span>🎉</span> Consumo Ocasional
                </h4>
                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--text-ink-600)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}
                >
                  Uso esporádico vinculado a ocasiones específicas. Control sobre cuándo y cuánto. No interfiere con responsabilidades.
                </p>
                <p
                  className="text-xs italic"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-400)'
                  }}
                >
                  Ejemplo: Consumir cannabis 1-2 veces al mes en reuniones.
                </p>
              </div>

              {/* Regular */}
              <div
                className="p-5 border-l-4"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderLeftColor: 'rgba(251, 146, 60, 0.6)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-ambient)',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
              >
                <h4
                  className="text-sm font-semibold mb-2 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  <span>📅</span> Consumo Regular
                </h4>
                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--text-ink-600)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}
                >
                  Patrón establecido con mayor frecuencia. Requiere atención a riesgos acumulativos (tolerancia, salud).
                </p>
                <p
                  className="text-xs italic"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-400)'
                  }}
                >
                  Ejemplo: Fumar cannabis diariamente o beber varias veces por semana.
                </p>
              </div>

              {/* Dependiente */}
              <div
                className="p-5 border-l-4"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderLeftColor: 'rgba(239, 68, 68, 0.6)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-ambient)',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
              >
                <h4
                  className="text-sm font-semibold mb-2 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-900)'
                  }}
                >
                  <span>⚠️</span> Consumo Dependiente
                </h4>
                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--text-ink-600)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}
                >
                  Dificultad para controlar frecuencia/cantidad. Puede incluir abstinencia o tolerancia. <strong style={{ color: 'var(--text-ink-900)' }}>No siempre es sinónimo de "problemático"</strong> en todas las áreas.
                </p>
                <p
                  className="text-xs italic"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-ink-400)'
                  }}
                >
                  Ejemplo: Necesitar consumir para funcionar o malestar al no hacerlo.
                </p>
              </div>
            </div>

            {/* Key Points */}
            <div
              className="p-5"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-ambient)'
              }}
            >
              <p
                className="text-sm font-semibold mb-3"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--text-ink-900)'
                }}
              >
                💡 Puntos clave:
              </p>
              <ul
                className="list-disc pl-5 space-y-2 text-sm"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  color: 'var(--text-ink-600)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}
              >
                <li>Estos patrones son un <strong style={{ color: 'var(--text-ink-900)' }}>continuo</strong>, no categorías fijas</li>
                <li>Podés moverte entre tipos según contexto y momento vital</li>
                <li>El consumo dependiente no siempre genera problemas globales</li>
                <li>Si tu consumo te genera malestar, buscar apoyo es válido y valiente</li>
              </ul>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Latest Alerts */}
        {alerts.length > 0 && (
          <>
            <Section
              title="Alertas Recientes"
              meta={`${alerts.length} alerta${alerts.length !== 1 ? 's' : ''} activa${alerts.length !== 1 ? 's' : ''}`}
            >
              <div className="space-y-4">
                {alerts.slice(0, 3).map((alert, idx) => {
                  const severityStyle = getSeverityStyle(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      className="p-5 border-l-4"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        borderLeftColor: severityStyle.color,
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-ambient)',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        animation: `fadeIn 0.2s var(--ease-out-strong) ${idx * 0.05}s both`
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-1 text-xs font-semibold"
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
                              color: 'var(--text-ink-600)'
                            }}
                          >
                            {alert.province}
                          </span>
                        </div>
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
                        className="text-sm font-semibold mb-2"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--text-ink-900)'
                        }}
                      >
                        {alert.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-editorial)',
                          color: 'var(--text-ink-600)',
                          lineHeight: 'var(--line-height-relaxed)'
                        }}
                      >
                        {alert.message}
                      </p>
                      {alert.source && (
                        <p
                          className="text-xs mt-3"
                          style={{
                            fontFamily: 'var(--font-ui)',
                            color: 'var(--text-ink-400)'
                          }}
                        >
                          Fuente: {alert.source}
                        </p>
                      )}
                    </div>
                  );
                })}
                {alerts.length > 3 && (
                  <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
                    +{alerts.length - 3} alerta{alerts.length - 3 !== 1 ? 's' : ''} más en Observatorio
                  </p>
                )}
              </div>
            </Section>
            <Divider />
          </>
        )}

        {/* Quick Access */}
        <Section title="Explorá las herramientas" meta="Accesos rápidos">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: '💬',
                title: 'Chat Asistente',
                desc: 'Consultá sobre sustancias, riesgos e interacciones',
                tab: 'chat'
              },
              {
                icon: '📚',
                title: 'Biblioteca',
                desc: 'Información detallada sobre sustancias',
                tab: 'library'
              },
              {
                icon: '🧪',
                title: 'Guía de Testeo',
                desc: 'Aprendé a testear sustancias con reactivos',
                tab: 'testing'
              },
              {
                icon: '📍',
                title: 'Recursos',
                desc: 'Centros de atención y líneas de ayuda',
                tab: 'resources'
              },
              {
                icon: '🔔',
                title: 'Recordatorios',
                desc: 'Configurá alertas de cuidado',
                tab: 'reminders'
              },
              {
                icon: '🗺️',
                title: 'Observatorio',
                desc: 'Señales territoriales y estadísticas',
                tab: 'observatory'
              }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(item.tab)}
                className="flex items-start gap-4 p-5 text-left hover-lift"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-ambient)',
                  transition: `all var(--t-fast) var(--ease-standard)`,
                  animation: `fadeIn 0.2s var(--ease-out-strong) ${idx * 0.03}s both`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3
                      className="text-base font-semibold"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-ink-900)'
                      }}
                    >
                      {item.title}
                    </h3>
                    <ArrowRightIcon />
                  </div>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      color: 'var(--text-ink-600)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Disclaimer Legal */}
        <Callout variant="neutral">
          <div className="editorial text-xs leading-relaxed space-y-2" style={{ color: 'var(--faint)' }}>
            <p>
              <strong style={{ color: 'var(--muted)' }}>Descargo de Responsabilidad:</strong> La información proporcionada en esta plataforma tiene fines educativos y de reducción de daños. No sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre consultá con profesionales de la salud calificados para decisiones relacionadas con tu salud.
            </p>
            <p>
              El uso de sustancias psicoactivas conlleva riesgos. Esta plataforma no puede garantizar la seguridad en el consumo y no se responsabiliza por las decisiones individuales de los usuarios.
            </p>
            <p>
              Todos los datos recopilados son anónimos y se almacenan localmente en tu dispositivo. No compartimos información personal con terceros.
            </p>
          </div>
        </Callout>
      </div>
    </div>
  );
};
