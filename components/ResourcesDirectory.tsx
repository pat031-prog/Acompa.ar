import React, { useState, useMemo } from 'react';
import { LOCAL_RESOURCES, PROVINCES, RESOURCE_TYPES } from '../constants';
import type { LocalResource } from '../types';

const PhoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const MapPinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);
const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const GlobeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
);
const CheckBadgeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
);

const getTypeIcon = (type: LocalResource['type']) => ({ hospital: '🏥', clinic: '⚕️', hotline: '📞', ngo: '🤝', community_center: '🏘️', therapy: '💭' }[type] || '📍');

const inputStyle: React.CSSProperties = { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', outline: 'none', width: '100%', padding: '10px 12px', fontSize: '14px' };

const ResourceCard: React.FC<{ resource: LocalResource }> = ({ resource }) => (
  <div
    className="p-5 sm:p-6 transition-all duration-200"
    style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-ambient)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
        {getTypeIcon(resource.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>{resource.name}</h3>
          {resource.free && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--color-green-subtle)', color: 'var(--color-green)', border: '1px solid var(--color-green-medium)', borderRadius: '999px' }}>Gratuito</span>
          )}
        </div>
        <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{resource.description}</p>
        <div className="space-y-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {resource.phone && <div className="flex items-center gap-2"><PhoneIcon /><a href={`tel:${resource.phone}`} style={{ color: 'var(--color-blue)' }}>{resource.phone}</a></div>}
          {(resource.address || resource.city) && <div className="flex items-center gap-2"><MapPinIcon /><span>{resource.address && `${resource.address}, `}{resource.city && `${resource.city}, `}{resource.province}</span></div>}
          {resource.hours && <div className="flex items-center gap-2"><ClockIcon /><span>{resource.hours}</span></div>}
          {resource.website && <div className="flex items-center gap-2"><GlobeIcon /><a href={resource.website} target="_blank" rel="noopener noreferrer" className="truncate" style={{ color: 'var(--color-blue)' }}>{resource.website.replace(/^https?:\/\//, '')}</a></div>}
        </div>
        {resource.services.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-1 text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}><CheckBadgeIcon /><span>Servicios:</span></div>
            <div className="flex flex-wrap gap-1.5">
              {resource.services.map((s, i) => <span key={i} className="px-2 py-0.5 text-xs" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', borderRadius: '4px' }}>{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ResourcesDirectory: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => {
    let f = LOCAL_RESOURCES;
    if (selectedProvince !== 'all') f = f.filter(r => r.province === selectedProvince || r.province === 'Nacional');
    if (selectedType !== 'all') f = f.filter(r => r.type === selectedType);
    if (searchTerm) { const l = searchTerm.toLowerCase(); f = f.filter(r => r.name.toLowerCase().includes(l) || r.description.toLowerCase().includes(l) || r.services.some(s => s.toLowerCase().includes(l))); }
    return f;
  }, [selectedProvince, selectedType, searchTerm]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-6 sm:p-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 className="editorial-heading text-xl sm:text-2xl flex items-center gap-2">
          <span style={{ color: 'var(--color-green)' }}><MapPinIcon /></span>
          <span className="hidden sm:inline">Directorio de Recursos en Argentina</span>
          <span className="sm:hidden">Recursos</span>
        </h1>
        <p className="editorial-subtitle text-xs sm:text-sm mt-1">Centros de atención, líneas de ayuda y organizaciones de reducción de daños</p>
      </div>

      <div className="p-6 sm:p-8 space-y-3 sm:space-y-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Buscar</label>
            <input type="text" placeholder="Buscar por nombre, servicio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Provincia</label>
            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} style={inputStyle}>
              <option value="all">Todas las provincias</option>
              {['Nacional', ...PROVINCES.sort()].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tipo de recurso</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={inputStyle}>
              {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--text-tertiary)' }}>{filteredResources.length} {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}</span>
          {(selectedProvince !== 'all' || selectedType !== 'all' || searchTerm) && (
            <button onClick={() => { setSelectedProvince('all'); setSelectedType('all'); setSearchTerm(''); }} style={{ color: 'var(--accent-primary)' }}>Limpiar filtros</button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-12">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>No se encontraron recursos con esos criterios.</p>
            <button onClick={() => { setSelectedProvince('all'); setSelectedType('all'); setSearchTerm(''); }} className="mt-3 text-sm sm:text-base" style={{ color: 'var(--accent-primary)' }}>Ver todos los recursos</button>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 max-w-5xl mx-auto">
            {filteredResources.map((r, i) => <ResourceCard key={i} resource={r} />)}
          </div>
        )}
      </div>

      <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--color-red-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-red)' }}>
            ⚠️ En caso de emergencia médica, llamá inmediatamente al SAME: <a href="tel:107" style={{ textDecoration: 'underline' }}>107</a>
          </p>
        </div>
      </div>
    </div>
  );
};
