/**
 * The whole app is themed via CSS custom properties (see index.html's
 * :root and [data-theme="gba"] blocks) — components never hardcode a
 * palette, they read var(--accent-primary) etc. Switching themes is just
 * flipping the `data-theme` attribute on <html>; this module only tracks
 * which one is selected and persists it.
 */
export type ThemeName = 'safetrip' | 'gba';

const STORAGE_KEY = 'acompanar_theme';

export function getStoredTheme(): ThemeName {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'gba' || v === 'safetrip') return v;
  } catch {
    // localStorage unavailable (private mode, disabled storage, etc.)
  }
  return 'safetrip';
}

export function storeTheme(theme: ThemeName): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore — theme just won't persist across reloads
  }
}

export const THEME_META: Record<ThemeName, { label: string; metaColor: string }> = {
  safetrip: { label: 'SafeTrip', metaColor: '#121212' },
  gba: { label: 'GBA', metaColor: '#171029' },
};
