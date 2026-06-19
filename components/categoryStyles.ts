import type { SubstanceCategory } from '../types';

/**
 * A consistent colour language for substance categories.
 *
 * Following harm-reduction conventions (stimulants warm, depressants cool,
 * psychedelics violet, etc.) so a category is recognisable at a glance — used
 * for list dots, accent bars, tinted chips and the detail hero gradient.
 */
export const CATEGORY_COLORS: Record<SubstanceCategory, string> = {
  Estimulante: '#FB923C', // warm orange
  Depresor: '#60A5FA', // calm blue
  Psicodélico: '#C084FC', // violet
  Disociativo: '#2DD4BF', // teal
  Empatógeno: '#F472B6', // rose
  Psicofármaco: '#818CF8', // indigo
  Otro: '#94A3B8', // slate
};

const FALLBACK_COLOR = CATEGORY_COLORS.Otro;

/** Colour for a single category, with a safe fallback. */
export const categoryColor = (category?: SubstanceCategory): string =>
  (category && CATEGORY_COLORS[category]) || FALLBACK_COLOR;

/** Colour that represents an entry, based on its primary (first) category. */
export const primaryCategoryColor = (categories: SubstanceCategory[]): string =>
  categoryColor(categories[0]);

/**
 * Append an alpha channel to a 6-digit hex colour.
 * @param hex   e.g. "#60A5FA"
 * @param alpha 0–1 opacity
 */
export const withAlpha = (hex: string, alpha: number): string => {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};
