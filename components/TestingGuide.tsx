import React, { useState } from 'react';
import { REAGENT_TESTS, TESTING_RESOURCES, TESTING_GUIDE } from '../constants';
import { Section, Callout, Chip } from './ui/Section';

// Icons
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

type Step = 1 | 2 | 3 | 4 | 5;

const steps: Array<{ id: Step; label: string; title: string }> = [
  { id: 1, label: 'Preparar', title: 'Preparar el material' },
  { id: 2, label: 'Aplicar', title: 'Aplicar el reactivo' },
  { id: 3, label: 'Observar', title: 'Observar la reacción' },
  { id: 4, label: 'Interpretar', title: 'Interpretar resultados' },
  { id: 5, label: 'Actuar', title: 'Decidir y actuar' }
];

export const TestingGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<Step | null>(null);

  const scrollToStep = (stepId: Step) => {
    setActiveStep(stepId);
    const element = document.getElementById(`step-${stepId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Left rail: Step navigation (desktop) */}
      <div
        className="hidden lg:flex lg:w-64 xl:w-80 flex-col border-r p-6 space-y-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: 'var(--text)' }}
        >
          Pasos
        </h3>
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => scrollToStep(step.id)}
            className="text-left px-3 py-2.5 rounded-lg text-sm active:scale-98"
            style={{
              background: activeStep === step.id ? 'var(--surface-3)' : 'transparent',
              color: activeStep === step.id ? 'var(--text)' : 'var(--muted)',
              fontWeight: activeStep === step.id ? 500 : 400,
              borderLeft: activeStep === step.id ? `2px solid var(--accent)` : '2px solid transparent',
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: activeStep === step.id ? 'var(--accent)' : 'var(--surface-2)',
                  color: activeStep === step.id ? 'white' : 'var(--muted)'
                }}
              >
                {step.id}
              </span>
              <span>{step.label}</span>
            </div>
          </button>
        ))}

        {/* Quick links */}
        <div className="pt-6 mt-6" style={{ borderTop: `1px solid var(--border)` }}>
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Más información
          </h3>
          <a
            href="#recursos"
            className="block px-3 py-2 rounded-lg text-sm hover:underline"
            style={{
              color: 'var(--muted)',
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            Dónde conseguir kits
          </a>
          <a
            href="#adulterantes"
            className="block px-3 py-2 rounded-lg text-sm hover:underline"
            style={{
              color: 'var(--muted)',
              transition: `all var(--t-fast) var(--ease)`
            }}
          >
            Adulterantes comunes
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 sm:p-8 lg:p-10 space-y-12">
          {/* Mobile step chips */}
          <div className="lg:hidden flex flex-wrap gap-2 mb-6">
            {steps.map((step) => (
              <Chip
                key={step.id}
                label={`${step.id}. ${step.label}`}
                active={activeStep === step.id}
                onClick={() => scrollToStep(step.id)}
              />
            ))}
          </div>

          {/* Introduction */}
          <Section spacing="loose">
            <Callout variant="neutral" icon="🧪">
              {TESTING_GUIDE.intro}
            </Callout>
          </Section>

          {/* Why test */}
          <Section title="¿Por qué testear?" spacing="loose">
            <ul className="editorial space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
              {TESTING_GUIDE.whyTest.map((reason, idx) => (
                <li
                  key={idx}
                  className="relative pl-6"
                  style={{ animation: `fadeIn 0.2s ease-out ${idx * 0.05}s both` }}
                  dangerouslySetInnerHTML={{
                    __html: `<span class="absolute left-0" style="color: var(--accent)">•</span>${reason.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text); font-weight: 600">$1</strong>')}`
                  }}
                />
              ))}
            </ul>
          </Section>

          {/* Step 1: Prepare */}
          <Section
            title="1. Preparar"
            meta="Reúne el material y prepara el espacio de trabajo"
            spacing="normal"
          >
            <div id="step-1" className="scroll-mt-4">
              <div className="editorial text-sm space-y-4" style={{ color: 'var(--muted)' }}>
                <p>
                  <strong style={{ color: 'var(--text)' }}>Material necesario:</strong> Kit de reactivos (Marquis, Mecke, Mandelin, etc.), placa de cerámica blanca, muestra pequeña de la sustancia (una pizca), guantes desechables.
                </p>
                <p>
                  Trabajá en un espacio bien iluminado y ventilado. Los reactivos son corrosivos y deben manejarse con cuidado.
                </p>
                <Callout variant="warning" icon="⚠️">
                  <strong>Seguridad:</strong> Usá guantes. No toques los reactivos directamente. Mantené alejado de niños y mascotas.
                </Callout>
              </div>
            </div>
          </Section>

          {/* Step 2: Apply */}
          <Section
            title="2. Aplicar"
            meta="Coloca la muestra y añade el reactivo"
            spacing="normal"
          >
            <div id="step-2" className="scroll-mt-4">
              <div className="editorial text-sm space-y-4" style={{ color: 'var(--muted)' }}>
                <p>
                  Colocá una cantidad muy pequeña de la sustancia (del tamaño de un grano de arroz) sobre la placa blanca. Añadí 1-2 gotas del reactivo directamente sobre la muestra.
                </p>
                <p>
                  <strong style={{ color: 'var(--text)' }}>Importante:</strong> No agregues demasiado reactivo. Una gota es suficiente para ver la reacción.
                </p>
              </div>
            </div>
          </Section>

          {/* Step 3: Observe */}
          <Section
            title="3. Observar"
            meta="Espera y observa el cambio de color"
            spacing="normal"
          >
            <div id="step-3" className="scroll-mt-4">
              <div className="editorial text-sm space-y-4" style={{ color: 'var(--muted)' }}>
                <p>
                  La reacción ocurre rápidamente, generalmente en segundos. Observá el color inmediato y cualquier cambio que ocurra en los primeros 30-60 segundos.
                </p>
                <p>
                  Anotá o fotografiá el color resultante para compararlo con las tablas de referencia.
                </p>
              </div>
            </div>
          </Section>

          {/* Step 4: Interpret - with color swatches */}
          <Section
            title="4. Interpretar"
            meta="Compara el color con las tablas de referencia"
            spacing="normal"
          >
            <div id="step-4" className="scroll-mt-4">
              <div className="editorial text-sm space-y-4 mb-6" style={{ color: 'var(--muted)' }}>
                <p>
                  Cada reactivo produce colores diferentes para cada sustancia. <strong style={{ color: 'var(--text)' }}>Usá VARIOS reactivos</strong> para confirmar la identidad de una sustancia, ya que un solo reactivo puede dar falsos positivos.
                </p>
              </div>

              {/* Reagent color tables */}
              <div className="space-y-6">
                {REAGENT_TESTS.map((reagent) => (
                  <div key={reagent.name}>
                    <h4
                      className="text-sm font-semibold mb-3"
                      style={{ color: 'var(--text)' }}
                    >
                      {reagent.name}
                    </h4>
                    <p
                      className="editorial text-xs mb-3"
                      style={{ color: 'var(--muted)' }}
                    >
                      {reagent.description}
                    </p>
                    <div className="space-y-2">
                      {reagent.substances.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 px-3 rounded-lg border"
                          style={{
                            background: 'var(--surface-1)',
                            borderColor: 'var(--border)'
                          }}
                        >
                          <span
                            className="text-sm font-medium"
                            style={{ color: 'var(--text)' }}
                          >
                            {sub.substance}
                          </span>
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs"
                              style={{ color: 'var(--muted)' }}
                            >
                              {sub.reaction}
                            </span>
                            <div
                              className="w-12 h-6 rounded border flex-shrink-0"
                              style={{
                                backgroundColor: sub.color,
                                borderColor: 'var(--border)'
                              }}
                              title={sub.reaction}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Callout variant="warning" icon="ℹ️">
                <strong>Limitaciones:</strong> Los reactivos de color NO detectan todos los adulterantes ni confirman pureza. Para análisis completo (GC/MS), contactá con organizaciones especializadas.
              </Callout>
            </div>
          </Section>

          {/* Step 5: Act */}
          <Section
            title="5. Actuar"
            meta="Toma decisiones informadas sobre el consumo"
            spacing="normal"
          >
            <div id="step-5" className="scroll-mt-4">
              <div className="editorial text-sm space-y-4" style={{ color: 'var(--muted)' }}>
                <p>
                  Si el test confirma la presencia de la sustancia esperada:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Considerá empezar con dosis bajas</li>
                  <li>Asegurate de tener un entorno seguro</li>
                  <li>Nunca consumas solo/a</li>
                </ul>
                <p className="mt-4">
                  Si el test muestra resultados inesperados o presencia de adulterantes:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong style={{ color: 'var(--text)' }}>No consumir</strong></li>
                  <li>Descarta la sustancia de forma segura</li>
                  <li>Avisa a tu red sobre sustancias adulteradas en circulación</li>
                </ul>
                <Callout variant="warning" icon="🚨">
                  <strong>Recuerda:</strong> Un test negativo no garantiza seguridad total. Siempre aplicá estrategias de reducción de daños.
                </Callout>
              </div>
            </div>
          </Section>

          {/* Recommendations */}
          <Section title="Recomendaciones importantes" spacing="loose">
            <ul className="editorial space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
              {TESTING_GUIDE.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="relative pl-6"
                  dangerouslySetInnerHTML={{
                    __html: `<span class="absolute left-0" style="color: var(--accent)">•</span>${rec.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text); font-weight: 600">$1</strong>')}`
                  }}
                />
              ))}
            </ul>
          </Section>

          {/* Resources */}
          <Section
            title="Dónde conseguir kits"
            meta="Recursos en Argentina para acceder a kits de testeo"
            spacing="loose"
          >
            <div id="recursos" className="scroll-mt-4">
              <div className="space-y-4">
                {TESTING_RESOURCES.map((resource, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-5"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: resource.type === 'organization'
                            ? 'rgba(168, 85, 247, 0.1)'
                            : resource.type === 'online'
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(34, 197, 94, 0.1)',
                          color: resource.type === 'organization'
                            ? '#a855f7'
                            : resource.type === 'online'
                            ? '#3b82f6'
                            : '#22c55e'
                        }}
                      >
                        {resource.type === 'physical' ? <MapPinIcon /> : <BeakerIcon />}
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: 'var(--text)' }}
                        >
                          {resource.name}
                        </h4>
                        {resource.location && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                            📍 {resource.location}
                          </p>
                        )}
                        <p
                          className="editorial text-xs mt-2"
                          style={{ color: 'var(--muted)' }}
                        >
                          {resource.description}
                        </p>
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs mt-2 inline-block hover:underline"
                            style={{ color: 'var(--accent)' }}
                          >
                            🔗 {resource.website}
                          </a>
                        )}
                        {resource.contact && (
                          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                            📞 {resource.contact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Adulterants */}
          <Section
            title="Adulterantes comunes"
            meta="Sustancias peligrosas que pueden estar presentes"
            spacing="loose"
          >
            <div id="adulterantes" className="scroll-mt-4">
              <Callout variant="warning" icon="⚠️">
                <strong>Advertencia:</strong> Estos son algunos de los adulterantes más peligrosos en el mercado ilegal. El testeo es fundamental para detectarlos.
              </Callout>

              <div className="space-y-3 mt-6">
                {TESTING_GUIDE.commonAdulterants.map((adulterant, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 rounded-lg p-4"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                      borderLeftColor: 'rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <h5
                      className="font-semibold text-sm flex items-center gap-2"
                      style={{ color: 'var(--text)' }}
                    >
                      {adulterant.substance}
                    </h5>
                    <p
                      className="editorial text-xs mt-1"
                      style={{ color: 'var(--muted)' }}
                    >
                      {adulterant.risk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};
