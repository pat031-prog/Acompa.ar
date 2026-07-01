import React, { useState, useEffect } from 'react';
import { getAlerts, type TerritorialAlert } from '../services/analyticsService';
import { LOCAL_RESOURCES } from '../constants';
import { Kicker, Display, MonoLabel } from './ui';
import { ArrowRight, MessageCircle, BookOpen, FlaskConical, MapPin, Globe, Bell, BarChart3 } from 'lucide-react';

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

const surfaceCard: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '2rem' };

const EXPLORE = [
  { num: '02', title: 'Biblioteca', desc: '+100 sustancias documentadas.', tab: 'library', icon: BookOpen },
  { num: '03', title: 'Testeo', desc: 'Reactivos para verificar composición.', tab: 'testing', icon: FlaskConical },
  { num: '04', title: 'Recursos', desc: 'Centros de atención y redes cercanas.', tab: 'resources', icon: MapPin },
];

const MORE = [
  { num: '05', title: 'Observatorio', desc: 'Mapa de consultas y alertas territoriales', tab: 'observatory', icon: Globe },
  { num: '06', title: 'Recordatorios', desc: 'Hidratación, descanso y alimentación', tab: 'reminders', icon: Bell },
  { num: '07', title: 'Estadísticas', desc: 'Dashboard de gestión y uso', tab: 'dashboard', icon: BarChart3 },
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
    <div className="h-full w-full overflow-y-auto no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 lg:px-10" style={{ paddingBottom: '120px' }}>

        {/* ── Hero ── */}
        <section style={{ paddingTop: '56px', paddingBottom: '40px' }}>
          <Kicker className="mb-6">Reducción de riesgos y daños</Kicker>
          <Display size="xl" upper style={{ maxWidth: '15ch' }}>Información basada en evidencia</Display>
          <p className="mt-6" style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '52ch' }}>
            Sustancias, testeo, centros de atención y alertas sanitarias en Argentina — de forma anónima y sin juicios.
          </p>
        </section>

        {/* ── Primary CTA: coral assistant card ── */}
        <button onClick={() => onNavigate?.('chat')} className="w-full text-left group relative overflow-hidden transition-transform active:scale-[0.99]" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', borderRadius: '2.5rem', padding: '32px' }}>
          <div className="flex items-start justify-between gap-6">
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>01 · Empezá acá</span>
              <h2 className="mt-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Asistente IA</h2>
              <p className="mt-3 font-medium" style={{ fontSize: '15px', opacity: 0.85, maxWidth: '38ch' }}>Consultá sobre sustancias, efectos, dosis e interacciones. Privado y confidencial.</p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105" style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
              <MessageCircle size={24} />
            </div>
          </div>
        </button>

        {/* ── Explore ── */}
        <section style={{ paddingTop: '40px' }}>
          <MonoLabel>Explorar</MonoLabel>
          <div className="grid sm:grid-cols-3 gap-3 mt-5">
            {EXPLORE.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.num} onClick={() => onNavigate?.(item.tab)} className="text-left p-6 transition-colors group" style={surfaceCard}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--accent-primary)' }}>{item.num}</span>
                    <span style={{ color: 'var(--text-muted)' }}><Icon size={18} /></span>
                  </div>
                  <h3 className="mt-6" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="mt-2" style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-tertiary)' }}>{item.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ paddingTop: '44px' }}>
          <MonoLabel>En números</MonoLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 0.95, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
                <p className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Alertas SAT ── */}
        <section style={{ paddingTop: '44px' }}>
          <div className="flex items-center justify-between mb-4">
            <MonoLabel color="var(--color-red)">Alertas SAT</MonoLabel>
            <button onClick={() => onNavigate?.('dashboard')} className="inline-flex items-center gap-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              Ver todas <ArrowRight size={13} />
            </button>
          </div>
          <div className="p-6" style={surfaceCard}>
            <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--color-red)' }}>Emergencias:</strong> SAME <a href="tel:107" style={{ color: 'var(--color-red)', fontWeight: 700 }}>107</a> — 24/7.</p>
            {alerts.slice(0, 4).map((alert, idx) => (
              <div key={alert.id} className="flex items-start gap-4 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: alert.severity === 'high' ? 'var(--color-red)' : alert.severity === 'medium' ? 'var(--color-amber)' : 'var(--color-blue)' }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.title}</p>
                  <div className="flex items-center gap-2.5 mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{getTimeAgo(alert.timestamp)}</span>
                    {alert.province && <span>· {alert.province}</span>}
                  </div>
                </div>
                {alert.pdfUrl && <a href={alert.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }}><ArrowRight size={15} /></a>}
              </div>
            ))}
          </div>
        </section>

        {/* ── También ── */}
        <section style={{ paddingTop: '44px' }}>
          <MonoLabel>También</MonoLabel>
          <div className="grid sm:grid-cols-3 gap-3 mt-5">
            {MORE.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.num} onClick={() => onNavigate?.(item.tab)} className="text-left p-5 flex items-center gap-4 transition-colors group" style={surfaceCard}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                  <span className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-primary)', color: 'var(--accent-primary)' }}><Icon size={18} /></span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{item.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Footer ── */}
        <p className="mt-14" style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--text-muted)', textAlign: 'center', maxWidth: '60ch', margin: '56px auto 0' }}>
          Esta plataforma no promueve el consumo. Brindamos información basada en evidencia para reducción de riesgos y daños. No sustituye el consejo médico profesional.
        </p>
      </div>
    </div>
  );
};
