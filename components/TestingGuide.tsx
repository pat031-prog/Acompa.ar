import React, { useState } from 'react';
import { REAGENT_TESTS, TESTING_RESOURCES, TESTING_GUIDE, INSTITUTIONAL_TESTING } from '../constants';
import { PageHeader, Kicker, Display, Pill, SectionLabel, InlineNote, CircleThumb, IndexNum } from './ui';

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

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'institutional', label: 'Centros Oficiales', icon: <MapPinIcon /> },
  { id: 'guide', label: 'Testeo Manual', icon: <BookOpenIcon /> },
  { id: 'reagents', label: 'Reactivos', icon: <BeakerIcon /> },
  { id: 'adulterants', label: 'Adulterantes', icon: <ExclamationTriangleIcon /> },
];

export const TestingGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('institutional');

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        eyebrow="Guía de reducción de riesgos"
        title="Testeo de Sustancias"
        description="Información completa sobre reactivos, recursos y cómo testear sustancias en Argentina."
        accent={SAGE}
      />

      <div className="flex gap-2.5 px-5 sm:px-7 lg:px-8 py-5 overflow-x-auto scrollbar-hide" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {SECTIONS.map((s) => (
          <Pill key={s.id} active={activeSection === s.id} color={SAGE} onClick={() => setActiveSection(s.id)}>
            <span style={{ display: 'inline-flex', width: '15px', height: '15px' }}>{s.icon}</span>
            {s.label}
          </Pill>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-8)' }}>
        {activeSection === 'institutional' && <InstitutionalSection />}
        {activeSection === 'guide' && <GuideSection />}
        {activeSection === 'reagents' && <ReagentsSection />}
        {activeSection === 'adulterants' && <AdulterantsSection />}
      </div>
    </div>
  );
};

