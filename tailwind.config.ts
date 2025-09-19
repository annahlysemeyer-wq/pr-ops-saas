import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e2e5c',      // MuniFlow blue
        secondary: '#0ea5e9',     // Sky blue
        success: '#10b981',       // Emerald
        warning: '#f59e0b',       // Amber
        danger: '#ef4444',        // Red
        background: '#f8fafc',    // Light gray
      },
    },
  },
  plugins: [],
}

export default config