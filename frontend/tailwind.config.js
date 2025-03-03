/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        highlight: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      clipPath: {
        mask: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)', // Custom mask shape
      },
      screens: {
        narrow: {
          raw: '(max-aspect-ratio: 3 / 2)',
        },
        wide: {
          raw: '(min-aspect-ratio: 3 / 2)',
        },
        'taller-than-854': {
          raw: '(min-height: 854px)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {},
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-clip-path'),
  ],
};