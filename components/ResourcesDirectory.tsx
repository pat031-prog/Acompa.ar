import React, { useState, useMemo } from 'react';
import { LOCAL_RESOURCES, PROVINCES, RESOURCE_TYPES } from '../constants';
import type { LocalResource } from '../types';

// Icons
const PhoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const MapPinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const CheckBadgeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
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

const getTypeColor = (type: LocalResource['type']) => {
  const colorMap = {
    hospital: 'bg-white/[0.02] text-white/90 border-white/[0.08]',
    clinic: 'bg-white/[0.02] text-white/90 border-white/[0.08]',
    hotline: 'bg-white/[0.02] text-white/90 border-white/[0.08]',
    ngo: 'bg-white/[0.02] text-white/90 border-white/[0.08]',
    community_center: 'bg-white/[0.02] text-white/90 border-white/[0.08]',
    therapy: 'bg-white/[0.02] text-white/90 border-white/[0.08]',
  };
  return colorMap[type] || 'bg-white/[0.02] text-white/90 border-white/[0.08]';
};

const ResourceCard: React.FC<{ resource: LocalResource }> = ({ resource }) => {
  return (
    <div
      className="hover-glow rounded-[var(--radius-md)] p-5 sm:p-6"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl border ${getTypeColor(resource.type)}`}>
          {getTypeIcon(resource.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-100 text-sm sm:text-base">{resource.name}</h3>
            {resource.free && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-white/[0.04] text-white/75 rounded-full border border-white/[0.12]">
                Gratuito
              </span>
            )}
          </div>

          <p className="text-sm text-gray-300 mb-3 leading-relaxed">{resource.description}</p>

          <div className="space-y-2 text-sm">
            {resource.phone && (
              <div className="flex items-center gap-2 text-gray-400">
                <PhoneIcon />
                <a href={`tel:${resource.phone}`} className="hover:text-blue-400 transition-colors">
                  {resource.phone}
                </a>
              </div>
            )}

            {(resource.address || resource.city) && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPinIcon />
                <span>
                  {resource.address && `${resource.address}, `}
                  {resource.city && `${resource.city}, `}
                  {resource.province}
                </span>
              </div>
            )}

            {resource.hours && (
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon />
                <span>{resource.hours}</span>
              </div>
            )}

            {resource.website && (
              <div className="flex items-center gap-2 text-gray-400">
                <GlobeIcon />
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors truncate"
                >
                  {resource.website.replace(/^https?:\/\//,'')}
                </a>
              </div>
            )}
          </div>

          {resource.services.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                <CheckBadgeIcon />
                <span>Servicios:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resource.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-300 rounded"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
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

  const resourceCount = filteredResources.length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
          <MapPinIcon />
          <span className="hidden sm:inline">Directorio de Recursos en Argentina</span>
          <span className="sm:hidden">Recursos</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Centros de atención, líneas de ayuda y organizaciones de reducción de daños
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 sm:p-8 border-b border-gray-800 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre, servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Provincia</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todas las provincias</option>
              {['Nacional', ...PROVINCES.sort()].map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Tipo de recurso</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {RESOURCE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {resourceCount} {resourceCount === 1 ? 'recurso encontrado' : 'recursos encontrados'}
          </span>
          {(selectedProvince !== 'all' || selectedType !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedProvince('all');
                setSelectedType('all');
                setSearchTerm('');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resources List */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-12">
        {resourceCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-gray-400">No se encontraron recursos con esos criterios.</p>
            <button
              onClick={() => {
                setSelectedProvince('all');
                setSelectedType('all');
                setSearchTerm('');
              }}
              className="mt-3 text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver todos los recursos
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 max-w-5xl mx-auto">
            {filteredResources.map((resource, idx) => (
              <ResourceCard key={idx} resource={resource} />
            ))}
          </div>
        )}
      </div>

      {/* Emergency notice */}
      <div className="p-4 border-t border-gray-800 bg-red-500/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-red-400 font-semibold">
            ⚠️ En caso de emergencia médica, llamá inmediatamente al SAME: <a href="tel:107" className="underline">107</a>
          </p>
        </div>
      </div>
    </div>
  );
};
