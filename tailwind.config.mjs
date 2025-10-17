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
        // Warm, food & love themed palette - no gradients, solid colors
        'warm-cream': '#FFF8F0',      // Warm cream base - welcoming
        'warm-butter': '#F4E4BC',     // Soft butter yellow - cozy
        'warm-honey': '#E8B86D',      // Rich honey gold - sweet
        'warm-terracotta': '#D2691E',  // Warm terracotta - earthy
        'warm-rust': '#B7410E',       // Deep rust red - passionate
        
        // Food-inspired colors
        'sage-green': '#9CAF88',      // Soft sage green - fresh
        'olive': '#6B8E23',           // Warm olive - natural
        'coffee': '#8B4513',          // Rich coffee brown - rich
        'chocolate': '#5D4037',       // Deep chocolate - indulgent
        'warm-charcoal': '#3E2723',   // Warm charcoal - sophisticated
        
        // Love & romance colors
        'blush': '#FFE4E1',           // Soft blush pink - romantic
        'rose': '#F8BBD9',            // Romantic rose - loving
        'heart': '#E91E63',            // Heart red - passionate
        'coral': '#FF7043',            // Vibrant coral - warm
        'sunset': '#FF5722',           // Sunset orange - energetic
        
        // Accent colors
        'amber': '#FFC107',           // Golden amber - luxurious
        'gold': '#FFD700',            // Pure gold - premium
        'warm-white': '#FFFEF7',     // Warm white - clean
        'soft-gray': '#F5F5F5',       // Soft gray - neutral
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
