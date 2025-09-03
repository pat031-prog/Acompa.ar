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
      <div className="bg-[#15171a] border border-[#2a2d33] rounded-xl p-6 max-w-lg w-full shadow-2xl animate-fade-in">
        <h2 className="text-xl font-bold text-gray-100">Antes de empezar</h2>
        <p className="text-sm text-gray-400 mt-2">
          Este chat brinda acompañamiento con enfoque de reducción de daños. No es un servicio de emergencia.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Con tu consentimiento, registramos <b>solo</b> categoría de consulta y provincia para un mapa agregado. No guardamos datos personales.
        </p>
        
        <div className="mt-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-300">
            Provincia (opcional)
          </label>
          <select
            id="province"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-[#121316] border border-[#2a2d33] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-white"
          >
            <option value="">Prefiero no decir</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
          >
            Acepto y continúo
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors"
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
