/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Alpine Velocity Premium Light Palette
        alpine: {
          background: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#0F172A',
          textSecondary: '#64748B',
          border: '#E2E8F0',
          indigo: '#6366F1',
          teal: '#14B8A6',
          rose: '#F43F5E',
        },
        slate: {
          900: '#0F172A',
          950: '#020617',
          50: '#F8FAFC',
          200: '#E2E8F0',
          500: '#64748B',
          600: '#475569',
        },
        teal: {
          500: '#14B8A6',
          50: '#F0FDFA',
        },
        emerald: {
          50: '#F0FDF4',
          600: '#16A34A',
          700: '#15803D',
        },
        // Obsidian Soft Neumorphism Palette
        neumorphic: {
          background: '#e0e5ec',
          elevated: '#f0f5ff',
          dark: '#bec3cf',
          light: '#ffffff',
          shadow: 'rgb(163, 177, 198)',
          highlight: 'rgb(255, 255, 255)',
        },
        'vivid-violet': '#7c3aed',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'elite-sm': '0 4px 6px -1px rgb(0 0 0 / 0.05)',
        'elite-md': '0 10px 15px -3px rgb(0 0 0 / 0.08)',
        'elite-lg': '0 20px 25px -5px rgb(0 0 0 / 0.10)',
        'elite-glow': '0 0 20px -2px rgb(99 102 241 / 0.3)',
        'neu-soft': '4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.6)',
        'neu-inset': 'inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.6)',
        'neu-pressed': 'inset 2px 2px 5px rgba(163, 177, 198, 0.4), inset -2px -2px 5px rgba(255, 255, 255, 0.4)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton-loading': 'skeleton-loading 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fade-in 0.5s ease-in',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'skeleton-loading': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'ripple': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
      },
      backgroundImage: {
        skeleton: 'linear-gradient(90deg, rgba(226, 232, 240, 0.2) 0%, rgba(226, 232, 240, 0.4) 50%, rgba(226, 232, 240, 0.2) 100%)',
        'dotted-grid': 'radial-gradient(circle, rgba(226, 232, 240, 0.3) 1px, transparent 1px)',
      },
      backgroundSize: {
        skeleton: '1000px 100%',
        'dotted-grid': '20px 20px',
      },
    },
  },
  plugins: [],
};