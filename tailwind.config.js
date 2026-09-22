/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fffbe1',
          100: '#fff3b7',
          200: '#ffe56f',
          300: '#ffd229',
          400: '#ffb900',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde8e8',
          500: '#9b1c1c',
          700: '#7c2d12',
          800: '#681d1d',
          900: '#451a03',
        },
        devotional: {
          bg: '#fdfbf7',
          card: '#ffffff',
          paper: '#fffbeb',
          accent: '#d97706',
          heading: '#451a03',
          text: '#292524',
          muted: '#78716c',
          border: '#f3f4f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      }
    },
  },
  plugins: [],
};
