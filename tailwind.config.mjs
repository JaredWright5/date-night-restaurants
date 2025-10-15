/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
    // Sophisticated dining palette
    'charcoal': '#2C2C2C',       // Deep charcoal - elegant & modern
    'charcoal-light': '#4A4A4A',  // Lighter charcoal
    'charcoal-dark': '#1A1A1A',   // Darker charcoal
    'gold': '#D4AF37',           // Rich gold - luxury & warmth
    'gold-light': '#E6C547',     // Lighter gold
    'gold-dark': '#B8941F',      // Darker gold
    'cream': '#F8F6F0',          // Warm cream - soft & inviting
    'cream-dark': '#F0EDE5',     // Darker cream
    'sage': '#8B9A8B',           // Muted sage - sophisticated green
    'sage-light': '#A8B5A8',     // Lighter sage
    'burgundy': '#722F37',       // Deep burgundy - rich & romantic
    'burgundy-light': '#8B3A42',  // Lighter burgundy
    'steel': '#6B7B7B',          // Steel blue-gray - modern & clean
    'steel-light': '#8A9A9A',    // Lighter steel
    'ivory': '#FDFCF8',          // Pure ivory - clean & elegant
    'bronze': '#CD7F32',         // Bronze - warm & metallic
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
