import React, { useState } from 'react';
import type { ConsentData, ConsumptionType } from '../types';
import { PROVINCES, CONSUMPTION_TYPE_LABELS } from '../constants';
import { Panel, Display, Kicker, SectionLabel, FieldLabel, fieldStyle, InlineNote, IndexNum, tint } from './ui';

interface ConsentModalProps {
  onConsent: (consentData: ConsentData, apiKey: string) => void;
}

const ShieldGlyph: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <g opacity="0.55">
      <circle cx="8.6" cy="8" r="2.4" />
      <path d="M3.9 18.6c0-2.7 2.1-4.7 4.7-4.7s4.7 2 4.7 4.7a.6.6 0 0 1-.6.6H4.5a.6.6 0 0 1-.6-.6Z" />
    </g>
    <g>
      <circle cx="15.2" cy="9" r="2.7" />
      <path d="M9.6 19.4c0-3 2.5-5.3 5.6-5.3s5.6 2.3 5.6 5.3a.7.7 0 0 1-.7.7H10.3a.7.7 0 0 1-.7-.7Z" />
    </g>
  </svg>
);

export const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
  const [province, setProvince] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [consumptionType, setConsumptionType] = useState<ConsumptionType | undefined>(undefined);

  const handleAccept = () => {
    if (!apiKey.trim()) {
      alert('Por favor, ingresa tu API key de DeepInfra');
      return;
    }
    onConsent({ share: true, province: province || '', consumptionType }, apiKey.trim());
  };

  const handleSkip = () => {
    if (!apiKey.trim()) {
      alert('Por favor, ingresa tu API key de DeepInfra');
      return;
    }
    onConsent({ share: false, province: '', consumptionType }, apiKey.trim());
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
    >
      <Panel
        cut="lg"
        tab={<ShieldGlyph />}
        className="max-w-lg w-full my-8"
        style={{ animation: 'scaleIn 0.3s var(--ease-out-strong) both', boxShadow: 'var(--shadow-modal), var(--shadow-glow-accent)' }}
      >
        <div className="p-6 sm:p-8 pr-8">

          {/* ── Masthead ── */}
          <Kicker className="mb-3">Consentimiento · Reducción de daños</Kicker>
          <Display size="md" upper>Antes de empezar</Display>
          <p className="mt-3" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '46ch' }}>
            Este chat brinda acompañamiento con enfoque de reducción de daños. No es un servicio de emergencia.
          </p>

          {/* ── DeepInfra API Key ── */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel accent="var(--accent-primary)" rule={false}>Configuración de IA</SectionLabel>
              <button
                onClick={() => setShowInfo(!showInfo)}
                style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
              >
                {showInfo ? 'Ocultar' : '¿Cómo?'}
              </button>
            </div>

            <p className="mb-4" style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--text-tertiary)' }}>
              Este chatbot usa <b style={{ color: 'var(--text-secondary)' }}>DeepInfra</b> para respuestas de IA. Necesitás una API key gratuita.
            </p>

            {showInfo && (
              <div className="mb-5" style={{ animation: 'fadeInUp 0.2s var(--ease-out-strong) both' }}>
                <InlineNote label="Cómo obtenerla" accent="var(--accent-primary)">
                  <div className="space-y-2.5">
                    {[
                      <>Ve a <a href="https://deepinfra.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>deepinfra.com</a></>,
                      <>Creá una cuenta gratuita (incluye $5 de crédito)</>,
                      <>Andá a tu dashboard y copiá tu API key</>,
                      <>Pegala aquí abajo</>,
                    ].map((step, i) => (
                      <div key={i} className="flex items-baseline gap-3">
                        <IndexNum size={15} color="var(--accent-weak)">{`0${i + 1}`}</IndexNum>
                        <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{step}</span>
                      </div>
                    ))}
                    <p className="pt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Tu API key se almacena solo en tu navegador, no en nuestros servidores.
                    </p>
                  </div>
                </InlineNote>
              </div>
            )}

            <div>
              <FieldLabel>
                API Key de DeepInfra <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </FieldLabel>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ej: sk-xxxxxxxxxxxxxxxx"
                style={fieldStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
              />
            </div>
          </div>

          {/* ── Privacidad ── */}
          <div className="mt-7">
            <SectionLabel accent="var(--accent-primary)">Privacidad</SectionLabel>
            <p className="mt-4" style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-tertiary)' }}>
              Con tu consentimiento, registramos <b style={{ color: 'var(--text-secondary)' }}>solo</b> categoría de consulta y provincia para un mapa agregado. No guardamos datos personales.
            </p>

            <div className="mt-5">
              <FieldLabel>Provincia (opcional)</FieldLabel>
              <select
                id="province"
                name="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                style={{ ...fieldStyle, paddingRight: '40px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
              >
                <option value="">Prefiero no decir</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* ── Consumo ── */}
          <div className="mt-7">
            <SectionLabel accent="var(--accent-primary)">Tu relación con el consumo</SectionLabel>
            <p className="mt-4 mb-3" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              ¿Cómo la describirías? (opcional)
            </p>
            <div>
              {Object.entries(CONSUMPTION_TYPE_LABELS).map(([value, { label, description, icon }], idx) => {
                const active = consumptionType === value;
                return (
                  <label
                    key={value}
                    className="flex items-start gap-4 py-3.5 cursor-pointer"
                    style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)' }}
                  >
                    <input
                      type="radio"
                      name="consumptionType"
                      value={value}
                      checked={active}
                      onChange={(e) => setConsumptionType(e.target.value as ConsumptionType)}
                      className="sr-only"
                    />
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '20px', height: '20px', borderRadius: '50%', marginTop: '2px',
                        border: `2px solid ${active ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                        background: active ? 'var(--accent-primary)' : 'transparent',
                        transition: 'border-color var(--transition-fast), background var(--transition-fast)',
                      }}
                    >
                      {active && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-ink)' }} />}
                    </span>
                    <div className="min-w-0">
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {icon} {label}
                      </span>
                      <p className="mt-1" style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                        {description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="flex-1"
              style={{
                background: 'var(--accent-primary)', color: 'var(--accent-ink)',
                border: 'none', borderRadius: 'var(--radius-pill)', padding: '12px 20px',
                fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-primary)')}
            >
              Acepto y continúo
            </button>
            <button
              onClick={handleSkip}
              className="flex-1"
              style={{
                background: 'transparent', color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-pill)', padding: '12px 20px',
                fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = tint('var(--accent-primary)', 'subtle'); }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Usar sin compartir
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
};
