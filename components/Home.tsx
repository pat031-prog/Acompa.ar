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
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1
            className="text-3xl sm:text-4xl font-semibold"
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-heading)'
            }}
          >
            Bienvenido a Acompañ.Ar
          </h1>
          <p className="editorial text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Plataforma de información y asistencia para la reducción de riesgos y mejora de estrategias de cuidado en contextos de consumo.
          </p>
        </div>

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
          className="p-5 rounded-lg border-l-4"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            borderColor: '#ef4444'
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Emergencias
              </h3>
              <p className="editorial text-sm mb-3" style={{ color: 'var(--muted)' }}>
                Si estás experimentando una emergencia médica o necesitás atención urgente:
              </p>
              <a
                href="tel:107"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-base"
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  transition: `all var(--t-fast) var(--ease)`
                }}
              >
                📞 Llamá al SAME 107
              </a>
              <p className="editorial text-xs mt-3" style={{ color: 'var(--faint)' }}>
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

            <div className="space-y-3">
              {/* Experimental */}
              <div
                className="rounded-lg p-4 border-l-2"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  borderLeftColor: 'rgba(59, 130, 246, 0.6)'
                }}
              >
                <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <span>🌱</span> Consumo Experimental
                </h4>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                  Primer contacto motivado por curiosidad o exploración. Contextos específicos, frecuencia muy baja.
                </p>
                <p className="text-xs italic" style={{ color: 'var(--faint)' }}>
                  Ejemplo: Probar MDMA por primera vez en un evento.
                </p>
              </div>

              {/* Ocasional */}
              <div
                className="rounded-lg p-4 border-l-2"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  borderLeftColor: 'rgba(34, 197, 94, 0.6)'
                }}
              >
                <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <span>🎉</span> Consumo Ocasional
                </h4>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                  Uso esporádico vinculado a ocasiones específicas. Control sobre cuándo y cuánto. No interfiere con responsabilidades.
                </p>
                <p className="text-xs italic" style={{ color: 'var(--faint)' }}>
                  Ejemplo: Consumir cannabis 1-2 veces al mes en reuniones.
                </p>
              </div>

              {/* Regular */}
              <div
                className="rounded-lg p-4 border-l-2"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  borderLeftColor: 'rgba(251, 146, 60, 0.6)'
                }}
              >
                <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <span>📅</span> Consumo Regular
                </h4>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                  Patrón establecido con mayor frecuencia. Requiere atención a riesgos acumulativos (tolerancia, salud).
                </p>
                <p className="text-xs italic" style={{ color: 'var(--faint)' }}>
                  Ejemplo: Fumar cannabis diariamente o beber varias veces por semana.
                </p>
              </div>

              {/* Dependiente */}
              <div
                className="rounded-lg p-4 border-l-2"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  borderLeftColor: 'rgba(239, 68, 68, 0.6)'
                }}
              >
                <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <span>⚠️</span> Consumo Dependiente
                </h4>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                  Dificultad para controlar frecuencia/cantidad. Puede incluir abstinencia o tolerancia. <strong style={{ color: 'var(--text)' }}>No siempre es sinónimo de "problemático"</strong> en todas las áreas.
                </p>
                <p className="text-xs italic" style={{ color: 'var(--faint)' }}>
                  Ejemplo: Necesitar consumir para funcionar o malestar al no hacerlo.
                </p>
              </div>
            </div>

            {/* Key Points */}
            <div
              className="rounded-lg p-4 border"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border)'
              }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>
                💡 Puntos clave:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Estos patrones son un <strong>continuo</strong>, no categorías fijas</li>
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
                        <span className="text-xs" style={{ color: 'var(--faint)' }}>
                          {getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                        {alert.title}
                      </h3>
                      <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
                        {alert.message}
                      </p>
                      {alert.source && (
                        <p className="text-xs mt-2" style={{ color: 'var(--faint)' }}>
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
                className="flex items-start gap-3 p-4 rounded-lg border text-left active:scale-[0.99]"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  transition: `all var(--t-fast) var(--ease)`,
                  animation: `fadeIn 0.2s ease-out ${idx * 0.03}s both`
                }}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {item.title}
                    </h3>
                    <ArrowRightIcon />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
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
