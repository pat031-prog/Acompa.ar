/**
 * Shared motion language for the SafeTrip UI.
 * A small, consistent set of springs/eases so every transition feels related.
 * Global `MotionConfig reducedMotion="user"` (in App) makes transforms respect
 * the OS "reduce motion" setting; CSS keyframes are neutralised in index.html.
 */

// easeOutExpo — confident, decelerating; the house curve.
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// The pill / layout spring (nav indicator, rail selection).
export const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 } as const;

// Section (page) enter/exit — used by App's AnimatePresence.
export const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE } },
};

// Detail-panel content enter/exit (coral panel inner slide).
export const detailVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.36, ease: EASE } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: EASE } },
};

// Staggered list container + item (rails, card grids).
export const listContainer = {
  animate: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};
export const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};
