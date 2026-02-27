/**
 * Analytics Service
 * Manages statistics and analytics data using localStorage
 * Tracks substance queries, categories, and trends
 */

import type { SubstanceCategory } from '../types';

export interface QueryRecord {
  id: string;
  substance: string;
  category: SubstanceCategory;
  province: string;
  timestamp: number;
}

export interface AnalyticsStats {
  totalQueries: number;
  queriesByCategory: Record<SubstanceCategory, number>;
  queriesByProvince: Record<string, number>;
  recentQueries: QueryRecord[];
  topSubstances: { name: string; count: number }[];
}

export interface TerritorialAlert {
  id: string;
  province: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  source?: string;
  alertNumber?: string;
  year?: number;
  substances?: string[];
  pdfUrl?: string;
}

const QUERIES_KEY = 'acompanar_queries';
const ALERTS_KEY = 'acompanar_alerts';

// Track a substance query
export const trackQuery = (
  substance: string,
  category: SubstanceCategory,
  province: string
): void => {
  try {
    const queries = getQueryHistory();
    const newQuery: QueryRecord = {
      id: `query-${Date.now()}-${Math.random()}`,
      substance,
      category,
      province,
      timestamp: Date.now(),
    };

    // Keep last 1000 queries max
    const updated = [newQuery, ...queries].slice(0, 1000);
    localStorage.setItem(QUERIES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error tracking query:', error);
  }
};

// Get query history
export const getQueryHistory = (): QueryRecord[] => {
  try {
    const stored = localStorage.getItem(QUERIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading query history:', error);
    return [];
  }
};

// Get analytics statistics
export const getAnalyticsStats = (
  startDate?: Date,
  endDate?: Date,
  province?: string,
  category?: SubstanceCategory
): AnalyticsStats => {
  let queries = getQueryHistory();

  // Apply filters
  if (startDate) {
    queries = queries.filter(q => q.timestamp >= startDate.getTime());
  }
  if (endDate) {
    queries = queries.filter(q => q.timestamp <= endDate.getTime());
  }
  if (province && province !== 'all') {
    queries = queries.filter(q => q.province === province);
  }
  if (category && category !== 'all') {
    queries = queries.filter(q => q.category === category);
  }

  // Calculate stats
  const queriesByCategory: Record<string, number> = {};
  const queriesByProvince: Record<string, number> = {};
  const substanceCounts: Record<string, number> = {};

  queries.forEach(query => {
    // By category
    queriesByCategory[query.category] = (queriesByCategory[query.category] || 0) + 1;

    // By province
    queriesByProvince[query.province] = (queriesByProvince[query.province] || 0) + 1;

    // By substance
    substanceCounts[query.substance] = (substanceCounts[query.substance] || 0) + 1;
  });

  // Top substances
  const topSubstances = Object.entries(substanceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalQueries: queries.length,
    queriesByCategory: queriesByCategory as Record<SubstanceCategory, number>,
    queriesByProvince,
    recentQueries: queries.slice(0, 20),
    topSubstances,
  };
};

// Get queries grouped by date (for trend analysis)
export const getQueriesByDate = (days: number = 30): Record<string, number> => {
  const queries = getQueryHistory();
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const queriesByDate: Record<string, number> = {};

  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    queriesByDate[dateStr] = 0;
  }

  // Count queries per date
  queries.forEach(query => {
    const date = new Date(query.timestamp);
    if (date >= startDate) {
      const dateStr = date.toISOString().split('T')[0];
      if (queriesByDate[dateStr] !== undefined) {
        queriesByDate[dateStr]++;
      }
    }
  });

  return queriesByDate;
};

// Territorial Alerts Management
export const getAlerts = (province?: string): TerritorialAlert[] => {
  try {
    const stored = localStorage.getItem(ALERTS_KEY);
    let alerts: TerritorialAlert[] = stored ? JSON.parse(stored) : getDefaultAlerts();

    // Filter by province if specified
    if (province && province !== 'all') {
      alerts = alerts.filter(a => a.province === province || a.province === 'Nacional');
    }

    // Sort by severity and timestamp
    return alerts.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.timestamp - a.timestamp;
    });
  } catch (error) {
    console.error('Error reading alerts:', error);
    return [];
  }
};

export const addAlert = (alert: Omit<TerritorialAlert, 'id' | 'timestamp'>): void => {
  try {
    const alerts = getAlerts();
    const newAlert: TerritorialAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    const updated = [newAlert, ...alerts];
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding alert:', error);
  }
};

export const deleteAlert = (id: string): void => {
  try {
    const alerts = getAlerts();
    const updated = alerts.filter(a => a.id !== id);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting alert:', error);
  }
};

/**
 * Alertas SAT reales del Sistema de Alerta Temprana
 * Fuente: https://www.argentina.gob.ar/sat/alertas
 * Datos de alertas oficiales emitidas por SEDRONAR / Ministerio de Salud
 */
