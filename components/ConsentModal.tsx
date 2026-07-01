import React, { useState } from 'react';
import type { ConsentData, ConsumptionType } from '../types';
import { PROVINCES, CONSUMPTION_TYPE_LABELS } from '../constants';
import { Display, Kicker, MonoLabel } from './ui';
import { ShieldCheck } from 'lucide-react';

interface ConsentModalProps {
  onConsent: (consentData: ConsentData, apiKey: string) => void;
}

const fieldStyle: React.CSSProperties = {
  background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-pill)', outline: 'none', width: '100%', padding: '11px 16px', fontSize: '14px',
  transition: 'border-color var(--transition-fast)',
};

export const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
  const [province, setProvince] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [consumptionType, setConsumptionType] = useState<ConsumptionType | undefined>(undefined);

  const handleAccept = () => {
    if (!apiKey.trim()) { alert('Por favor, ingresa tu API key de DeepInfra'); return; }
    onConsent({ share: true, province: province || '', consumptionType }, apiKey.trim());
  };
  const handleSkip = () => {
    if (!apiKey.trim()) { alert('Por favor, ingresa tu API key de DeepInfra'); return; }
    onConsent({ share: false, province: '', consumptionType }, apiKey.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} role="dialog" aria-modal="true">
      <div className="max-w-lg w-full my-8" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '2.5rem', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', animation: 'scaleIn 0.3s var(--ease-out-strong) both' }}>
        <div className="p-7 sm:p-9">
          {/* Masthead */}
          <div className="flex items-start justify-between mb-1">
            <Kicker>Reducción de daños</Kicker>
            <span className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-subtle)', color: 'var(--accent-primary)' }}><ShieldCheck size={20} /></span>
          </div>
          <Display size="md" upper className="mt-3">Antes de empezar</Display>
          <p className="mt-3" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '46ch' }}>
            Este chat brinda acompañamiento con enfoque de reducción de daños. No es un servicio de emergencia.
          </p>

          {/* API Key */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <MonoLabel>Configuración de IA</MonoLabel>
              <button onClick={() => setShowInfo(!showInfo)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>{showInfo ? 'Ocultar' : '¿Cómo?'}</button>
            </div>
            <p className="mb-4" style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--text-tertiary)' }}>
              Este chatbot usa <b style={{ color: 'var(--text-secondary)' }}>DeepInfra</b> para respuestas de IA. Necesitás una API key gratuita.
            </p>
            {showInfo && (
              <div className="mb-5 p-5" style={{ background: 'var(--bg-primary)', borderRadius: '1.25rem', border: '1px solid var(--border-subtle)', animation: 'fadeInUp 0.2s var(--ease-out-strong) both' }}>
                <MonoLabel>Cómo obtenerla</MonoLabel>
                <div className="mt-3 space-y-2.5">
                  {[
                    <>Andá a <a href="https://deepinfra.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>deepinfra.com</a></>,
                    <>Creá una cuenta gratuita (incluye $5 de crédito)</>,
                    <>Andá a tu dashboard y copiá tu API key</>,
                    <>Pegala aquí abajo</>,
                  ].map((step, i) => (
                    <div key={i} className="flex items-baseline gap-3">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>{`0${i + 1}`}</span>
                      <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{step}</span>
                    </div>
                  ))}
                  <p className="pt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tu API key se almacena solo en tu navegador, no en nuestros servidores.</p>
                </div>
              </div>
            )}
            <label className="block mb-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>API Key de DeepInfra <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
            <input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Ej: sk-xxxxxxxxxxxxxxxx" style={fieldStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')} />
          </div>

          {/* Privacy */}
          <div className="mt-7">
            <MonoLabel>Privacidad</MonoLabel>
            <p className="mt-3" style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-tertiary)' }}>
              Con tu consentimiento, registramos <b style={{ color: 'var(--text-secondary)' }}>solo</b> categoría de consulta y provincia para un mapa agregado. No guardamos datos personales.
            </p>
            <div className="mt-4">
              <label className="block mb-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Provincia (opcional)</label>
              <select id="province" name="province" value={province} onChange={(e) => setProvince(e.target.value)} style={{ ...fieldStyle, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}>
                <option value="">Prefiero no decir</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Consumo */}
          <div className="mt-7">
            <MonoLabel>Tu relación con el consumo</MonoLabel>
            <p className="mt-3 mb-2" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>¿Cómo la describirías? (opcional)</p>
            <div className="space-y-2">
              {Object.entries(CONSUMPTION_TYPE_LABELS).map(([value, { label, description, icon }]) => {
                const active = consumptionType === value;
                return (
                  <label key={value} className="flex items-start gap-3.5 p-3.5 cursor-pointer transition-colors" style={{ borderRadius: '1rem', border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, background: active ? 'var(--accent-subtle)' : 'transparent' }}>
                    <input type="radio" name="consumptionType" value={value} checked={active} onChange={(e) => setConsumptionType(e.target.value as ConsumptionType)} className="sr-only" />
                    <span className="flex items-center justify-center flex-shrink-0" style={{ width: '20px', height: '20px', borderRadius: '50%', marginTop: '1px', border: `2px solid ${active ? 'var(--accent-primary)' : 'var(--border-medium)'}`, background: active ? 'var(--accent-primary)' : 'transparent' }}>
                      {active && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-ink)' }} />}
                    </span>
                    <div className="min-w-0">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{icon} {label}</span>
                      <p className="mt-1" style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-muted)' }}>{description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={handleAccept} className="flex-1 transition-colors" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', border: 'none', borderRadius: '999px', padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-primary)')}>
              Acepto y continúo
            </button>
            <button onClick={handleSkip} className="flex-1 transition-colors" style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-medium)', borderRadius: '999px', padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              Usar sin compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
