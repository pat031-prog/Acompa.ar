import React, { useState, useEffect } from 'react';
import { getAlerts, type TerritorialAlert } from '../services/analyticsService';
import { LOCAL_RESOURCES } from '../constants';

const ArrowRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

/* ── Decorative circle (reference aesthetic) ── */
const GeoCircle: React.FC<{ size?: number; top?: string; right?: string; left?: string; bottom?: string; opacity?: number }> = ({ size = 120, top, right, left, bottom, opacity = 0.06 }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      border: '2px solid var(--accent-primary)',
      opacity,
      top, right, left, bottom,
      pointerEvents: 'none',
      background: `radial-gradient(circle, rgba(199,112,92,0.08) 30%, transparent 70%)`,
    }}
  />
);

/* ── Halftone pattern circle ── */
const HalftoneCircle: React.FC<{ size?: number; top?: string; right?: string; left?: string; bottom?: string; opacity?: number }> = ({ size = 100, top, right, left, bottom, opacity = 0.1 }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      opacity,
      top, right, left, bottom,
      pointerEvents: 'none',
      background: `radial-gradient(circle at 30% 30%, var(--accent-primary) 1px, transparent 1px),
                    radial-gradient(circle at 70% 30%, var(--accent-primary) 1px, transparent 1px),
                    radial-gradient(circle at 30% 70%, var(--accent-primary) 1px, transparent 1px),
                    radial-gradient(circle at 70% 70%, var(--accent-primary) 1px, transparent 1px),
                    radial-gradient(circle at 50% 50%, var(--accent-primary) 1px, transparent 1px)`,
      backgroundSize: '12px 12px',
    }}
  />
);

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

  useEffect(() => {
    setAlerts(getAlerts('all'));
  }, []);

  const urgentAlerts = alerts.filter(a => a.severity === 'high');
  const totalResources = LOCAL_RESOURCES.length;
  const freeResources = LOCAL_RESOURCES.filter(r => r.free).length;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>

      {/* ═══════ HERO — editorial magazine cover ═══════ */}
      <section className="relative overflow-hidden" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', minHeight: '340px' }}>
        {/* Decorative circles */}
        <GeoCircle size={200} top="-60px" right="-40px" opacity={0.07} />
        <HalftoneCircle size={140} top="40px" right="60px" opacity={0.12} />
        <GeoCircle size={80} bottom="20px" left="40px" opacity={0.05} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
          {/* Issue number / date — editorial mark */}
          <div className="flex items-center gap-4 mb-8">
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '4px'
            }}>
              PLATAFORMA
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              REDUCCIÓN DE RIESGOS Y DAÑOS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            maxWidth: '520px',
          }}>
            Información basada en evidencia
          </h1>

          <div style={{ width: '48px', height: '3px', background: 'var(--accent-primary)', margin: '20px 0' }} />

          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '400px',
          }}>
            Explorá información sobre sustancias, testeo, centros de atención y alertas sanitarias en Argentina.
          </p>
        </div>
      </section>

      {/* ═══════ NAVIGATION CARDS — e-reader style ═══════ */}
      <section className="relative" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              EXPLORAR
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Two column editorial cards */}
          <div className="grid sm:grid-cols-2 gap-0" style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
            {[
              { num: '01', title: 'Chat IA', desc: 'Consultá al asistente sobre sustancias, efectos e interacciones.', tab: 'chat', action: 'Comenzar' },
              { num: '02', title: 'Biblioteca', desc: '+500 sustancias documentadas con datos de fuentes internacionales.', tab: 'library', action: 'Explorar' },
              { num: '03', title: 'Guía de Testeo', desc: 'Aprendé a usar reactivos para verificar composición.', tab: 'testing', action: 'Aprender' },
              { num: '04', title: 'Recursos', desc: 'Centros de atención, organizaciones y servicios cercanos.', tab: 'resources', action: 'Ver Mapa' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(item.tab)}
                className="text-left p-7 sm:p-10 group transition-all duration-200 relative overflow-hidden"
                style={{
                  background: 'transparent',
                  borderRight: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(199,112,92,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Large number */}
                <span style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: '3rem',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.06)',
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                }}>
                  {item.num}
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-editorial)',
                  fontStyle: 'italic',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: 'var(--text-tertiary)',
                  marginBottom: '16px',
                  maxWidth: '280px',
                }}>
                  {item.desc}
                </p>
                <span className="flex items-center gap-2" style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                }}>
                  {item.action} <ArrowRightIcon />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS — large editorial numbers ═══════ */}
      <section className="relative" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
        <GeoCircle size={100} top="-30px" left="-30px" opacity={0.04} />

        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">
          <div className="flex items-center gap-3 mb-8">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              EN NÚMEROS
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: '500+', label: 'Sustancias', sub: 'en catálogo', color: 'var(--text-primary)' },
              { value: totalResources.toString(), label: 'Recursos', sub: 'en el mapa local', color: '#34d399' },
              { value: '3+', label: 'Redes', sub: 'organizaciones aliadas', color: 'var(--accent-primary)' },
              { value: '100%', label: 'Privacidad', sub: 'totalmente anónimo', color: '#60a5fa' },
            ].map((stat, idx) => (
              <div key={idx} className="relative">
                <p style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: stat.color,
                  letterSpacing: '-0.03em',
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginTop: '8px',
                }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-editorial)', fontStyle: 'italic' }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ALERTAS — compact, low emphasis ═══════ */}
      <section className="relative" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                ALERTAS SAT
              </span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-editorial)', fontStyle: 'italic' }}>
                <a href="https://www.argentina.gob.ar/sat/alertas" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  argentina.gob.ar/sat
                </a>
              </span>
            </div>
            <button
              onClick={() => onNavigate?.('observatory')}
              className="flex items-center gap-1"
              style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}
            >
              VER TODAS <ArrowRightIcon />
            </button>
          </div>

          {/* Emergency — subtle inline */}
          <div className="flex items-center gap-3 mb-5 py-3 px-4" style={{ background: 'rgba(239, 68, 68, 0.04)', borderLeft: '3px solid rgba(239,68,68,0.3)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#f87171' }}>Emergencias:</strong> SAME 107 — disponible 24/7
            </span>
            <a href="tel:107" style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', letterSpacing: '0.04em', marginLeft: 'auto' }}>
              107 →
            </a>
          </div>

          {/* Compact alert list */}
          <div className="space-y-0">
            {alerts.slice(0, 4).map((alert, idx) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 py-4 transition-colors duration-150"
                style={{
                  borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Severity dot */}
                <div className="flex-shrink-0 mt-1.5">
                  <div style={{
                    width: '8px', height: '8px',
                    background: alert.severity === 'high' ? '#f87171' : alert.severity === 'medium' ? '#fbbf24' : '#60a5fa',
                    borderRadius: '50%',
                  }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)', lineHeight: 1.4 }}>
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>{getTimeAgo(alert.timestamp)}</span>
                    {alert.province && <span>· {alert.province}</span>}
                    {alert.substances?.[0] && <span style={{ color: 'var(--text-tertiary)' }}>· {alert.substances[0]}</span>}
                  </div>
                </div>

                {/* Arrow */}
                {alert.pdfUrl && (
                  <a href={alert.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }}>
                    <ArrowRightIcon />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ADDITIONAL TOOLS — simple list ═══════ */}
      <section className="relative">
        <HalftoneCircle size={80} bottom="-20px" right="20px" opacity={0.06} />

        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              TAMBIÉN
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <div className="space-y-0" style={{ border: '2px solid rgba(255,255,255,0.08)' }}>
            {[
              { icon: '🗺️', title: 'Observatorio', desc: 'Alertas territoriales y estadísticas de consumo', tab: 'observatory' },
              { icon: '🔔', title: 'Recordatorios', desc: 'Hidratación, descanso y alimentación automáticos', tab: 'reminders' },
              { icon: '📊', title: 'Estadísticas', desc: 'Dashboard de gestión y uso', tab: 'dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(item.tab)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-150"
                style={{
                  borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(199,112,92,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>{item.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-editorial)', fontStyle: 'italic', marginTop: '2px' }}>{item.desc}</p>
                </div>
                <span style={{ color: 'var(--text-muted)' }}><ArrowRightIcon /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER DISCLAIMER ═══════ */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8">
        <p style={{
          fontSize: '11px',
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto',
        }}>
          Esta plataforma no promueve el consumo de sustancias. Brindamos información basada en evidencia para reducción de riesgos y daños. No sustituye el consejo médico profesional.
        </p>
      </div>
    </div>
  );
};
