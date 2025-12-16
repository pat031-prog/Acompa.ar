/**
 * Favorites Service
 * Manages user's favorite substances using localStorage for privacy
 */

const FAVORITES_KEY = 'acompanar_favorites';

export interface FavoritesService {
  getFavorites: () => string[];
  addFavorite: (substanceTitle: string) => void;
  removeFavorite: (substanceTitle: string) => void;
  isFavorite: (substanceTitle: string) => boolean;
  toggleFavorite: (substanceTitle: string) => void;
}

/**
 * Get all favorite substance titles from localStorage
 */
export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

/**
 * Add a substance to favorites
 */
export const addFavorite = (substanceTitle: string): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(substanceTitle)) {
      favorites.push(substanceTitle);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

/**
 * Remove a substance from favorites
 */
export const removeFavorite = (substanceTitle: string): void => {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter(title => title !== substanceTitle);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

/**
 * Check if a substance is in favorites
 */
export const isFavorite = (substanceTitle: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(substanceTitle);
};

/**
 * Toggle favorite status for a substance
 */
export const toggleFavorite = (substanceTitle: string): void => {
  if (isFavorite(substanceTitle)) {
    removeFavorite(substanceTitle);
  } else {
    addFavorite(substanceTitle);
  }
};
