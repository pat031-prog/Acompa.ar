/**
 * PsychonautWiki API Service
 * Fetches additional substance information from PsychonautWiki
 * GraphQL API: https://api.psychonautwiki.org/
 */

const PSYCHONAUTWIKI_API_URL = 'https://api.psychonautwiki.org/';

export interface PsychonautSubstance {
  name: string;
  summary?: string;
  url?: string;
  addictionPotential?: string;
  toxicity?: string[];
  crossTolerances?: string[];
  roas?: {
    name: string;
    dose?: {
      units: string;
      threshold?: number;
      light?: { min?: number; max?: number };
      common?: { min?: number; max?: number };
      strong?: { min?: number; max?: number };
      heavy?: number;
    };
    duration?: {
      onset?: { min?: number; max?: number; units: string };
      comeup?: { min?: number; max?: number; units: string };
      peak?: { min?: number; max?: number; units: string };
      offset?: { min?: number; max?: number; units: string };
      total?: { min?: number; max?: number; units: string };
      afterglow?: { min?: number; max?: number; units: string };
    };
  }[];
}

/**
 * Fetch substance data from PsychonautWiki API
 */
export const fetchPsychonautData = async (
  substanceName: string
): Promise<PsychonautSubstance | null> => {
  const query = `
    query GetSubstance($name: String!) {
      substances(query: $name) {
        name
        summary
        url
        addictionPotential
        toxicity
        crossTolerances
        roas {
          name
          dose {
            units
            threshold
            light { min max }
            common { min max }
            strong { min max }
            heavy
          }
          duration {
            onset { min max units }
            comeup { min max units }
            peak { min max units }
            offset { min max units }
            total { min max units }
            afterglow { min max units }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(PSYCHONAUTWIKI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { name: substanceName },
      }),
    });

    if (!response.ok) {
      console.error('PsychonautWiki API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.errors) {
      console.error('PsychonautWiki GraphQL errors:', data.errors);
      return null;
    }

    const substances = data.data?.substances;
    if (!substances || substances.length === 0) {
      console.log(`No PsychonautWiki data found for: ${substanceName}`);
      return null;
    }

    // Return the first match (usually the most relevant)
    return substances[0] as PsychonautSubstance;
  } catch (error) {
    console.error('Error fetching from PsychonautWiki:', error);
    return null;
  }
};

/**
 * Format dose information from PsychonautWiki into a readable string
 */
export const formatDoseInfo = (roa: PsychonautSubstance['roas'][0]): string => {
  if (!roa.dose) return 'No disponible';

  const { dose } = roa;
  const units = dose.units;

  const parts: string[] = [];

  if (dose.threshold !== undefined) {
    parts.push(`Umbral: ${dose.threshold}${units}`);
  }
  if (dose.light) {
    const range = dose.light.min !== undefined && dose.light.max !== undefined
      ? `${dose.light.min}-${dose.light.max}${units}`
      : 'N/A';
    parts.push(`Ligera: ${range}`);
  }
  if (dose.common) {
    const range = dose.common.min !== undefined && dose.common.max !== undefined
      ? `${dose.common.min}-${dose.common.max}${units}`
      : 'N/A';
    parts.push(`Común: ${range}`);
  }
  if (dose.strong) {
    const range = dose.strong.min !== undefined && dose.strong.max !== undefined
      ? `${dose.strong.min}-${dose.strong.max}${units}`
      : 'N/A';
    parts.push(`Fuerte: ${range}`);
  }
  if (dose.heavy !== undefined) {
    parts.push(`Pesada: ${dose.heavy}+${units}`);
  }

  return parts.join(' | ');
};

/**
 * Format duration information from PsychonautWiki into a readable string
 */
export const formatDurationInfo = (roa: PsychonautSubstance['roas'][0]): string => {
  if (!roa.duration) return 'No disponible';

  const { duration } = roa;
  const parts: string[] = [];

  const formatRange = (range: { min?: number; max?: number; units: string } | undefined): string => {
    if (!range) return 'N/A';
    if (range.min !== undefined && range.max !== undefined) {
      return `${range.min}-${range.max} ${range.units}`;
    }
    return 'N/A';
  };

  if (duration.onset) {
    parts.push(`Inicio: ${formatRange(duration.onset)}`);
  }
  if (duration.peak) {
    parts.push(`Pico: ${formatRange(duration.peak)}`);
  }
  if (duration.total) {
    parts.push(`Total: ${formatRange(duration.total)}`);
  }

  return parts.join(' | ');
};

/**
 * Get substance aliases for better API matching
 * Maps local substance names to PsychonautWiki names
 */
export const getSubstanceAlias = (localName: string): string => {
  const aliasMap: Record<string, string> = {
    'MDMA': 'MDMA',
    'Cannabis': 'Cannabis',
    'LSD': 'LSD',
    'Cocaína': 'Cocaine',
    'Anfetamina': 'Amphetamine',
    'Ketamina': 'Ketamine',
    '2C-B': '2C-B',
    'Psilocibina': 'Psilocybin',
    'DMT': 'DMT',
    'GHB': 'GHB',
    'Alcohol': 'Alcohol',
    'Benzodiacepinas': 'Benzodiazepines',
    'Pregabalina': 'Pregabalin',
  };

  return aliasMap[localName] || localName;
};
