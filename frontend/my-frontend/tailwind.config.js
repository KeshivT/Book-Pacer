/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        myBlue: {
          DEFAULT: '#101e6e',
          50: '#e3e7f7',   // Very light blue (for backgrounds or accents)
          100: '#c4cbea',   // Light blue
          200: '#9da6d9',   // Lighter shade
          300: '#6f7bc7',   // Light-mid tone
          400: '#4452b0',   // Mid tone blue
          500: '#101E6E',   // Primary dark blue (main theme color)
          600: '#0d185d',   // Slightly darker
          700: '#0a134d',   // Darker for text or buttons
          800: '#070e3d',   // Even darker
          900: '#04092c',   // Near black for deepest backgrounds
        },
        myPurple: {
          DEFAULT: '#7c5aa2',
          50: '#f2e8f9',   // Very light purple (for backgrounds or accents)
          100: '#e0ceef',   // Light purple
          200: '#c7aee3',   // Lighter shade
          300: '#ae8dd8',   // Light-mid tone
          400: '#9473BD',   // Primary lilac purple (main theme color)
          500: '#7c5aa2',   // Slightly darker purple
          600: '#674885',   // Mid-dark tone
          700: '#523569',   // Darker for text or buttons
          800: '#3d254d',   // Even darker
          900: '#291634',   // Near black for deepest backgrounds
        },
      },
      fontFamily: {
        relaxing: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
};

