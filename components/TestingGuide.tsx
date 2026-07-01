import React, { useState } from 'react';
import { REAGENT_TESTS, TESTING_RESOURCES, TESTING_GUIDE, INSTITUTIONAL_TESTING } from '../constants';
import { PageHeader } from './ui';

const SAGE = 'var(--accent-primary)';

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

type Section = 'institutional' | 'guide' | 'reagents' | 'adulterants';

const tabStyle = (active: boolean): React.CSSProperties => ({
  background: active ? SAGE : 'var(--surface-1)',
  color: active ? '#0e1410' : 'var(--text-tertiary)',
  border: `1px solid ${active ? SAGE : 'var(--border-subtle)'}`,
  borderRadius: '999px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.01em',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  whiteSpace: 'nowrap' as const,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: active ? '0 10px 30px rgba(124,152,133,0.25)' : 'none',
});

export const TestingGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('institutional');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader
        eyebrow="Guía de reducción de riesgos"
        title="Testeo de Sustancias"
        description="Información completa sobre reactivos, recursos y cómo testear sustancias en Argentina."
        accent={SAGE}
      />

      <div className="flex gap-2 p-5 sm:p-6 overflow-x-auto scrollbar-hide" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => setActiveSection('institutional')} style={tabStyle(activeSection === 'institutional')}><MapPinIcon /> Centros Oficiales</button>
        <button onClick={() => setActiveSection('guide')} style={tabStyle(activeSection === 'guide')}><BookOpenIcon /> Testeo Manual</button>
        <button onClick={() => setActiveSection('reagents')} style={tabStyle(activeSection === 'reagents')}><BeakerIcon /> Reactivos</button>
        <button onClick={() => setActiveSection('adulterants')} style={tabStyle(activeSection === 'adulterants')}><ExclamationTriangleIcon /> Adulterantes</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-12">
        {activeSection === 'institutional' && <InstitutionalSection />}
        {activeSection === 'guide' && <GuideSection />}
        {activeSection === 'reagents' && <ReagentsSection />}
        {activeSection === 'adulterants' && <AdulterantsSection />}
      </div>
    </div>
  );
};

const InstitutionalSection: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="editorial-pullquote">{TESTING_GUIDE.intro}</div>

    <section>
      <h2 className="editorial-heading text-xl mb-3">¿Por qué es clave testear?</h2>
      <hr className="editorial-divider-accent" style={{ marginTop: '0', marginBottom: '16px' }} />
      <ul className="space-y-2">
        {TESTING_GUIDE.whyTest.map((reason, idx) => (
          <li key={idx} className="editorial-body text-sm" dangerouslySetInnerHTML={{ __html: reason.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:600; color: var(--color-blue)">$1</strong>`) }} />
        ))}
      </ul>
    </section>

    <hr className="editorial-divider" />

    <section>
      <h2 className="editorial-heading text-xl mb-3">Centros Oficiales y Asociaciones Civiles</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Recomendamos acudir prioritariamente a centros de testeo universitarios, laboratorios oficiales o asociaciones civiles formales. Estos espacios cuentan con tecnología avanzada (cromatógrafos, espectrómetros) y personal capacitado para análisis de composición exactos y asesoramiento integral.
      </p>
      <hr className="editorial-divider-accent" style={{ marginTop: '0', marginBottom: '4px', background: SAGE }} />
      <div>
        {INSTITUTIONAL_TESTING.map((resource, idx) => (
          <div
            key={resource.name}
            className="py-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
            style={{ borderBottom: idx < INSTITUTIONAL_TESTING.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
          >
            <span
              className="flex-shrink-0 text-[10px] uppercase tracking-wider font-bold sm:w-28"
              style={{ color: SAGE }}
            >
              {resource.type}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1.5" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>
                {resource.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {resource.description}
              </p>
              {resource.contact && (
                <div className="text-xs font-semibold mt-2" style={{ color: SAGE }}>
                  Contacto: <span style={{ color: 'var(--text-primary)' }}>{resource.contact}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const GuideSection: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">

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
        <div key={reagent.name} className="overflow-hidden rounded-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
          <div className="p-4 sm:p-5" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-editorial)' }}>{reagent.name}</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{reagent.description}</p>
          </div>
          <div className="p-3 sm:p-4">
            <div className="grid gap-1.5">
              {reagent.substances.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{sub.substance}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>{sub.reaction}</span>
                    <div className="w-12 h-6 rounded-lg flex-shrink-0" style={{ backgroundColor: sub.color, border: '1px solid rgba(255,255,255,0.18)' }} title={sub.reaction} />
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
        <div key={idx} className="p-5 sm:p-6" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {resource.type === 'organization' && (
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-violet-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-violet)' }}><BeakerIcon /></div>
              )}
              {resource.type === 'online' && (
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-blue-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                </div>
              )}
              {resource.type === 'physical' && (
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-green-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-green)' }}><MapPinIcon /></div>
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
    <div className="p-4 sm:p-5 rounded-2xl" style={{ background: 'var(--color-red-subtle)', border: '1px solid var(--color-red-medium)', borderLeft: '4px solid var(--color-red)' }}>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        <strong style={{ color: 'var(--color-red)' }}>⚠️ Advertencia:</strong> Estos son algunos de los adulterantes más peligrosos que se encuentran en el mercado ilegal. El testeo de sustancias es fundamental para detectarlos.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 gap-x-8">
      {TESTING_GUIDE.commonAdulterants.map((adulterant, idx) => (
        <div
          key={idx}
          className="py-4 flex gap-3"
          style={{ borderBottom: idx < TESTING_GUIDE.commonAdulterants.length - (TESTING_GUIDE.commonAdulterants.length % 2 === 0 ? 2 : 1) ? '1px solid var(--border-subtle)' : 'none' }}
        >
          <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-red)' }}><ExclamationTriangleIcon /></span>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{adulterant.substance}</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{adulterant.risk}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="p-4 sm:p-5 mt-6 rounded-2xl" style={{ background: 'var(--color-blue-subtle)', border: '1px solid var(--color-blue-medium)', borderLeft: '4px solid var(--color-blue)' }}>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        <strong style={{ color: 'var(--color-blue)' }}>💡 Recuerda:</strong> Los reactivos de color NO detectan todos los adulterantes. Para un análisis completo (GC/MS), llevá tus sustancias a organizaciones como ArgenPills.
      </p>
    </div>
  </div>
);
