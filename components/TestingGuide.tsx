import React, { useState } from 'react';
import { REAGENT_TESTS, TESTING_GUIDE, INSTITUTIONAL_TESTING } from '../constants';
import { Kicker, Display, DarkCard, DataBlock, RailItem, MonoLabel } from './ui';
import { motion, AnimatePresence } from 'motion/react';
import { listContainer, listItem, detailVariants } from './motion';
import { FlaskConical } from 'lucide-react';

type Section = 'institutional' | 'guide' | 'reagents' | 'adulterants';

const SECTIONS: { id: Section; label: string; sub: string }[] = [
  { id: 'institutional', label: 'Centros Oficiales', sub: 'Dónde testear' },
  { id: 'guide', label: 'Testeo Manual', sub: 'Paso a paso' },
  { id: 'reagents', label: 'Reactivos', sub: 'Colorimetría' },
  { id: 'adulterants', label: 'Adulterantes', sub: 'Qué detectar' },
];

const withBold = (text: string, color: string) => ({ __html: text.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:700; color:${color}">$1</strong>`) });

/* ── Section content, rendered inside the coral panel with dark cards ── */

const Institutional: React.FC = () => (
  <>
    <p className="mb-8 font-medium" style={{ fontSize: '17px', opacity: 0.85, lineHeight: 1.55 }}>{TESTING_GUIDE.intro}</p>
    <DarkCard className="p-7 md:p-9 mb-6">
      <DataBlock label="¿Por qué es clave testear?">
        <ol className="mt-3 space-y-4">
          {TESTING_GUIDE.whyTest.map((reason, i) => (
            <li key={i} className="flex gap-4">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--accent-primary)', lineHeight: 1.2 }}>{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={withBold(reason, 'var(--color-blue)')} />
            </li>
          ))}
        </ol>
      </DataBlock>
    </DarkCard>
    <DarkCard className="p-7 md:p-9">
      <DataBlock label={`Centros oficiales · ${INSTITUTIONAL_TESTING.length}`}>
        <p className="text-sm leading-relaxed mt-1 mb-5" style={{ color: 'var(--text-tertiary)' }}>Priorizá centros universitarios, laboratorios oficiales o asociaciones civiles: cuentan con cromatógrafos, espectrómetros y personal capacitado.</p>
        <div className="space-y-5">
          {INSTITUTIONAL_TESTING.map((r) => (
            <div key={r.name} className="pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <MonoLabel>{r.type}</MonoLabel>
              <h3 className="mt-1.5" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{r.name}</h3>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{r.description}</p>
              {r.contact && <p className="mt-2 text-xs" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Contacto: <span style={{ color: 'var(--accent-primary)' }}>{r.contact}</span></p>}
            </div>
          ))}
        </div>
      </DataBlock>
    </DarkCard>
  </>
);

const Guide: React.FC = () => (
  <>
    <DarkCard className="p-7 md:p-9 mb-6">
      <DataBlock label={`Cómo testear · ${TESTING_GUIDE.howToTest.length} pasos`}>
        <ol className="mt-3 space-y-5">
          {TESTING_GUIDE.howToTest.map((step) => (
            <li key={step.step} className="flex gap-4">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: 'var(--accent-primary)', lineHeight: 1.05 }}>{String(step.step).padStart(2, '0')}</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.005em', color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed mt-1.5" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </DataBlock>
    </DarkCard>
    <DarkCard className="p-7 md:p-9">
      <DataBlock label="Recomendaciones importantes" color="var(--color-amber)">
        <ul className="mt-3 space-y-3">
          {TESTING_GUIDE.recommendations.map((rec, i) => (
            <li key={i} className="flex gap-3">
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', marginTop: '7px', flexShrink: 0, background: 'var(--color-amber)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={withBold(rec, 'var(--color-amber)')} />
            </li>
          ))}
        </ul>
      </DataBlock>
    </DarkCard>
  </>
);

const Reagents: React.FC = () => (
  <>
    <p className="mb-8 font-medium" style={{ fontSize: '16px', opacity: 0.85, lineHeight: 1.55 }}>Cada reactivo reacciona distinto con cada sustancia. Usá varios reactivos para confirmar una composición.</p>
    <div className="space-y-6">
      {REAGENT_TESTS.map((reagent) => (
        <DarkCard key={reagent.name} className="p-7 md:p-9">
          <DataBlock label={`${reagent.name} · ${reagent.substances.length}`}>
            <p className="text-sm leading-relaxed mt-1 mb-4" style={{ color: 'var(--text-tertiary)' }}>{reagent.description}</p>
            <div>
              {reagent.substances.map((sub, i) => (
                <div key={i} className="flex items-center gap-4 py-3" style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, background: sub.color, boxShadow: 'inset -2px -3px 6px rgba(0,0,0,0.35)' }} />
                  <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{sub.substance}</span>
                  <span className="text-xs text-right" style={{ color: 'var(--text-muted)', maxWidth: '20ch' }}>{sub.reaction}</span>
                </div>
              ))}
            </div>
          </DataBlock>
        </DarkCard>
      ))}
    </div>
  </>
);

