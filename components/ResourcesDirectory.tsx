import React, { useState, useMemo } from 'react';
import { LOCAL_RESOURCES, PROVINCES, RESOURCE_TYPES } from '../constants';
import type { LocalResource } from '../types';
import { PageHeader, Panel, Display, Orb, SectionLabel, CircleThumb, Pill, InlineNote, fieldStyle, FieldLabel } from './ui';

const SAGE = 'var(--accent-primary)';

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
// Solid glyph that sits inside the coral emergency Orb (renders in accent-ink).
const PhoneGlyphIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" /></svg>
);
// Section medallion: a simple map-pin stroke icon for the PageHeader planet.
const MapPinMedallionIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" width={24} height={24}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);

const getTypeIcon = (type: LocalResource['type']) => ({ hospital: '🏥', clinic: '⚕️', hotline: '📞', ngo: '🤝', community_center: '🏘️', therapy: '💭', testing_lab: '🔬', harm_reduction: '🛡️', activism: '✊', government: '🏛️' }[type] || '📍');

/** A directory row — flowing, not boxed. A CircleThumb motif carries the type glyph, giving scanability without repeating a card shell N times. */
const ResourceRow: React.FC<{ resource: LocalResource; first: boolean }> = ({ resource, first }) => (
  <div className="py-5 flex items-start gap-4 sm:gap-5" style={{ borderTop: first ? 'none' : '1px solid var(--border-subtle)' }}>
    <CircleThumb size={44} color="var(--surface-2)" ring style={{ fontSize: '19px' }}>
      {getTypeIcon(resource.type)}
    </CircleThumb>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>{resource.name}</h3>
        {resource.free && (
          <span className="flex-shrink-0"><Pill as="span" color="var(--color-green)" active>Gratuito</Pill></span>
        )}
      </div>
      <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{resource.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {resource.phone && <span className="flex items-center gap-1.5" style={{ color: SAGE }}><PhoneIcon /><a href={`tel:${resource.phone}`} style={{ color: SAGE, fontWeight: 600 }}>{resource.phone}</a></span>}
        {(resource.address || resource.city) && <span className="flex items-center gap-1.5"><MapPinIcon />{resource.address && `${resource.address}, `}{resource.city && `${resource.city}, `}{resource.province}</span>}
        {resource.hours && <span className="flex items-center gap-1.5"><ClockIcon />{resource.hours}</span>}
        {resource.website && <span className="flex items-center gap-1.5" style={{ color: SAGE }}><GlobeIcon /><a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: SAGE, fontWeight: 600 }}>{resource.website.replace(/^https?:\/\//, '')}</a></span>}
      </div>
      {resource.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {resource.services.map((s, i) => <Pill key={i} as="span" color="var(--text-tertiary)">{s}</Pill>)}
        </div>
      )}
    </div>
  </div>
);

/** An emergency line — a focused, circular feature block: coral Orb holding the
 *  phone glyph, the number as a big Display, and its identity beside it. */
const EmergencyLine: React.FC<{ href: string; number: string; title: string; subtitle: string; hero: boolean }> = ({ href, number, title, subtitle, hero }) => (
  <a
    href={href}
    className="group flex items-center gap-4 py-2 transition-transform active:scale-[0.99]"
    style={{ textDecoration: 'none' }}
  >
    <Orb color={hero ? 'var(--accent-primary)' : 'var(--surface-2)'} size={58} label={
      <span style={{ display: 'inline-flex', color: hero ? 'var(--accent-ink)' : 'var(--accent-primary)' }}><PhoneGlyphIcon /></span>
    } />
    <div className="min-w-0">
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{title}</p>
      <Display size="md" color="var(--text-primary)">{number}</Display>
      <p className="mt-0.5" style={{ fontSize: '12px', lineHeight: 1.4, color: 'var(--text-tertiary)' }}>{subtitle}</p>
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

  const hasFilters = selectedProvince !== 'all' || selectedType !== 'all' || !!searchTerm;
  const clearFilters = () => { setSelectedProvince('all'); setSelectedType('all'); setSearchTerm(''); };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col min-h-0" style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        eyebrow="Directorio nacional"
        title="Recursos en Argentina"
        description="Centros de atención, líneas de ayuda, organizaciones y redes comunitarias de reducción de daños."
        accent={SAGE}
        icon={<MapPinMedallionIcon />}
      />

      {/* ── Emergency lines — focused circular Orb blocks ── */}
      <section className="px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-2xl">
          <SectionLabel accent="var(--accent-primary)">Si necesitás ayuda ahora</SectionLabel>
          <div className="mt-6 space-y-6">
            <EmergencyLine href="tel:141" number="141" title="SEDRONAR" subtitle="Consumos problemáticos · 24hs" hero />
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            <EmergencyLine href="tel:107" number="107" title="SAME" subtitle="Emergencias médicas · 24hs" hero={false} />
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            <EmergencyLine href="tel:135" number="135" title="Línea 135" subtitle="Salud mental (CABA) · 24hs" hero={false} />
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <FieldLabel>Buscar</FieldLabel>
              <input type="text" placeholder="Buscar por nombre, servicio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={fieldStyle} />
            </div>
            <div className="flex-1">
              <FieldLabel>Provincia</FieldLabel>
              <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} style={fieldStyle}>
                <option value="all">Todas las provincias</option>
                {['Nacional', ...PROVINCES.sort()].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <FieldLabel>Tipo de recurso</FieldLabel>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={fieldStyle}>
                {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>{filteredResources.length} {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}</span>
            {hasFilters && (
              <button onClick={clearFilters} style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: SAGE }}>Limpiar filtros</button>
            )}
          </div>
        </div>
      </section>

      {/* ── Directory — ruled lists grouped by type, generous rhythm ── */}
      <div className="px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        {groups.length === 0 ? (
          <div className="max-w-3xl py-12">
            <InlineNote label="Sin resultados" accent="var(--text-muted)">
              No se encontraron recursos con esos criterios.{' '}
              <button onClick={clearFilters} style={{ color: SAGE, fontWeight: 700 }}>Ver todos los recursos</button>
            </InlineNote>
          </div>
        ) : (
          <div className="max-w-3xl space-y-14">
            {groups.map(group => (
              <section key={group.value}>
                <SectionLabel accent="var(--accent-primary)" count={group.items.length}>{group.label}</SectionLabel>
                <div className="mt-3">
                  {group.items.map((r, i) => <ResourceRow key={`${group.value}-${i}`} resource={r} first={i === 0} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom emergency note ── */}
      <div className="px-5 sm:px-7 lg:px-8 pb-10 pt-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-6)' }}>
        <div className="max-w-3xl">
          <InlineNote label="Emergencias" accent="var(--color-red)">
            En caso de emergencia médica, llamá al SAME: <a href="tel:107" style={{ color: 'var(--color-red)', fontWeight: 700 }}>107</a>. Consumos problemáticos: SEDRONAR <a href="tel:141" style={{ color: 'var(--color-red)', fontWeight: 700 }}>141</a> (24hs, gratuito).
          </InlineNote>
        </div>
      </div>
    </div>
  );
};
