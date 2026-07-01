import React, { useState, useEffect } from 'react';
import { getAlerts, type TerritorialAlert } from '../services/analyticsService';
import { LOCAL_RESOURCES } from '../constants';
import { Kicker, Display, Panel, IndexNum, SectionLabel, InlineNote } from './ui';

const ArrowIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const getTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) return `Hace ${years} año${years > 1 ? 's' : ''}`;
  if (months > 0) return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  if (days > 0) return `Hace ${days}d`;
  return 'Hoy';
};

interface HomeProps { onNavigate?: (tab: string) => void; }

const NAV = [
  { num: '01', title: 'Chat IA', desc: 'Consultá al asistente sobre sustancias, efectos e interacciones.', tab: 'chat' },
  { num: '02', title: 'Biblioteca', desc: '+100 sustancias documentadas con datos de fuentes internacionales.', tab: 'library' },
  { num: '03', title: 'Testeo', desc: 'Aprendé a usar reactivos para verificar composición.', tab: 'testing' },
  { num: '04', title: 'Recursos', desc: 'Centros de atención, organizaciones y servicios cercanos.', tab: 'resources' },
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<TerritorialAlert[]>([]);
  useEffect(() => { setAlerts(getAlerts('all')); }, []);

  const stats = [
    { value: '+100', label: 'Sustancias', color: 'var(--text-primary)' },
    { value: LOCAL_RESOURCES.length.toString(), label: 'Recursos', color: 'var(--accent-primary)' },
    { value: '3+', label: 'Redes aliadas', color: 'var(--text-primary)' },
    { value: '100%', label: 'Anónimo', color: 'var(--accent-primary)' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Hero ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '60px', paddingBottom: '48px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <Kicker className="mb-6">Plataforma · Reducción de riesgos y daños</Kicker>
          <Display size="xl" upper style={{ maxWidth: '16ch' }}>Información basada en evidencia</Display>
          <p className="mt-6" style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '52ch' }}>
            Explorá información sobre sustancias, testeo, centros de atención y alertas sanitarias en Argentina — de forma anónima y sin juicios.
          </p>
        </div>
      </section>

      {/* ── Explore — corner-cut panels ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '48px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <SectionLabel accent="var(--accent-primary)">Explorar</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {NAV.map((item) => (
              <Panel
                key={item.num}
                interactive
                onClick={() => onNavigate?.(item.tab)}
                onTabClick={() => onNavigate?.(item.tab)}
                tab={<ArrowIcon className="w-[18px] h-[18px]" />}
                cut="lg"
                className="p-6 pr-14"
              >
                <IndexNum size={48} color="var(--accent-weak)">{item.num}</IndexNum>
                <Display size="md" upper className="mt-3">{item.title}</Display>
                <p className="mt-2" style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'var(--text-tertiary)', maxWidth: '32ch' }}>{item.desc}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '48px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <SectionLabel accent="var(--accent-primary)">En números</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-7">
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 0.95, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
                <p className="mt-3" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alertas SAT ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '48px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel accent="var(--color-red)" rule={false}>Alertas SAT</SectionLabel>
            <button onClick={() => onNavigate?.('observatory')} className="inline-flex items-center gap-1.5" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              Ver todas <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <InlineNote accent="var(--color-red)">
            <strong style={{ color: 'var(--color-red)' }}>Emergencias:</strong> SAME <a href="tel:107" style={{ color: 'var(--color-red)', fontWeight: 700 }}>107</a> — disponible 24/7.
          </InlineNote>

          <div className="mt-5">
            {alerts.slice(0, 4).map((alert, idx) => (
              <div key={alert.id} className="flex items-start gap-4 py-4" style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: alert.severity === 'high' ? 'var(--color-red)' : alert.severity === 'medium' ? 'var(--color-amber)' : 'var(--color-blue)' }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.title}</p>
                  <div className="flex items-center gap-2.5 mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{getTimeAgo(alert.timestamp)}</span>
                    {alert.province && <span>· {alert.province}</span>}
                  </div>
                </div>
                {alert.pdfUrl && <a href={alert.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }}><ArrowIcon /></a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── More tools — ruled index list ── */}
      <section className="px-5 sm:px-8 lg:px-10" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="max-w-4xl mx-auto w-full">
          <SectionLabel accent="var(--accent-primary)">También</SectionLabel>
          <div className="mt-4">
            {[
              { num: '05', title: 'Observatorio', desc: 'Mapa de alertas territoriales y consumo', tab: 'observatory' },
              { num: '06', title: 'Recordatorios', desc: 'Hidratación, descanso y alimentación', tab: 'reminders' },
              { num: '07', title: 'Estadísticas', desc: 'Dashboard de gestión y uso', tab: 'dashboard' },
            ].map((item, idx) => (
              <button key={idx} onClick={() => onNavigate?.(item.tab)} className="group w-full flex items-center gap-5 py-4 text-left" style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <IndexNum size={20} color="var(--accent-weak)">{item.num}</IndexNum>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{item.title}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>{item.desc}</p>
                </div>
                <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--accent-primary)' }}><ArrowIcon /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
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
