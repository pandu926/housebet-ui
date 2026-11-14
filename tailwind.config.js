/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hb: {
          bg: '#071318',
          shell: '#09181E',
          surface: '#0C1E26',
          card: '#0F242D',
          cardHover: '#132D38',
          odd: '#152C36',
          oddHover: '#1C3946',
          oddActive: '#1CA4D4',
          border: '#18333F',
          borderLight: '#214454',
          cyan: '#2CE5F6',
          oddCyan: '#3AD4F7',
          mint: '#B9F6EC',
          mintHover: '#9FEFE2',
          live: '#E91E63',
          amber: '#F59E0B',
          gold: '#F5B82E',
          emerald: '#10B981',
          rose: '#EF4444',
          text: '#F1F7F9',
          muted: '#84A0AC',
          dim: '#54727E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'hb-glow': '0 0 20px rgba(44, 229, 246, 0.18)',
        'hb-card': '0 8px 28px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