const Adulterants: React.FC = () => (
  <>
    <DarkCard className="p-7 md:p-9 mb-6" style={{ border: '1px solid var(--color-red-medium)' }}>
      <DataBlock label="Advertencia" color="var(--color-red)">
        <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>Estos son de los adulterantes más peligrosos del mercado ilegal. El testeo es fundamental para detectarlos.</p>
      </DataBlock>
    </DarkCard>
    <DarkCard className="p-7 md:p-9 mb-6">
      <DataBlock label={`Adulterantes frecuentes · ${TESTING_GUIDE.commonAdulterants.length}`} color="var(--color-red)">
        <div className="grid sm:grid-cols-2 gap-x-8 mt-2">
          {TESTING_GUIDE.commonAdulterants.map((a, i) => (
            <div key={i} className="flex gap-3 py-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: 'var(--color-red)' }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{a.substance}</h3>
                <p className="text-sm leading-relaxed mt-1.5" style={{ color: 'var(--text-secondary)' }}>{a.risk}</p>
              </div>
            </div>
          ))}
        </div>
      </DataBlock>
    </DarkCard>
    <DarkCard className="p-7 md:p-9">
      <DataBlock label="Recordá" color="var(--color-blue)">
        <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>Los reactivos de color NO detectan todos los adulterantes. Para un análisis completo (GC/MS), llevá tus sustancias a organizaciones como ArgenPills.</p>
      </DataBlock>
    </DarkCard>
  </>
);

export const TestingGuide: React.FC = () => {
  const [active, setActive] = useState<Section>('institutional');
  const [mobileDetail, setMobileDetail] = useState(false);
  const current = SECTIONS.find(s => s.id === active)!;

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Rail ── */}
      <div className={`w-full md:w-1/3 flex-col p-6 md:p-10 relative ${mobileDetail ? 'hidden md:flex' : 'flex'}`} style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-8">
          <Kicker>Testeo de sustancias</Kicker>
          <span style={{ color: 'var(--accent-primary)' }}><FlaskConical size={22} /></span>
        </div>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-tertiary)' }}>Reactivos, centros y cómo verificar la composición de una sustancia en Argentina.</p>
        <motion.div className="flex flex-col gap-4" variants={listContainer} initial="initial" animate="animate">
          {SECTIONS.map(s => (
            <motion.div variants={listItem} key={s.id}>
              <RailItem active={active === s.id} onClick={() => { setActive(s.id); setMobileDetail(true); }} layoutId="testing-pill" sub={s.sub}>
                {s.label}
              </RailItem>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Detail (coral) ── */}
      <div className={`w-full md:w-2/3 ${mobileDetail ? 'flex' : 'hidden md:flex'}`}>
        <div className="w-full p-6 md:p-12 flex flex-col overflow-y-auto no-scrollbar rounded-t-[3rem] md:rounded-l-[4rem] md:rounded-tr-none" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', paddingBottom: '120px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} variants={detailVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto w-full">
              <div className="mb-8 pt-2 md:pt-0">
                <button onClick={() => setMobileDetail(false)} className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ border: '1px solid rgba(0,0,0,0.15)', color: 'var(--accent-ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Volver</button>
                <div className="mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-ink)', opacity: 0.65 }}>{current.sub}</div>
                <Display size="lg" upper color="var(--accent-ink)">{current.label}</Display>
              </div>
              {active === 'institutional' && <Institutional />}
              {active === 'guide' && <Guide />}
              {active === 'reagents' && <Reagents />}
              {active === 'adulterants' && <Adulterants />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
