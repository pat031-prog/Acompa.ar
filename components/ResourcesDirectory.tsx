import React, { useState, useMemo } from 'react';
import { LOCAL_RESOURCES, PROVINCES, RESOURCE_TYPES } from '../constants';
import type { LocalResource } from '../types';
import { PageHeader } from './ui';

const SAGE = 'var(--accent-secondary)';

const PhoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const MapPinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);
const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const GlobeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
);

const getTypeIcon = (type: LocalResource['type']) => ({ hospital: '🏥', clinic: '⚕️', hotline: '📞', ngo: '🤝', community_center: '🏘️', therapy: '💭', testing_lab: '🔬', harm_reduction: '🛡️', activism: '✊', government: '🏛️' }[type] || '📍');

const inputStyle: React.CSSProperties = { background: 'var(--surface-1)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', outline: 'none', width: '100%', padding: '10px 12px', fontSize: '14px' };

/** A directory row — flowing, not boxed. The icon+type colour gives scanability without repeating a card shell N times. */
const ResourceRow: React.FC<{ resource: LocalResource; isLast: boolean }> = ({ resource, isLast }) => (
  <div className="py-4 flex items-start gap-3 sm:gap-4" style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)' }}>
    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-lg" style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
      {getTypeIcon(resource.type)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm sm:text-[15px]" style={{ color: 'var(--text-primary)' }}>{resource.name}</h3>
        {resource.free && (
          <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-green)', background: 'var(--color-green-subtle)', borderRadius: '999px' }}>Gratuito</span>
        )}
      </div>
      <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{resource.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {resource.phone && <span className="flex items-center gap-1.5"><PhoneIcon /><a href={`tel:${resource.phone}`} style={{ color: SAGE }}>{resource.phone}</a></span>}
        {(resource.address || resource.city) && <span className="flex items-center gap-1.5"><MapPinIcon />{resource.address && `${resource.address}, `}{resource.city && `${resource.city}, `}{resource.province}</span>}
        {resource.hours && <span className="flex items-center gap-1.5"><ClockIcon />{resource.hours}</span>}
        {resource.website && <span className="flex items-center gap-1.5"><GlobeIcon /><a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: SAGE }}>{resource.website.replace(/^https?:\/\//, '')}</a></span>}
      </div>
      {resource.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {resource.services.map((s, i) => <span key={i} className="px-2 py-0.5 text-[11px]" style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)', borderRadius: 'var(--radius-sm)' }}>{s}</span>)}
        </div>
      )}
    </div>
  </div>
);

const EmergencyLink: React.FC<{ href: string; icon: string; title: string; subtitle: string; accentColor: string; iconBg: string }> = ({ href, icon, title, subtitle, accentColor, iconBg }) => (
  <a
    href={href}
    className="flex items-center gap-3 p-3.5 transition-all duration-200"
    style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = 'var(--shadow-ambient)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0" style={{ background: iconBg, borderRadius: 'var(--radius-sm)' }}>{icon}</div>
    <div>
      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>
    </div>
  </a>
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

  // Group by type, in RESOURCE_TYPES order, so the directory reads as labeled sections rather than one uniform wall of cards.
  const groups = useMemo(() => {
    return RESOURCE_TYPES
      .filter(t => t.value !== 'all')
      .map(t => ({ ...t, items: filteredResources.filter(r => r.type === t.value) }))
      .filter(g => g.items.length > 0);
  }, [filteredResources]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
      <PageHeader
        eyebrow="Directorio nacional"
        title="Recursos en Argentina"
        description="Centros de atención, líneas de ayuda, organizaciones y redes comunitarias de reducción de daños."
        accent={SAGE}
      />

      {/* Quick Access - Emergency Lines */}
      <div className="px-6 sm:px-8 pt-6 pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Si necesitás ayuda ahora</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4">
          <EmergencyLink href="tel:141" icon="🏛️" title="SEDRONAR 141" subtitle="Consumos problemáticos • 24hs" accentColor={SAGE} iconBg="var(--surface-2)" />
          <EmergencyLink href="tel:107" icon="🚑" title="SAME 107" subtitle="Emergencias médicas • 24hs" accentColor="var(--color-red)" iconBg="var(--color-red-subtle)" />
          <EmergencyLink href="tel:135" icon="🧠" title="Línea 135" subtitle="Salud mental (CABA) • 24hs" accentColor="var(--color-violet)" iconBg="var(--surface-2)" />
        </div>
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
            <button onClick={() => { setSelectedProvince('all'); setSelectedType('all'); setSearchTerm(''); }} style={{ color: SAGE }}>Limpiar filtros</button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8 md:px-10 md:py-9">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>No se encontraron recursos con esos criterios.</p>
            <button onClick={() => { setSelectedProvince('all'); setSelectedType('all'); setSearchTerm(''); }} className="mt-3 text-sm sm:text-base" style={{ color: SAGE }}>Ver todos los recursos</button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-9">
            {groups.map(group => (
              <section key={group.value}>
                <h2 className="flex items-center gap-2 mb-1" style={{ fontFamily: 'var(--font-editorial)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {group.label}
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>· {group.items.length}</span>
                </h2>
                <hr style={{ border: 'none', height: '2px', background: SAGE, width: '40px', margin: '10px 0 2px' }} />
                <div>
                  {group.items.map((r, i) => <ResourceRow key={`${group.value}-${i}`} resource={r} isLast={i === group.items.length - 1} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--color-red-subtle)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-red)' }}>
            ⚠️ En caso de emergencia médica, llamá al SAME: <a href="tel:107" style={{ textDecoration: 'underline' }}>107</a>. Consumos problemáticos: SEDRONAR <a href="tel:141" style={{ textDecoration: 'underline' }}>141</a> (24hs, gratuito).
          </p>
        </div>
      </div>
    </div>
  );
};
