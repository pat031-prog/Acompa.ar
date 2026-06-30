import React, { useState, useEffect } from 'react';
import { getAlerts, type TerritorialAlert } from '../services/analyticsService';
import { LOCAL_RESOURCES } from '../constants';
import { Card } from './ui';

const ArrowRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
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

const NAV_CARDS = [
  { num: '01', title: 'Chat IA', desc: 'Consultá al asistente sobre sustancias, efectos e interacciones.', tab: 'chat', action: 'Comenzar' },
  { num: '02', title: 'Biblioteca', desc: '+100 sustancias documentadas con datos de fuentes internacionales.', tab: 'library', action: 'Explorar' },
  { num: '03', title: 'Guía de Testeo', desc: 'Aprendé a usar reactivos para verificar composición.', tab: 'testing', action: 'Aprender' },
  { num: '04', title: 'Recursos', desc: 'Centros de atención, organizaciones y servicios cercanos.', tab: 'resources', action: 'Ver mapa' },
];

const SECTION_LABEL: React.CSSProperties = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' };

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);

  useEffect(() => {
    setAlerts(getAlerts('all'));
  }, []);

  const totalResources = LOCAL_RESOURCES.length;

  const stats = [
    { value: '+100', label: 'Sustancias', sub: 'en catálogo', color: 'var(--text-primary)' },
    { value: totalResources.toString(), label: 'Recursos', sub: 'en el directorio', color: 'var(--color-green)' },
    { value: '3+', label: 'Redes', sub: 'organizaciones aliadas', color: 'var(--accent-primary)' },
    { value: '100%', label: 'Privacidad', sub: 'totalmente anónimo', color: 'var(--color-blue)' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Hero ── */}
      <section className="px-5 sm:px-8 lg:px-10 relative" style={{ paddingTop: '60px', paddingBottom: '48px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2.5 mb-6">
            <span style={{ width: '18px', height: '2px', background: 'var(--accent-primary)', borderRadius: '999px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              Plataforma · Reducción de riesgos y daños
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--text-primary)', maxWidth: '15ch' }}>
            Información basada en evidencia
          </h1>
          <p className="mt-6" style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '52ch' }}>
            Explorá información sobre sustancias, testeo, centros de atención y alertas sanitarias en Argentina — de forma anónima y sin juicios.
          </p>
        </div>
      </section>

      {/* ── Navigation cards ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-5">
            <span style={SECTION_LABEL}>Explorar</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {NAV_CARDS.map((item) => (
              <Card key={item.num} interactive onClick={() => onNavigate?.(item.tab)} className="p-6 relative overflow-hidden" style={{ cursor: 'pointer' }}>
                <span style={{ position: 'absolute', top: '10px', right: '18px', fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 500, color: 'var(--accent-weak)', letterSpacing: '-0.02em', lineHeight: 1 }}>{item.num}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text-tertiary)', marginBottom: '16px', maxWidth: '34ch' }}>{item.desc}</p>
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.03em', color: 'var(--accent-primary)' }}>
                  {item.action} <ArrowRightIcon />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-7">
            <span style={SECTION_LABEL}>En números</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 600, lineHeight: 1, color: stat.color, letterSpacing: '-0.03em' }}>{stat.value}</p>
                <p className="mt-2.5" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="mt-0.5" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alertas SAT ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span style={SECTION_LABEL}>Alertas SAT</span>
              <a href="https://www.argentina.gob.ar/sat/alertas" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--accent-primary)', textDecoration: 'none' }}>
                argentina.gob.ar/sat
              </a>
            </div>
            <button onClick={() => onNavigate?.('observatory')} className="inline-flex items-center gap-1" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
              Ver todas <ArrowRightIcon />
            </button>
          </div>

          {/* Emergency inline */}
          <div className="flex items-center gap-3 mb-4 py-2.5 px-4" style={{ background: 'var(--color-red-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--color-red)' }}>Emergencias:</strong> SAME 107 — disponible 24/7
            </span>
            <a href="tel:107" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-red)', marginLeft: 'auto' }}>107 →</a>
          </div>

          <div>
            {alerts.slice(0, 4).map((alert, idx) => (
              <div key={alert.id} className="flex items-start gap-3.5 py-3.5" style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <div className="flex-shrink-0 mt-1.5">
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: alert.severity === 'high' ? 'var(--color-red)' : alert.severity === 'medium' ? 'var(--color-amber)' : 'var(--color-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.title}</p>
                  <div className="flex items-center gap-2.5 mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{getTimeAgo(alert.timestamp)}</span>
                    {alert.province && <span>· {alert.province}</span>}
                    {alert.substances?.[0] && <span style={{ color: 'var(--text-tertiary)' }}>· {alert.substances[0]}</span>}
                  </div>
                </div>
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

      {/* ── More tools ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-5">
            <span style={SECTION_LABEL}>También</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>
          <Card className="overflow-hidden">
            {[
              { title: 'Observatorio', desc: 'Mapa de alertas territoriales y estadísticas de consumo', tab: 'observatory' },
              { title: 'Recordatorios', desc: 'Hidratación, descanso y alimentación automáticos', tab: 'reminders' },
              { title: 'Estadísticas', desc: 'Dashboard de gestión y uso', tab: 'dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate?.(item.tab)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
                style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</p>
                </div>
                <span style={{ color: 'var(--text-muted)' }}><ArrowRightIcon /></span>
              </button>
            ))}
          </Card>
        </div>
      </section>

      {/* ── Footer disclaimer ── */}
      <div className="px-5 sm:px-8 lg:px-10 pb-10">
        <div className="max-w-4xl mx-auto w-full">
          <p style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--text-muted)', textAlign: 'center', maxWidth: '60ch', margin: '0 auto' }}>
            Esta plataforma no promueve el consumo de sustancias. Brindamos información basada en evidencia para reducción de riesgos y daños. No sustituye el consejo médico profesional.
          </p>
        </div>
      </div>
    </div>
  );
};
