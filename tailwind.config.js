/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        paper: '#faf9f6',
        charcoal: '#141311',
        sand: {
          100: '#faf9f6',
          200: '#e6e2d9',
          300: '#d8d5cf',
          400: '#b3afa6',
          500: '#9b9791',
          600: '#8a8781',
          700: '#77736c',
          800: '#6e6b66',
          900: '#57534c',
        },
        line: {
          DEFAULT: '#232220',
          light: '#3a3733',
        },
        accent: {
          orange: '#ff7f00',
          orange2: '#ff8305',
          amber: '#ffb23a',
          yellow: '#fff560',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        sans: ['"Source Sans 3"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #ff7f00, #ff8305, #fff560)',
        'brand-gradient-alt': 'linear-gradient(90deg, #ff7f00, #ffb23a)',
      },
    },
  },
  plugins: [],
}
