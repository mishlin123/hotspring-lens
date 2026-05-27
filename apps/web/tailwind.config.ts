import type { Config } from 'tailwindcss'

// Colour palette derived from the 1000 Springs project logo blue (#00AECC).
// Overrides Tailwind's default teal so all existing teal-* classes match the brand.
const springBlue = {
  50:  '#e4f8fc',
  100: '#b3edF7',
  200: '#7de1f2',
  300: '#45d4ec',
  400: '#18cae6',
  500: '#00aecc', // ← logo primary
  600: '#0091a8',
  700: '#006f82',
  800: '#004d5c',
  900: '#002c35',
  950: '#001920',
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: springBlue,
      },
    },
  },
  plugins: [],
}

export default config
