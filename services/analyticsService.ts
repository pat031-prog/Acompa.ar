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

// Default alerts (examples)
const getDefaultAlerts = (): TerritorialAlert[] => {
  return [
    {
      id: 'default-1',
      province: 'Buenos Aires',
      title: 'MDMA adulterado detectado',
      message: 'Se detectaron pastillas vendidas como MDMA que contienen catinona sintética. Realizá testeo antes de consumir.',
      severity: 'high',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      source: 'Red de Testeo Comunitario',
    },
    {
      id: 'default-2',
      province: 'CABA',
      title: 'Alta concentración de fentanilo en heroína',
      message: 'Muestras analizadas muestran presencia de fentanilo en heroína circulante. Extremar precauciones y tener naloxona disponible.',
      severity: 'high',
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      source: 'SEDRONAR',
    },
    {
      id: 'default-3',
      province: 'Nacional',
      title: 'Campaña de testeo gratuito',
      message: 'Durante enero y febrero, testeo gratuito de sustancias en centros de reducción de daños participantes.',
      severity: 'low',
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      source: 'Intercambios AC',
    },
    {
      id: 'default-4',
      province: 'Córdoba',
      title: 'Cocaína con levamisol',
      message: 'Se identificó cocaína adulterada con levamisol, puede causar inmunosupresión. Testear antes de usar.',
      severity: 'medium',
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
  ];
};
