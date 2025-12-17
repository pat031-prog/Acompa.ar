import React, { useState } from 'react';
import type { ConsentData } from '../types';
import { PROVINCES } from '../constants';

interface ConsentModalProps {
  onConsent: (consentData: ConsentData) => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
  const [province, setProvince] = useState<string>('');

  const handleAccept = () => {
    onConsent({ share: true, province: province || '' });
  };

  const handleSkip = () => {
    onConsent({ share: false, province: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div
        className="border rounded-[var(--radius-lg)] p-6 max-w-lg w-full"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-2)',
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Antes de empezar</h2>
        <p className="editorial text-sm mt-2" style={{ color: 'var(--muted)' }}>
          Este chat brinda acompañamiento con enfoque de reducción de daños. No es un servicio de emergencia.
        </p>
        <p className="editorial text-sm mt-4" style={{ color: 'var(--muted)' }}>
          Con tu consentimiento, registramos <b style={{ color: 'var(--text)' }}>solo</b> categoría de consulta y provincia para un mapa agregado. No guardamos datos personales.
        </p>
        
        <div className="mt-4">
          <label htmlFor="province" className="block text-sm font-medium" style={{ color: 'var(--muted)' }}>
            Provincia (opcional)
          </label>
          <select
            id="province"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none sm:text-sm rounded-[var(--radius-sm)]"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              transition: `all var(--t-med) var(--ease)`
            }}
          >
            <option value="">Prefiero no decir</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-[var(--radius-md)] active:scale-95"
            style={{
              background: 'var(--accent)',
              transition: `all var(--t-fast) var(--ease)`
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Acepto y continúo
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] active:scale-95"
            style={{
              background: 'var(--surface-3)',
              color: 'var(--muted)',
              transition: `all var(--t-fast) var(--ease)`
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Usar sin compartir
          </button>
        </div>
      </div>
    </div>
  );
};
