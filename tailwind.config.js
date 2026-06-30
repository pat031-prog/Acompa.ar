/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    // Preflight disabled: index.html already ships a hand-tuned base
    // reset/typography system that Tailwind's reset would fight with.
    preflight: false,
  },
  plugins: [],
};
