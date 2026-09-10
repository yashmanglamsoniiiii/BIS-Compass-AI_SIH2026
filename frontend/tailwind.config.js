/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bis: {
          dark: '#070913',
          card: '#0f172a',
          gold: '#f59e0b',
          goldLight: '#fbbf24',
          cyan: '#06b6d4',
          emerald: '#10b981',
          navy: '#1e1b4b'
        }
      }
    },
  },
  plugins: [],
}
