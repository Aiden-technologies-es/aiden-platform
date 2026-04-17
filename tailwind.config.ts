import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Aiden brand ──
        brand: {
          DEFAULT: '#13967e',
          light: '#1ab896',
          dark: '#0f7a65',
          50:  'rgba(19,150,126,0.05)',
          100: 'rgba(19,150,126,0.10)',
          200: 'rgba(19,150,126,0.20)',
        },
        // ── Aiden surface (glassmorphism) ──
        surface: {
          DEFAULT: 'rgba(255,255,255,0.72)',
          hover:   'rgba(255,255,255,0.85)',
          border:  'rgba(255,255,255,0.90)',
        },
        // ── Semantic ──
        aiden: {
          bg:     '#F0F2F5',
          text:   '#0A0A0F',
          muted:  '#7A7A8C',
          radius: '14px',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'aiden': '14px',
        'aiden-sm': '10px',
        'aiden-lg': '20px',
      },
      backgroundImage: {
        'aiden-gradient': 'linear-gradient(150deg, #EEF1F7 0%, #E8ECF4 40%, #E4E9F2 100%)',
        'aiden-dark': 'linear-gradient(135deg, #152740, #0D1F36)',
        'brand-gradient': 'linear-gradient(135deg, #13967e, #0f7a65)',
      },
      backdropBlur: {
        'aiden': '32px',
      },
      boxShadow: {
        'aiden': '0 1px 4px rgba(0,0,0,0.04)',
        'aiden-md': '0 4px 20px rgba(0,0,0,0.08)',
        'aiden-lg': '0 8px 40px rgba(0,0,0,0.12)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(74,222,128,.4)' },
          '50%': { opacity: '.7', boxShadow: '0 0 0 4px rgba(74,222,128,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.22s ease',
        'slide-up': 'slide-up 0.3s cubic-bezier(.32,0,.1,1)',
        'pulse-dot': 'pulse-dot 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config
