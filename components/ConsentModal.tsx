import React, { useState } from 'react';
import type { ConsentData } from '../types';
import { PROVINCES } from '../constants';

interface ConsentModalProps {
  onConsent: (consentData: ConsentData, apiKey: string) => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
  const [province, setProvince] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleAccept = () => {
    if (!apiKey.trim()) {
      alert('Por favor, ingresa tu API key de DeepInfra');
      return;
    }
    onConsent({ share: true, province: province || '' }, apiKey.trim());
  };

  const handleSkip = () => {
    if (!apiKey.trim()) {
      alert('Por favor, ingresa tu API key de DeepInfra');
      return;
    }
    onConsent({ share: false, province: '' }, apiKey.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-[#15171a] border border-[#2a2d33] rounded-xl p-6 max-w-lg w-full shadow-2xl animate-fade-in my-8">
        <h2 className="text-xl font-bold text-gray-100">Antes de empezar</h2>
        <p className="text-sm text-gray-400 mt-2">
          Este chat brinda acompañamiento con enfoque de reducción de daños. No es un servicio de emergencia.
        </p>

        {/* DeepInfra API Key Section */}
        <div className="mt-5 p-4 bg-[#1a1c21] border border-[#2a2d33] rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Configuración de IA
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Este chatbot usa <b>DeepInfra</b> para respuestas de IA. Necesitas una API key gratuita.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] ml-2"
            >
              {showInfo ? 'Ocultar' : '¿Cómo?'}
            </button>
          </div>

          {showInfo && (
            <div className="mt-3 p-3 bg-[#0e0f12] rounded text-xs text-gray-300 space-y-2">
              <p><strong>1.</strong> Ve a <a href="https://deepinfra.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">deepinfra.com</a></p>
              <p><strong>2.</strong> Crea una cuenta gratuita (incluye $5 de crédito)</p>
              <p><strong>3.</strong> Ve a tu dashboard y copia tu API key</p>
              <p><strong>4.</strong> Pégala aquí abajo</p>
              <p className="text-gray-500 text-[11px] mt-2">
                Tu API key se almacena solo en tu navegador, no en nuestros servidores.
              </p>
            </div>
          )}

          <div className="mt-3">
            <label htmlFor="apiKey" className="block text-xs font-medium text-gray-300 mb-1">
              API Key de DeepInfra <span className="text-red-400">*</span>
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ej: sk-xxxxxxxxxxxxxxxx"
              className="block w-full px-3 py-2 text-sm bg-[#121316] border border-[#2a2d33] focus:outline-none focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] rounded-md text-white placeholder-gray-600"
            />
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mt-5">
          <p className="text-sm text-gray-400">
            Con tu consentimiento, registramos <b>solo</b> categoría de consulta y provincia para un mapa agregado. No guardamos datos personales.
          </p>
        </div>

        <div className="mt-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-300">
            Provincia (opcional)
          </label>
          <select
            id="province"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-[#121316] border border-[#2a2d33] focus:outline-none focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] sm:text-sm rounded-md text-white"
          >
            <option value="">Prefiero no decir</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
            style={{
              background: 'var(--accent-primary)',
              boxShadow: '0 2px 8px rgba(199, 112, 92, 0.25)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-primary)'}
          >
            Acepto y continúo
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors"
          >
            Usar sin compartir
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