const InstitutionalSection: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <InlineNote>
      <span style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{TESTING_GUIDE.intro}</span>
    </InlineNote>

    <section className="mt-10">
      <SectionLabel accent={SAGE}>¿Por qué es clave testear?</SectionLabel>
      <ul className="mt-5">
        {TESTING_GUIDE.whyTest.map((reason, idx) => (
          <li
            key={idx}
            className="flex gap-4 py-4"
            style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
          >
            <IndexNum size={18} color="var(--accent-weak)">{String(idx + 1).padStart(2, '0')}</IndexNum>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: reason.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:700; color: var(--color-blue)">$1</strong>`) }}
            />
          </li>
        ))}
      </ul>
    </section>

    <section className="mt-12">
      <SectionLabel accent={SAGE} count={INSTITUTIONAL_TESTING.length}>Centros Oficiales y Asociaciones Civiles</SectionLabel>
      <p className="text-sm leading-relaxed mt-4 mb-2" style={{ color: 'var(--text-tertiary)', maxWidth: '62ch' }}>
        Recomendamos acudir prioritariamente a centros de testeo universitarios, laboratorios oficiales o asociaciones civiles formales. Estos espacios cuentan con tecnología avanzada (cromatógrafos, espectrómetros) y personal capacitado para análisis de composición exactos y asesoramiento integral.
      </p>
      <div>
        {INSTITUTIONAL_TESTING.map((resource, idx) => (
          <div
            key={resource.name}
            className="py-6 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <span
              className="flex-shrink-0 sm:w-28"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: SAGE, lineHeight: 1.5 }}
            >
              {resource.type}
            </span>
            <div className="flex-1 min-w-0">
              <Display size="md" upper>{resource.name}</Display>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
                {resource.description}
              </p>
              {resource.contact && (
                <div className="mt-2.5" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: SAGE }}>
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
  <div className="max-w-4xl mx-auto">
    <section>
      <SectionLabel accent={SAGE} count={TESTING_GUIDE.howToTest.length}>Cómo testear paso a paso</SectionLabel>
      <ol className="mt-5">
        {TESTING_GUIDE.howToTest.map((step, idx) => (
          <li
            key={step.step}
            className="flex gap-5 py-5"
            style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
          >
            <IndexNum size={26} color="var(--accent-weak)">{String(step.step).padStart(2, '0')}</IndexNum>
            <div className="flex-1 min-w-0">
              <Display size="md" upper>{step.title}</Display>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section className="mt-12">
      <SectionLabel accent="var(--color-amber)">Recomendaciones importantes</SectionLabel>
      <ul className="mt-5">
        {TESTING_GUIDE.recommendations.map((rec, idx) => (
          <li
            key={idx}
            className="flex gap-4 py-4"
            style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', marginTop: '7px', flexShrink: 0, background: 'var(--color-amber)' }} />
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:700; color: var(--color-amber)">$1</strong>`) }}
            />
          </li>
        ))}
      </ul>
    </section>
  </div>
);

const ReagentsSection: React.FC = () => (
  <div className="max-w-5xl mx-auto">
    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)', maxWidth: '64ch' }}>
      Estos son los reactivos más comunes para testear sustancias. Cada reactivo reacciona de forma diferente con distintas sustancias, por eso es crucial usar varios reactivos para confirmar.
    </p>
    <div className="mt-10 space-y-12">
      {REAGENT_TESTS.map((reagent) => (
        <section key={reagent.name}>
          <SectionLabel accent={SAGE} count={reagent.substances.length}>{reagent.name}</SectionLabel>
          <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-tertiary)', maxWidth: '62ch' }}>{reagent.description}</p>
          <div className="mt-4">
            {reagent.substances.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 py-3.5"
                style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
              >
                <CircleThumb size={28} color={sub.color} ring style={{ border: '1px solid rgba(255,255,255,0.18)' }} />
                <span className="flex-1 min-w-0 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{sub.substance}</span>
                <span className="text-xs text-right" style={{ color: 'var(--text-muted)', maxWidth: '20ch' }}>{sub.reaction}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);

const ResourcesSection: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)', maxWidth: '64ch' }}>
      Estos son los recursos disponibles en Argentina para conseguir kits de testeo o acceder a servicios de análisis de sustancias.
    </p>
    <div className="mt-8">
      {TESTING_RESOURCES.map((resource, idx) => {
        const accent = resource.type === 'organization' ? 'var(--color-violet)' : resource.type === 'online' ? 'var(--color-blue)' : 'var(--color-green)';
        return (
          <div
            key={idx}
            className="flex items-start gap-4 py-6"
            style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
          >
            <CircleThumb size={40} color={accent} style={{ color: 'var(--accent-ink)' }}>
              {resource.type === 'online' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
              ) : resource.type === 'physical' ? (
                <MapPinIcon />
              ) : (
                <BeakerIcon />
              )}
            </CircleThumb>
            <div className="flex-1 min-w-0">
              <Display size="md" upper>{resource.name}</Display>
              {resource.location && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{resource.location}</p>}
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{resource.description}</p>
              {resource.website && <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block" style={{ color: SAGE, fontWeight: 700 }}>{resource.website}</a>}
              {resource.contact && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{resource.contact}</p>}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const AdulterantsSection: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <InlineNote label="Advertencia" accent="var(--color-red)">
      Estos son algunos de los adulterantes más peligrosos que se encuentran en el mercado ilegal. El testeo de sustancias es fundamental para detectarlos.
    </InlineNote>

    <section className="mt-10">
      <SectionLabel accent="var(--color-red)" count={TESTING_GUIDE.commonAdulterants.length}>Adulterantes frecuentes</SectionLabel>
      <div className="grid sm:grid-cols-2 gap-x-10 mt-4">
        {TESTING_GUIDE.commonAdulterants.map((adulterant, idx) => (
          <div
            key={idx}
            className="flex gap-4 py-5"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: 'var(--color-red)' }} />
            <div className="flex-1 min-w-0">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{adulterant.substance}</h3>
              <p className="text-sm leading-relaxed mt-1.5" style={{ color: 'var(--text-secondary)' }}>{adulterant.risk}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="mt-10">
      <InlineNote label="Recuerda" accent="var(--color-blue)">
        Los reactivos de color NO detectan todos los adulterantes. Para un análisis completo (GC/MS), llevá tus sustancias a organizaciones como ArgenPills.
      </InlineNote>
    </div>
  </div>
);