const getDefaultAlerts = (): TerritorialAlert[] => {
  return [
    // ═══ ALERTAS 2025 ═══
    {
      id: 'sat-2025-4',
      province: 'Ciudad Autónoma de Buenos Aires',
      title: 'SAT N°4/2025 — 25E-NBOH en troqueles multicolor',
      message: 'El Laboratorio de Toxicología y Química Forense del Cuerpo de Investigaciones Judiciales (MPF-CABA) analizó 23 troqueles multicolor cuyo contenido se correspondió con 25E-NBOH, una fenetilamina psicodélica potente. La sustancia no se comercializa en el mercado legal y presenta riesgo de sobredosis por dosificación imprecisa.',
      severity: 'high',
      timestamp: new Date('2025-06-15').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°4/2025',
      year: 2025,
      substances: ['25E-NBOH'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2023/07/alerta-4-25e-nboh.pdf',
    },
    {
      id: 'sat-2025-3',
      province: 'Córdoba',
      title: 'SAT N°3/2025 — Xilacina + Pregabalina + Carisoprodol + 25I-NBOH + Cocaína',
      message: 'El Laboratorio del MPF de Córdoba detectó un troquel tricolor con una combinación extremadamente peligrosa: xilacina ("tranq"), pregabalina, carisoprodol, 25I-NBOH y cocaína. La xilacina es un sedante veterinario que deprime el sistema nervioso central, puede causar necrosis tisular y no responde a naloxona. Riesgo de muerte por depresión respiratoria.',
      severity: 'high',
      timestamp: new Date('2025-03-20').getTime(),
      source: 'SAT — MPF Córdoba / Ministerio de Salud',
      alertNumber: 'SAT N°3/2025',
      year: 2025,
      substances: ['Xilacina', 'Pregabalina', 'Carisoprodol', '25I-NBOH', 'Cocaína'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2023/07/informe-alerta-sat-n-3-2025.pdf',
    },
    {
      id: 'sat-2025-2',
      province: 'Nacional',
      title: 'SAT N°2/2025 — (4-bromo-2,5-dimetoxifenil)etilamina (2C-B)',
      message: 'Se detectó la presencia de (4-bromo-2,5-dimetoxifenil)etilamina, una fenetilamina psicodélica sintética del grupo 2C. Presenta riesgo elevado en dosis altas, con efectos estimulantes y alucinógenos impredecibles. No existe antídoto específico.',
      severity: 'medium',
      timestamp: new Date('2025-02-10').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°2/2025',
      year: 2025,
      substances: ['2C-B', '(4-bromo-2,5-dimetoxifenil)etilamina'],
    },
    {
      id: 'sat-2025-1',
      province: 'Nacional',
      title: 'SAT N°1/2025 — Hexahidrocannabinol (HHC)',
      message: 'Alerta por la detección y comercialización de Hexahidrocannabinol (HHC), un cannabinoide semisintético. Se comercializa en vaporizadores y comestibles sin regulación. Los efectos son similares al THC pero con potencia variable e impredecible. Riesgo de contaminantes en procesos de síntesis no controlados.',
      severity: 'medium',
      timestamp: new Date('2025-01-15').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°1/2025',
      year: 2025,
      substances: ['HHC', 'Hexahidrocannabinol'],
    },

    // ═══ ALERTAS 2024 ═══
    {
      id: 'sat-2024-7',
      province: 'Nacional',
      title: 'SAT N°7/2024 — 5-MeO-MiPT en combinación con Xilacina',
      message: 'Se detectó la combinación de 5-MeO-MiPT (triptamina psicodélica potente) con xilacina en muestras analizadas. La xilacina se usa en el mercado ilegal para extender los efectos de otras sustancias. Esta combinación presenta riesgo extremo de depresión respiratoria y cardiovascular.',
      severity: 'high',
      timestamp: new Date('2024-11-20').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°7/2024',
      year: 2024,
      substances: ['5-MeO-MiPT', 'Xilacina'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/alerta_sat_n_7_2024_5-meo-mipt_en_combinacion_con_xilacina_con_autoridades.pdf',
    },
    {
      id: 'sat-2024-6',
      province: 'Nacional',
      title: 'SAT N°6/2024 — 2-(4-bromo-2,5-dimetoxifenil)etilamina',
      message: 'Nueva detección de fenetilamina del grupo 2C en muestras analizadas a nivel nacional. Sustancia con potencial alucinógeno significativo y margen de seguridad estrecho entre dosis activa y dosis tóxica.',
      severity: 'medium',
      timestamp: new Date('2024-10-05').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°6/2024',
      year: 2024,
      substances: ['2C-B'],
    },
    {
      id: 'sat-2024-5',
      province: 'Nacional',
      title: 'SAT N°5/2024 — 25I-NBOH',
      message: 'Se identificó 25I-NBOH, una sustancia alucinógena de tipo fenetilamina del grupo NBOx, sin uso medicinal reconocido. Altamente potente en microgramos. Riesgo de vasoconstricción severa, convulsiones y muerte por sobredosis.',
      severity: 'high',
      timestamp: new Date('2024-09-12').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°5/2024',
      year: 2024,
      substances: ['25I-NBOH'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2023/07/alerta_-25i-nboh-sat-n-5-24-con-autoridades.pdf',
    },
    {
      id: 'sat-2024-4',
      province: 'Nacional',
      title: 'SAT N°4/2024 — Tetrahidrocannabinol (THC sintético)',
      message: 'Alerta sobre la detección de THC sintético en productos que se comercializan como cannabis natural. Los cannabinoides sintéticos presentan una potencia impredecible y mayor riesgo de efectos adversos graves, incluyendo psicosis, convulsiones y daño cardiovascular.',
      severity: 'medium',
      timestamp: new Date('2024-07-18').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°4/2024',
      year: 2024,
      substances: ['THC sintético', 'Tetrahidrocannabinol'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2023/07/alerta_tetrahidrocannabinol-sat_4_2024.pdf',
    },
    {
      id: 'sat-2024-3',
      province: 'Nacional',
      title: 'SAT N°3/2024 — Dimetiltriptamina (DMT)',
      message: 'Se registra un aumento en la detección de DMT en diversas presentaciones. Si bien el DMT tiene una larga historia de uso tradicional, las preparaciones no reguladas pueden contener adulterantes peligrosos y dosis inconsistentes.',
      severity: 'low',
      timestamp: new Date('2024-06-01').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°3/2024',
      year: 2024,
      substances: ['DMT', 'Dimetiltriptamina'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2023/07/alerta_dimetiltriptamina-sat_3_2024.pdf',
    },
    {
      id: 'sat-2024-2',
      province: 'Nacional',
      title: 'SAT N°2/2024 — N,N-Dimetilpentilona (catinona sintética)',
      message: 'Se detectó N,N-Dimetilpentilona, una catinona sintética estimulante. Puede encontrarse como adulterante en pastillas vendidas como MDMA/éxtasis. Efectos estimulantes prolongados con mayor riesgo de hipertermia, taquicardia y toxicidad serotoninérgica.',
      severity: 'medium',
      timestamp: new Date('2024-04-10').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°2/2024',
      year: 2024,
      substances: ['N,N-Dimetilpentilona'],
    },
    {
      id: 'sat-2024-1',
      province: 'Nacional',
      title: 'SAT N°1/2024 — Fentanilo',
      message: 'Alerta nacional sobre la presencia de fentanilo, opioide sintético hasta 100 veces más potente que la morfina. Se vende como polvo, gotas sobre papel secante, vaporizadores nasales o pastillas. Produce dependencia rápida, tolerancia y síndrome de abstinencia severo. Riesgo extremo de sobredosis mortal por depresión respiratoria.',
      severity: 'high',
      timestamp: new Date('2024-02-15').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación',
      alertNumber: 'SAT N°1/2024',
      year: 2024,
      substances: ['Fentanilo'],
      pdfUrl: 'https://www.argentina.gob.ar/sites/default/files/sat_alerta_1_2024_fentanilo.pdf',
    },

    // ═══ ALERTA 2022 ═══
    {
      id: 'sat-2022-cocaina',
      province: 'Buenos Aires',
      title: 'Alerta 2022 — Intoxicación masiva por cocaína adulterada',
      message: 'Se registró un brote de intoxicación masiva por cocaína adulterada con probable presencia de opioides en el conurbano bonaerense. El evento resultó en múltiples hospitalizaciones y fallecimientos. Los síntomas incluyeron depresión respiratoria severa compatible con intoxicación por opiáceos.',
      severity: 'high',
      timestamp: new Date('2022-02-02').getTime(),
      source: 'SAT — Ministerio de Salud de la Nación / SEDRONAR',
      alertNumber: 'Alerta Especial 2022',
      year: 2022,
      substances: ['Cocaína adulterada', 'Opioides'],
      pdfUrl: 'https://www.argentina.gob.ar/sat/alertas/cocaina-adulterada',
    },

    // ═══ ALERTA TERRITORIAL RECIENTE ═══
    {
      id: 'territorial-neuquen-2025',
      province: 'Neuquén',
      title: 'Cocaína adulterada en Neuquén Capital — Dic 2025',
      message: 'Se registraron 2 fallecimientos y 1 persona en terapia intensiva vinculados al consumo de cocaína presuntamente adulterada en Neuquén Capital. Las autoridades sanitarias advierten sobre la circulación de sustancia con síntomas atípicos. Se recomienda extremar precauciones.',
      severity: 'high',
      timestamp: new Date('2025-12-16').getTime(),
      source: 'Ministerio de Salud de Neuquén',
      year: 2025,
      substances: ['Cocaína adulterada'],
    },
  ];
};
