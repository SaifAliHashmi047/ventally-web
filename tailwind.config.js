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
        // Brand Colors (from RN theme)
        primary: '#0A84FF',
        'primary-hover': '#0066CC',
        secondary: '#5E5CE6',
        accent: '#C2AEBF',      // magenda
        'accent-deep': '#204845', // green
        
        // Backgrounds (dark theme first – matches HomeWrapper)
        bg: {
          deep: '#000000',
          main: '#0A0A0A',
          surface: '#1C1C1E',
          card: 'rgba(255,255,255,0.04)',
          'card-hover': 'rgba(255,255,255,0.07)',
          overlay: 'rgba(0,0,0,0.6)',
        },
        
        // Text
        text: {
          pure: '#FFFFFF',
          main: '#F5F5F5',
          muted: '#8E8E93',
          dim: '#636366',
        },
        
        // Borders / Dividers
        border: {
          DEFAULT: 'rgba(255,255,255,0.12)',
          hover: 'rgba(255,255,255,0.2)',
          strong: 'rgba(255,255,255,0.25)',
        },
        
        // Status
        success: '#32D74B',
        error: '#FF453A',
        warning: '#FFD60A',
        info: '#0A84FF',
        red: '#FF5757',
        
        // Mood Colors
        mood: {
          'happy-bg': '#CFEDE3',
          'happy-text': '#68BDA1',
          'neutral-bg': '#E7EEF4',
          'neutral-text': '#75BFFF',
          'sad-bg': '#DCE8FF',
          'sad-text': '#85AFFF',
          'anxious-bg': '#FFF4CC',
          'anxious-text': '#FFD746',
          'mad-bg': '#FFD6D6',
          'mad-text': '#EA7B7B',
        },
        
        // Chart colors
        chart: {
          1: '#2D3282',
          2: '#4E54C8',
          3: '#6A1B9A',
          4: '#9575CD',
        },
        
        // Admin accent
        admin: {
          primary: '#C2AEBF',
          secondary: '#A89BB0',
          bg: 'rgba(194,174,191,0.1)',
        },
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      
      fontSize: {
        xs: ['11px', '16px'],
        sm: ['13px', '18px'],
        base: ['15px', '22px'],
        md: ['17px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['28px', '36px'],
        '3xl': ['34px', '42px'],
        '4xl': ['40px', '48px'],
      },
      
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
        '72': '288px',
        '80': '320px',
        '88': '352px',
        '96': '384px',
        'sidebar': '280px',
      },
      
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        DEFAULT: '16px',
        lg: '24px',
        xl: '40px',
      },
      
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
        'glow-primary': '0 0 20px rgba(10,132,255,0.3)',
        'glow-accent': '0 0 20px rgba(194,174,191,0.25)',
        'sm': '0 1px 3px rgba(0,0,0,0.3)',
        'md': '0 4px 12px rgba(0,0,0,0.4)',
        'lg': '0 8px 24px rgba(0,0,0,0.5)',
        'xl': '0 16px 48px rgba(0,0,0,0.6)',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
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
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },

      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
