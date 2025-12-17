import React, { useState, useMemo } from 'react';
import { LOCAL_RESOURCES, PROVINCES, RESOURCE_TYPES } from '../constants';
import { Section, Callout, Chip } from './ui/Section';
import type { LocalResource } from '../types';

const PhoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

const getTypeIcon = (type: LocalResource['type']) => {
  const iconMap = {
    hospital: '🏥',
    clinic: '⚕️',
    hotline: '📞',
    ngo: '🤝',
    community_center: '🏘️',
    therapy: '💭',
  };
  return iconMap[type] || '📍';
};

const ResourceRow: React.FC<{ resource: LocalResource; index: number }> = ({ resource, index }) => {
  // Build location string
  const location = [resource.city, resource.province].filter(Boolean).join(', ');

  return (
    <div
      className="py-5 border-b"
      style={{
        borderColor: 'var(--border)',
        animation: `fadeIn 0.15s ease-out ${index * 0.03}s both`
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl border"
          style={{
            background: 'var(--surface-2)',
            borderColor: 'var(--border)'
          }}
        >
          {getTypeIcon(resource.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header line */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {resource.name}
                </h3>
                {resource.free && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#22c55e'
                    }}
                  >
                    Gratuito
                  </span>
                )}
              </div>
              {location && (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {location}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {resource.phone && (
                <a
                  href={`tel:${resource.phone}`}
                  className="p-2 rounded-md border active:scale-95"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    transition: `all var(--t-fast) var(--ease)`
                  }}
                  title={`Llamar: ${resource.phone}`}
                >
                  <PhoneIcon />
                </a>
              )}
              {resource.website && (
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md border active:scale-95"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    transition: `all var(--t-fast) var(--ease)`
                  }}
                  title="Visitar sitio web"
                >
                  <GlobeIcon />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p
            className="editorial text-sm leading-relaxed mb-3"
            style={{ color: 'var(--muted)' }}
          >
            {resource.description}
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {/* Services */}
            {resource.services.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span style={{ color: 'var(--faint)' }}>Servicios:</span>
                <div className="flex flex-wrap gap-1">
                  {resource.services.slice(0, 3).map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: 'var(--surface-3)',
                        color: 'var(--muted)'
                      }}
                    >
                      {service}
                    </span>
                  ))}
                  {resource.services.length > 3 && (
                    <span style={{ color: 'var(--faint)' }}>
                      +{resource.services.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Hours */}
            {resource.hours && (
              <span style={{ color: 'var(--faint)' }}>
                {resource.hours}
              </span>
            )}

            {/* Address */}
            {resource.address && (
              <span style={{ color: 'var(--faint)' }}>
                {resource.address}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResourcesDirectory: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => {
    let filtered = LOCAL_RESOURCES;

    if (selectedProvince !== 'all') {
      filtered = filtered.filter(r => r.province === selectedProvince || r.province === 'Nacional');
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower) ||
        r.services.some(s => s.toLowerCase().includes(lower))
      );
    }

    return filtered;
  }, [selectedProvince, selectedType, searchTerm]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold"
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-heading)'
            }}
          >
            Directorio de Recursos
          </h1>
          <p className="editorial text-sm mt-2" style={{ color: 'var(--muted)' }}>
            Centros de atención, líneas de ayuda y organizaciones en Argentina
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: 'var(--muted)' }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 text-sm rounded-[var(--radius-md)] border focus:outline-none"
            style={{
              background: 'var(--surface-1)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
              transition: `all var(--t-fast) var(--ease)`
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--accent-weak)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Category chips */}
        <Section title="Categorías" meta="Filtrar por tipo de recurso">
          <div className="flex flex-wrap gap-2">
            {RESOURCE_TYPES.map((type) => (
              <Chip
                key={type.value}
                label={type.label}
                active={selectedType === type.value}
                onClick={() => setSelectedType(type.value)}
              />
            ))}
          </div>
        </Section>

        {/* Province filter */}
        <Section title="Provincia" meta="Filtrar por ubicación">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <Chip
              label="Todas"
              active={selectedProvince === 'all'}
              onClick={() => setSelectedProvince('all')}
            />
            <Chip
              label="Nacional"
              active={selectedProvince === 'Nacional'}
              onClick={() => setSelectedProvince('Nacional')}
            />
            {PROVINCES.sort().slice(0, 6).map((province) => (
              <Chip
                key={province}
                label={province}
                active={selectedProvince === province}
                onClick={() => setSelectedProvince(province)}
              />
            ))}
          </div>
          {selectedProvince !== 'all' && selectedProvince !== 'Nacional' && !PROVINCES.slice(0, 6).includes(selectedProvince) && (
            <div className="mt-3">
              <Chip
                label={`✓ ${selectedProvince}`}
                active={true}
                onClick={() => setSelectedProvince('all')}
              />
            </div>
          )}
          <details className="mt-3">
            <summary
              className="text-sm cursor-pointer"
              style={{ color: 'var(--accent)' }}
            >
              Ver todas las provincias
            </summary>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
              {PROVINCES.sort().slice(6).map((province) => (
                <Chip
                  key={province}
                  label={province}
                  active={selectedProvince === province}
                  onClick={() => setSelectedProvince(province)}
                />
              ))}
            </div>
          </details>
        </Section>

        {/* Resources list */}
        <Section
          title="Resultados"
          meta={`${filteredResources.length} recurso${filteredResources.length !== 1 ? 's' : ''}`}
        >
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
                No se encontraron recursos con esos criterios.
              </p>
              <button
                onClick={() => {
                  setSelectedProvince('all');
                  setSelectedType('all');
                  setSearchTerm('');
                }}
                className="mt-4 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--accent)',
                  transition: `all var(--t-fast) var(--ease)`
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div>
              {filteredResources.map((resource, idx) => (
                <ResourceRow key={idx} resource={resource} index={idx} />
              ))}
            </div>
          )}
        </Section>

        {/* Emergency callout */}
        <Callout variant="warning" icon="⚠️">
          <strong style={{ color: 'var(--text)' }}>Emergencia médica:</strong>{' '}
          <span className="editorial" style={{ color: 'var(--muted)' }}>
            Si necesitás atención urgente, llamá al SAME{' '}
            <a
              href="tel:107"
              style={{ color: 'var(--accent)' }}
              className="font-semibold underline"
            >
              107
            </a>
            {' '}o al{' '}
            <a
              href="tel:911"
              style={{ color: 'var(--accent)' }}
              className="font-semibold underline"
            >
              911
            </a>
          </span>
        </Callout>
      </div>
    </div>
  );
};
