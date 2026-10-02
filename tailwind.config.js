/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#070913',
          surface: '#0D1122',
          card: '#13182E',
          cardHover: '#1A2242',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(0, 240, 255, 0.3)',
          cyan: '#00F0FF',
          cyanGlow: 'rgba(0, 240, 255, 0.4)',
          purple: '#9D4EDD',
          purpleGlow: 'rgba(157, 78, 221, 0.4)',
          pink: '#FF007A',
          green: '#00FF9D',
          amber: '#FFB800',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'neon-purple': '0 0 20px rgba(157, 78, 221, 0.35)',
        'neon-pink': '0 0 20px rgba(255, 0, 122, 0.35)',
        'neon-green': '0 0 20px rgba(0, 255, 157, 0.35)',
        'glow-lg': '0 0 35px rgba(0, 240, 255, 0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
