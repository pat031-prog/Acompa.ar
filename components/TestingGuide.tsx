import React, { useState } from 'react';
import { REAGENT_TESTS, TESTING_RESOURCES, TESTING_GUIDE } from '../constants';

const BeakerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 15.5m14.8-.2 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);
const MapPinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);
const BookOpenIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);
const ExclamationTriangleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

type Section = 'guide' | 'reagents' | 'resources' | 'adulterants';

const tabStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--accent-primary)' : 'transparent',
  color: active ? '#fff' : 'var(--text-tertiary)',
  border: active ? '2px solid var(--accent-primary)' : '2px solid rgba(255,255,255,0.1)',
  borderRadius: '0',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  whiteSpace: 'nowrap' as const,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const TestingGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('guide');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-6 sm:p-8" style={{ borderBottom: '2.5px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ color: 'var(--color-violet)' }}><BeakerIcon /></span>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>GUÍA</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 700, letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}>
          Testeo de Sustancias
        </h1>
        <div style={{ width: '40px', height: '3px', background: 'var(--accent-primary)', margin: '10px 0 6px' }} />
        <p style={{
          fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '13px',
          color: 'var(--text-tertiary)', lineHeight: 1.5,
        }}>
          Información completa sobre reactivos, recursos y cómo testear sustancias en Argentina
        </p>
      </div>

      <div className="flex gap-2 p-5 sm:p-6 overflow-x-auto" style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setActiveSection('guide')} style={tabStyle(activeSection === 'guide')}><BookOpenIcon /> Guía de Testeo</button>
        <button onClick={() => setActiveSection('reagents')} style={tabStyle(activeSection === 'reagents')}><BeakerIcon /> Reactivos</button>
        <button onClick={() => setActiveSection('resources')} style={tabStyle(activeSection === 'resources')}><MapPinIcon /> Dónde Conseguir</button>
        <button onClick={() => setActiveSection('adulterants')} style={tabStyle(activeSection === 'adulterants')}><ExclamationTriangleIcon /> Adulterantes</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-12">
        {activeSection === 'guide' && <GuideSection />}
        {activeSection === 'reagents' && <ReagentsSection />}
        {activeSection === 'resources' && <ResourcesSection />}
        {activeSection === 'adulterants' && <AdulterantsSection />}
      </div>
    </div>
  );
};

const GuideSection: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="editorial-pullquote">{TESTING_GUIDE.intro}</div>

    <section>
      <h2 className="editorial-heading text-xl mb-3">¿Por qué testear?</h2>
      <hr className="editorial-divider-accent" style={{ marginTop: '0', marginBottom: '16px' }} />
      <ul className="space-y-2">
        {TESTING_GUIDE.whyTest.map((reason, idx) => (
          <li key={idx} className="editorial-body text-sm" dangerouslySetInnerHTML={{ __html: reason.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: var(--color-blue)">$1</strong>`) }} />
        ))}
      </ul>
    </section>

    <hr className="editorial-divider" />

    <section>
      <h2 className="editorial-heading text-xl mb-3">Cómo testear paso a paso</h2>
      <hr className="editorial-divider-accent" style={{ marginTop: '0', marginBottom: '16px' }} />
      <ol className="editorial-list">
        {TESTING_GUIDE.howToTest.map((step) => (
          <li key={step.step}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px', fontFamily: 'var(--font-editorial)' }}>{step.title}</strong>
            <span className="editorial-body" style={{ fontSize: '14px' }}>{step.description}</span>
          </li>
        ))}
      </ol>
    </section>

    <hr className="editorial-divider" />

    <section>
      <h2 className="editorial-heading text-xl mb-3">Recomendaciones importantes</h2>
      <hr className="editorial-divider-accent" style={{ marginTop: '0', marginBottom: '16px' }} />
      <ul className="space-y-2">
        {TESTING_GUIDE.recommendations.map((rec, idx) => (
          <li key={idx} className="editorial-body text-sm" dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: var(--color-amber)">$1</strong>`) }} />
        ))}
      </ul>
    </section>
  </div>
);

const ReagentsSection: React.FC = () => (
  <div className="max-w-5xl mx-auto space-y-6">
    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
      Estos son los reactivos más comunes para testear sustancias. Cada reactivo reacciona de forma diferente con distintas sustancias, por eso es crucial usar varios reactivos para confirmar.
    </p>
    <div className="grid gap-6">
      {REAGENT_TESTS.map((reagent) => (
        <div key={reagent.name} className="overflow-hidden" style={{ background: 'var(--surface-1)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '0' }}>
          <div className="p-4" style={{ background: 'var(--surface-2)', borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{reagent.name}</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{reagent.description}</p>
          </div>
          <div className="p-4">
            <div className="grid gap-2">
              {reagent.substances.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-2" style={{ background: 'var(--bg-primary)', borderRadius: '0' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{sub.substance}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub.reaction}</span>
                    <div className="w-12 h-6" style={{ backgroundColor: sub.color, border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '0' }} title={sub.reaction} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ResourcesSection: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
      Estos son los recursos disponibles en Argentina para conseguir kits de testeo o acceder a servicios de análisis de sustancias.
    </p>
    <div className="grid gap-5 sm:gap-6">
      {TESTING_RESOURCES.map((resource, idx) => (
        <div key={idx} className="p-5 sm:p-6" style={{ background: 'var(--surface-1)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '0' }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {resource.type === 'organization' && (
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-violet-subtle)', borderRadius: '0', color: 'var(--color-violet)' }}><BeakerIcon /></div>
              )}
              {resource.type === 'online' && (
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-blue-subtle)', borderRadius: '0', color: 'var(--color-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                </div>
              )}
              {resource.type === 'physical' && (
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-green-subtle)', borderRadius: '0', color: 'var(--color-green)' }}><MapPinIcon /></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{resource.name}</h3>
              {resource.location && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>📍 {resource.location}</p>}
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{resource.description}</p>
              {resource.website && <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block" style={{ color: 'var(--color-blue)' }}>🔗 {resource.website}</a>}
              {resource.contact && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📞 {resource.contact}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdulterantsSection: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="p-4" style={{ background: 'var(--color-red-subtle)', border: '2px solid var(--color-red-medium)', borderLeft: '4px solid var(--color-red)', borderRadius: '0' }}>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        <strong style={{ color: 'var(--color-red)' }}>⚠️ Advertencia:</strong> Estos son algunos de los adulterantes más peligrosos que se encuentran en el mercado ilegal. El testeo de sustancias es fundamental para detectarlos.
      </p>
    </div>

    <div className="grid gap-5 sm:gap-6">
      {TESTING_GUIDE.commonAdulterants.map((adulterant, idx) => (
        <div key={idx} className="p-4" style={{ background: 'var(--surface-1)', border: '2px solid rgba(255,255,255,0.1)', borderLeft: '4px solid var(--color-red)', borderRadius: '0' }}>
          <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--color-red)' }}><ExclamationTriangleIcon /></span>
            {adulterant.substance}
          </h3>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{adulterant.risk}</p>
        </div>
      ))}
    </div>

    <div className="p-4 mt-6" style={{ background: 'var(--color-blue-subtle)', border: '2px solid var(--color-blue-medium)', borderLeft: '4px solid var(--color-blue)', borderRadius: '0' }}>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        <strong style={{ color: 'var(--color-blue)' }}>💡 Recuerda:</strong> Los reactivos de color NO detectan todos los adulterantes. Para un análisis completo (GC/MS), llevá tus sustancias a organizaciones como ArgenPills.
      </p>
    </div>
  </div>
);
