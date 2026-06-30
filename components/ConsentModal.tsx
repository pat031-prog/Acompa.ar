import React, { useState } from 'react';
import type { ConsentData, ConsumptionType } from '../types';
import { PROVINCES, CONSUMPTION_TYPE_LABELS } from '../constants';

interface ConsentModalProps {
  onConsent: (consentData: ConsentData, apiKey: string) => void;
}

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
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-w-lg w-full my-8"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-modal), var(--shadow-glow-accent)',
          animation: 'scaleIn 0.3s var(--ease-out-strong) both',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-11 h-11 flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(150deg, var(--accent-hover), var(--accent-primary))', borderRadius: '12px', boxShadow: 'var(--shadow-glow-accent), inset 0 1px 0 rgba(255,255,255,0.18)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <g opacity="0.55">
                <circle cx="8.6" cy="8" r="2.4" />
                <path d="M3.9 18.6c0-2.7 2.1-4.7 4.7-4.7s4.7 2 4.7 4.7a.6.6 0 0 1-.6.6H4.5a.6.6 0 0 1-.6-.6Z" />
              </g>
              <g>
                <circle cx="15.2" cy="9" r="2.7" />
                <path d="M9.6 19.4c0-3 2.5-5.3 5.6-5.3s5.6 2.3 5.6 5.3a.7.7 0 0 1-.7.7H10.3a.7.7 0 0 1-.7-.7Z" />
              </g>
            </svg>
          </div>
          <div>
            <h2 className="editorial-heading text-xl sm:text-2xl">
              Antes de empezar
            </h2>
          </div>
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Este chat brinda acompañamiento con enfoque de reducción de daños. No es un servicio de emergencia.
        </p>

        {/* DeepInfra API Key Section */}
        <div
          className="mt-5 p-4"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-amber)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Configuración de IA
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Este chatbot usa <b style={{ color: 'var(--text-secondary)' }}>DeepInfra</b> para respuestas de IA. Necesitas una API key gratuita.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-xs font-medium ml-2"
              style={{ color: 'var(--accent-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            >
              {showInfo ? 'Ocultar' : '¿Cómo?'}
            </button>
          </div>

          {showInfo && (
            <div
              className="mt-3 p-3 text-xs space-y-2"
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                animation: 'fadeInUp 0.2s var(--ease-out-strong) both',
              }}
            >
              <p><strong style={{ color: 'var(--text-primary)' }}>1.</strong> Ve a <a href="https://deepinfra.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>deepinfra.com</a></p>
              <p><strong style={{ color: 'var(--text-primary)' }}>2.</strong> Crea una cuenta gratuita (incluye $5 de crédito)</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>3.</strong> Ve a tu dashboard y copia tu API key</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>4.</strong> Pégala aquí abajo</p>
              <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                Tu API key se almacena solo en tu navegador, no en nuestros servidores.
              </p>
            </div>
          )}

          <div className="mt-3">
            <label htmlFor="apiKey" className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              API Key de DeepInfra <span style={{ color: 'var(--color-red)' }}>*</span>
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ej: sk-xxxxxxxxxxxxxxxx"
              className="block w-full px-3 py-2.5 text-sm"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            />
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mt-5">
          <p className="text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.6' }}>
            Con tu consentimiento, registramos <b style={{ color: 'var(--text-secondary)' }}>solo</b> categoría de consulta y provincia para un mapa agregado. No guardamos datos personales.
          </p>
        </div>

        <div className="mt-4">
          <label htmlFor="province" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Provincia (opcional)
          </label>
          <select
            id="province"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          >
            <option value="">Prefiero no decir</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Consumption type question */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            ¿Cómo describirías tu relación con el consumo? (opcional)
          </label>
          <div className="space-y-2">
            {Object.entries(CONSUMPTION_TYPE_LABELS).map(([value, { label, description, icon }]) => (
              <label
                key={value}
                className="flex items-start gap-3 p-2.5 cursor-pointer"
                style={{
                  background: consumptionType === value ? 'var(--surface-2)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (consumptionType !== value) {
                    e.currentTarget.style.background = 'var(--surface-1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (consumptionType !== value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <input
                  type="radio"
                  name="consumptionType"
                  value={value}
                  checked={consumptionType === value}
                  onChange={(e) => setConsumptionType(e.target.value as ConsumptionType)}
                  className="w-4 h-4 mt-0.5"
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {icon} {label}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(199, 112, 92, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 112, 92, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(199, 112, 92, 0.25)';
            }}
          >
            Acepto y continúo
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-3)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Usar sin compartir
          </button>
        </div>
      </div>
    </div>
  );
};
