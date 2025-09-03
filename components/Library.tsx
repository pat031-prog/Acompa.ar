
import React, { useState, useMemo, useEffect } from 'react';
import { LIBRARY_DATA, SUBSTANCE_CATEGORIES } from '../constants';
import type { LibraryEntry, SubstanceCategory } from '../types';

// --- Icon Components ---
const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
);
const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ScaleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c-1.472 0-2.882.265-4.185.75M12 4.5c1.472 0 2.882.265 4.185.75M5.25 4.97A48.416 48.416 0 0 1 12 4.5c2.291 0 4.545.16 6.75.47m13.5 0c1.472 0 2.882.265 4.185.75M12 4.5c-1.472 0-2.882.265-4.185.75M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 0A48.11 48.11 0 0 1 12 10.5c2.291 0 4.545.16 6.75.47m-13.5 0a48.11 48.11 0 0 0 13.5 0Z" /></svg>
);
const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);
const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);
const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const AlertIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
);
// --- End Icon Components ---


const InfoSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
  <div className="mt-5">
    <h3 className="flex items-center gap-2 font-semibold text-gray-200">
      {icon}
      {title}
    </h3>
    <div className="mt-2 pl-7 text-sm text-gray-300/90 leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);


const LibraryDetailView: React.FC<{ item: LibraryEntry }> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error state when the selected substance changes
  useEffect(() => {
    setImageError(false);
  }, [item.title]);
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-100">{item.title}</h2>
      <p className="text-sm text-gray-400 mt-1">
        También conocido como: {item.aliases.join(', ')}.
      </p>

      {item.structureImage && !imageError ? (
        <div className="my-4 p-3 bg-white/5 rounded-lg flex justify-center items-center border border-gray-800 min-h-[148px]">
          <img 
            src={item.structureImage} 
            alt={`Estructura química de ${item.title}`} 
            className="max-h-32 p-1 rounded bg-white"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
         <div className="my-4 p-3 bg-[#0e0f11]/50 rounded-lg flex justify-center items-center border border-gray-800 min-h-[148px]">
            <p className="font-mono text-xl text-gray-400 tracking-wider select-all">{item.chemicalFormula}</p>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-300">{item.content.description}</p>
      
      <InfoSection title="Efectos" icon={<HeartIcon />}>
        <div>
          <strong className="font-semibold text-green-400">Positivos:</strong>
          <ul className="list-disc pl-5 mt-1">
            {item.content.effects.positive.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>
        <div className="mt-3">
          <strong className="font-semibold text-yellow-400">Negativos:</strong>
          <ul className="list-disc pl-5 mt-1">
            {item.content.effects.negative.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>
      </InfoSection>

      <InfoSection title="Duración" icon={<ClockIcon />}>
          <p><strong>Inicio:</strong> {item.content.duration.onset}</p>
          <p><strong>Pico/Meseta:</strong> {item.content.duration.peak}</p>
          <p><strong>Total:</strong> {item.content.duration.total}</p>
      </InfoSection>

      <InfoSection title="Dosificación" icon={<ScaleIcon />}>
          {item.content.dosage.oral && <p><strong>Oral:</strong> {item.content.dosage.oral}</p>}
          {item.content.dosage.nasal && <p><strong>Nasal:</strong> {item.content.dosage.nasal}</p>}
          {item.content.dosage.inhalation && <p><strong>Inhalado:</strong> {item.content.dosage.inhalation}</p>}
          <p className="mt-2 text-xs text-amber-300/80 bg-amber-900/30 p-2 rounded-md border border-amber-500/30">
            <strong className="font-semibold">Importante:</strong> {item.content.dosage.warning}
          </p>
      </InfoSection>

      <InfoSection title="Principales Riesgos" icon={<WarningIcon />}>
        <ul className="list-disc pl-5">
            {item.content.risks.map(r => <li key={r}>{r}</li>)}
        </ul>
      </InfoSection>
      
      <InfoSection title="Pautas de Cuidado" icon={<CheckIcon />}>
        <ul className="space-y-2.5">
          {item.content.guidelines.map((line, index) => (
             <li key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-300">$1</strong>') }} />
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Alertas del Mercado" icon={<AlertIcon />}>
          <p>{item.content.alerts}</p>
      </InfoSection>
    </div>
  );
};


export const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<LibraryEntry | null>(null);

  const filteredLibraryData = useMemo(() => {
    let data = LIBRARY_DATA;

    if (selectedCategory !== 'All') {
      data = data.filter(item => item.category.includes(selectedCategory));
    }

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      data = data.filter(item => {
        const contentString = `${item.title} ${item.aliases.join(' ')}`;
        return contentString.toLowerCase().includes(lowercasedFilter);
      });
    }
    return data;
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
      // If the selected item is no longer in the filtered list, update it.
      if (!selectedItem || !filteredLibraryData.some(item => item.title === selectedItem.title)) {
          setSelectedItem(filteredLibraryData.length > 0 ? filteredLibraryData[0] : null);
      }
  }, [filteredLibraryData, selectedItem]);


  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Pane: Navigation */}
        <div className="w-full md:w-1/3 md:max-w-sm flex flex-col border-b md:border-b-0 md:border-r border-gray-800">
            <div className="p-3 border-b border-gray-800">
                 <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar sustancia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2.5 pl-10 text-sm bg-[#121316] text-white border border-[#2a2d33] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    <button 
                        onClick={() => setSelectedCategory('All')}
                        className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedCategory === 'All' ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-700/60 hover:bg-gray-600/80 text-gray-300'}`}
                    >
                        Todas
                    </button>
                    {SUBSTANCE_CATEGORIES.map(category => (
                         <button 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedCategory === category ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-700/60 hover:bg-gray-600/80 text-gray-300'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <nav className="overflow-y-auto p-3 h-48 md:h-auto md:flex-1">
                <ul className="space-y-1">
                    {filteredLibraryData.map(item => (
                        <li key={item.title}>
                            <button
                                onClick={() => setSelectedItem(item)}
                                className={`w-full text-left text-sm p-2.5 rounded-md transition-colors duration-150 ${
                                    selectedItem?.title === item.title
                                        ? 'bg-blue-600/40 text-gray-100 font-semibold'
                                        : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                {item.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>

        {/* Right Pane: Detail View */}
        <div className="flex-1 overflow-y-auto">
            {selectedItem ? (
                <LibraryDetailView item={selectedItem} />
            ) : (
                <div className="text-center p-10">
                    <p className="text-gray-400">No se encontraron resultados.</p>
                </div>
            )}
        </div>
    </div>
  );
};