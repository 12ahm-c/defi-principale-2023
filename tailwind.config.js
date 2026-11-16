/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ice: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        verite: {
          blue: '#E0F2FE',
          deep: '#0B192C',
          card: '#1E293B',
          red: '#EF4444',
          green: '#10B981',
          amber: '#F59E0B',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      animation: {
        'shutter-flash': 'flash 150ms ease-out',
        'ice-pulse': 'icePulse 3s ease-in-out infinite',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0.9', backgroundColor: '#FFFFFF' },
          '100%': { opacity: '0' },
        },
        icePulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
