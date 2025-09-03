
export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: Source[];
}

export interface ConsentData {
  share: boolean;
  province: string;
}

// Type for simplified chat history passed to Gemini
export interface HistoryPart {
    text: string;
}
export interface HistoryContent {
    role: 'user' | 'model';
    parts: HistoryPart[];
}

export type SubstanceCategory = 'Estimulante' | 'Depresor' | 'Psicodélico' | 'Disociativo' | 'Empatógeno' | 'Otro';

export interface LibraryEntry {
  title: string;
  aliases: string[];
  category: SubstanceCategory[];
  structureImage?: string;
  chemicalFormula: string;
  content: {
    description: string;
    effects: {
      positive: string[];
      negative: string[];
    };
    duration: {
      total: string;
      onset: string;
      peak: string;
    };
    dosage: {
      oral?: string;
      nasal?: string;
      inhalation?: string;
      warning: string;
    };
    risks: string[];
    guidelines: string[];
    alerts: string;
  };
}


// Fix: Add MapDataset type for map component data
export interface MapDataset {
  totalQueries: number;
  topCategories: {
    category: string;
    percentage: number;
  }[];
}

export type Tab = 'chat' | 'library' | 'observatory';