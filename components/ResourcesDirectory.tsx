import React, { useState, useMemo, useEffect } from 'react';
import { LOCAL_RESOURCES, PROVINCES, RESOURCE_TYPES } from '../constants';
import type { LocalResource } from '../types';
import { Kicker, Display, DarkCard, DataBlock, RailItem, CoralButton, fieldStyle } from './ui';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Search, Phone, Globe, Clock, CheckCircle2, Navigation2, ArrowLeft, Mail } from 'lucide-react';

const TYPE_LABEL: Record<LocalResource['type'], string> = {
  hospital: 'Hospital', clinic: 'Centro / Clínica', hotline: 'Línea de ayuda', ngo: 'ONG',
  community_center: 'Centro comunitario', therapy: 'Terapia / Apoyo', testing_lab: 'Testeo / Análisis',
  harm_reduction: 'Reducción de daños', activism: 'Activismo y redes', government: 'Institución pública',
};

const EMERGENCY = [
  { number: '141', title: 'SEDRONAR', sub: 'Consumos · 24hs' },
  { number: '107', title: 'SAME', sub: 'Médica · 24hs' },
  { number: '135', title: 'Línea 135', sub: 'Salud mental' },
];

const Detail: React.FC<{ resource: LocalResource; index: number; onBack: () => void }> = ({ resource, index, onBack }) => {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([resource.name, resource.address, resource.city, resource.province].filter(Boolean).join(', '))}`;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={resource.name}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto w-full"
      >
        {/* Top row */}
        <div className="flex justify-between items-center mb-8 pt-2 md:pt-0">
          <button onClick={onBack} className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ border: '1px solid rgba(0,0,0,0.15)', color: 'var(--accent-ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <ArrowLeft size={15} /> Volver
          </button>
          <span className="hidden md:inline" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>#{String(index).padStart(2, '0')} · {resource.province.slice(0, 3)}</span>
          {resource.free && (
            <div className="rounded-full flex items-center gap-2 px-4 py-2" style={{ background: 'var(--bg-primary)', color: 'var(--color-green)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-green)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Gratuito</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center md:text-left mb-10">
          <div className="mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-ink)', opacity: 0.65 }}>{TYPE_LABEL[resource.type]}</div>
          <Display size="xl" upper color="var(--accent-ink)">{resource.name}</Display>
          <p className="mt-4 font-medium" style={{ fontSize: '17px', opacity: 0.82, lineHeight: 1.5 }}>{resource.description}</p>
        </div>

        {/* Dark data card */}
        <DarkCard className="p-7 md:p-9">
          <div className="space-y-6">
            <DataBlock label="Ubicación">
              <p className="font-medium flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={16} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
                <span>{[resource.address, resource.city, resource.province].filter(Boolean).join(', ')}</span>
              </p>
            </DataBlock>

            {(resource.phone || resource.website || resource.email || resource.hours) && (
              <DataBlock label="Contacto">
                <ul className="space-y-2.5 mt-1">
                  {resource.phone && <li className="flex items-center gap-2.5 text-sm"><Phone size={15} style={{ color: 'var(--accent-primary)' }} /><a href={`tel:${resource.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{resource.phone}</a></li>}
                  {resource.hours && <li className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}><Clock size={15} style={{ color: 'var(--accent-primary)' }} />{resource.hours}</li>}
                  {resource.website && <li className="flex items-center gap-2.5 text-sm"><Globe size={15} style={{ color: 'var(--accent-primary)' }} /><a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 600 }} className="break-all">{resource.website.replace(/^https?:\/\//, '')}</a></li>}
                  {resource.email && <li className="flex items-center gap-2.5 text-sm"><Mail size={15} style={{ color: 'var(--accent-primary)' }} /><a href={`mailto:${resource.email}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }} className="break-all">{resource.email}</a></li>}
                </ul>
              </DataBlock>
            )}

            {resource.services.length > 0 && (
              <DataBlock label="Servicios">
                <ul className="mt-2 space-y-2.5">
                  {resource.services.map((s, i) => (
                    <li key={i} className="font-medium flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />{s}
                    </li>
                  ))}
                </ul>
              </DataBlock>
            )}

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              {resource.phone && (
                <a href={`tel:${resource.phone}`} className="flex-1"><CoralButton><Phone size={17} /> Llamar</CoralButton></a>
              )}
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="flex-1"><CoralButton><Navigation2 size={17} /> Cómo llegar</CoralButton></a>
            </div>
          </div>
        </DarkCard>
      </motion.div>
    </AnimatePresence>
  );
};

export const ResourcesDirectory: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<LocalResource | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);

  const filtered = useMemo(() => {
    let f = LOCAL_RESOURCES;
    if (selectedProvince !== 'all') f = f.filter(r => r.province === selectedProvince || r.province === 'Nacional');
    if (selectedType !== 'all') f = f.filter(r => r.type === selectedType);
    if (searchTerm) { const l = searchTerm.toLowerCase(); f = f.filter(r => r.name.toLowerCase().includes(l) || r.description.toLowerCase().includes(l) || r.services.some(s => s.toLowerCase().includes(l))); }
    return f;
  }, [selectedProvince, selectedType, searchTerm]);

  useEffect(() => {
    if (!selected || !filtered.some(r => r.name === selected.name)) {
      setSelected(filtered.length > 0 ? filtered[0] : null);
    }
  }, [filtered, selected]);

  const select = (r: LocalResource) => { setSelected(r); setMobileDetail(true); };

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Rail ── */}
      <div className={`w-full md:w-1/3 flex-col p-6 md:p-10 relative ${mobileDetail ? 'hidden md:flex' : 'flex'}`} style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-6">
          <Kicker>Recursos</Kicker>
          <span style={{ color: 'var(--accent-primary)' }}><MapPin size={22} /></span>
        </div>

        {/* Emergency quick lines */}
        <div className="flex gap-2 mb-5">
          {EMERGENCY.map(e => (
            <a key={e.number} href={`tel:${e.number}`} className="flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-colors" style={{ border: '1px solid var(--border-medium)' }}
              onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
              onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = 'var(--border-medium)'; }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--accent-primary)', lineHeight: 1 }}>{e.number}</span>
              <span className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{e.title}</span>
            </a>
          ))}
        </div>

        <div className="relative mb-3">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: 'var(--text-muted)' }}><Search size={16} /></span>
          <input
            type="text" placeholder="Buscar recurso o servicio…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...fieldStyle, paddingLeft: '42px' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
          />
        </div>
        <div className="flex gap-2 mb-4">
          <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} style={{ ...fieldStyle, padding: '9px 12px', flex: 1, minWidth: 0 }}>
            <option value="all">Provincia</option>
            {['Nacional', ...[...PROVINCES].sort()].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ ...fieldStyle, padding: '9px 12px', flex: 1, minWidth: 0 }}>
            {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.value === 'all' ? 'Tipo' : t.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pt-2" style={{ paddingBottom: '120px' }}>
          {filtered.length === 0 ? (
            <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>Sin resultados.</p>
          ) : (
            filtered.map(r => (
              <RailItem key={r.name} active={selected?.name === r.name} onClick={() => select(r)} layoutId="resource-pill" sub={[r.city, r.province].filter(Boolean).join(' · ')}>
                {r.name}
              </RailItem>
            ))
          )}
        </div>
      </div>

      {/* ── Detail (coral) ── */}
      <div className={`w-full md:w-2/3 ${mobileDetail ? 'flex' : 'hidden md:flex'}`}>
        {selected ? (
          <div className="w-full p-6 md:p-12 flex flex-col overflow-y-auto no-scrollbar rounded-t-[3rem] md:rounded-l-[4rem] md:rounded-tr-none" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', paddingBottom: '120px' }}>
            <Detail resource={selected} index={LOCAL_RESOURCES.findIndex(r => r.name === selected.name) + 1} onBack={() => setMobileDetail(false)} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10" style={{ color: 'var(--text-muted)' }}>
            <MapPin size={28} /><p className="mt-4">Elegí un recurso.</p>
          </div>
        )}
      </div>
    </div>
  );
};
