import React, { useState } from 'react';
import { REAGENT_TESTS, TESTING_RESOURCES, TESTING_GUIDE } from '../constants';

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

export const TestingGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('guide');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <BeakerIcon />
          Guía de Testeo de Sustancias
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Información completa sobre reactivos, recursos y cómo testear sustancias en Argentina
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 p-5 sm:p-6 border-b border-gray-800 overflow-x-auto">
        <button
          onClick={() => setActiveSection('guide')}
          className={`px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap ${
            activeSection === 'guide'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpenIcon />
            Guía de Testeo
          </div>
        </button>
        <button
          onClick={() => setActiveSection('reagents')}
          className={`px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap ${
            activeSection === 'reagents'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <BeakerIcon />
            Reactivos
          </div>
        </button>
        <button
          onClick={() => setActiveSection('resources')}
          className={`px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap ${
            activeSection === 'resources'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <MapPinIcon />
            Dónde Conseguir
          </div>
        </button>
        <button
          onClick={() => setActiveSection('adulterants')}
          className={`px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap ${
            activeSection === 'adulterants'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon />
            Adulterantes Comunes
          </div>
        </button>
      </div>

      {/* Content */}
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
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5 sm:p-6">
      <p className="text-gray-200 leading-relaxed">{TESTING_GUIDE.intro}</p>
    </div>

    <section>
      <h2 className="text-xl font-bold text-gray-100 mb-3">¿Por qué testear?</h2>
      <ul className="space-y-2">
        {TESTING_GUIDE.whyTest.map((reason, idx) => (
          <li key={idx} className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: reason.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-300">$1</strong>') }} />
        ))}
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-100 mb-3">Cómo testear paso a paso</h2>
      <div className="space-y-4">
        {TESTING_GUIDE.howToTest.map((step) => (
          <div key={step.step} className="bg-gray-800/40 border border-gray-700 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {step.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-100">{step.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-100 mb-3">Recomendaciones importantes</h2>
      <ul className="space-y-2">
        {TESTING_GUIDE.recommendations.map((rec, idx) => (
          <li key={idx} className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-yellow-300">$1</strong>') }} />
        ))}
      </ul>
    </section>
  </div>
);

const ReagentsSection: React.FC = () => (
  <div className="max-w-5xl mx-auto space-y-6">
    <p className="text-gray-300 text-sm">
      Estos son los reactivos más comunes para testear sustancias. Cada reactivo reacciona de forma diferente con distintas sustancias, por eso es crucial usar varios reactivos para confirmar.
    </p>

    <div className="grid gap-6">
      {REAGENT_TESTS.map((reagent) => (
        <div key={reagent.name} className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-800/60 p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-gray-100">{reagent.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{reagent.description}</p>
          </div>
          <div className="p-4">
            <div className="grid gap-2">
              {reagent.substances.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-900/40 rounded-md">
                  <span className="text-sm text-gray-200 font-medium">{sub.substance}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{sub.reaction}</span>
                    <div
                      className="w-12 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: sub.color }}
                      title={sub.reaction}
                    />
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
    <p className="text-gray-300 text-sm">
      Estos son los recursos disponibles en Argentina para conseguir kits de testeo o acceder a servicios de análisis de sustancias.
    </p>

    <div className="grid gap-5 sm:gap-6">
      {TESTING_RESOURCES.map((resource, idx) => (
        <div key={idx} className="bg-gray-800/40 border border-gray-700 rounded-lg p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {resource.type === 'organization' && (
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400">
                  <BeakerIcon />
                </div>
              )}
              {resource.type === 'online' && (
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
              )}
              {resource.type === 'physical' && (
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400">
                  <MapPinIcon />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100">{resource.name}</h3>
              {resource.location && (
                <p className="text-xs text-gray-400 mt-0.5">📍 {resource.location}</p>
              )}
              <p className="text-sm text-gray-300 mt-2">{resource.description}</p>
              {resource.website && (
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
                >
                  🔗 {resource.website}
                </a>
              )}
              {resource.contact && (
                <p className="text-xs text-gray-400 mt-1">📞 {resource.contact}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdulterantsSection: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
      <p className="text-gray-200 text-sm leading-relaxed">
        <strong className="text-red-400">⚠️ Advertencia:</strong> Estos son algunos de los adulterantes más peligrosos que se encuentran en el mercado ilegal. El testeo de sustancias es fundamental para detectarlos.
      </p>
    </div>

    <div className="grid gap-5 sm:gap-6">
      {TESTING_GUIDE.commonAdulterants.map((adulterant, idx) => (
        <div key={idx} className="bg-red-900/10 border border-red-800/40 rounded-lg p-4">
          <h3 className="font-bold text-red-400 flex items-center gap-2">
            <ExclamationTriangleIcon />
            {adulterant.substance}
          </h3>
          <p className="text-sm text-gray-300 mt-2">{adulterant.risk}</p>
        </div>
      ))}
    </div>

    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
      <p className="text-gray-200 text-sm leading-relaxed">
        <strong className="text-blue-300">💡 Recuerda:</strong> Los reactivos de color NO detectan todos los adulterantes. Para un análisis completo (GC/MS), llevá tus sustancias a organizaciones como ArgenPills.
      </p>
    </div>
  </div>
);
