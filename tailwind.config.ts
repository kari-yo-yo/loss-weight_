import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          base: '#0f0f14',
          light: '#1a1a24',
        },
        paper: {
          base: '#f2ede4',
          dark: '#e8e0d4',
        },
        cinnabar: '#bf3b3b',
        pine: '#4a7c59',
        indigo: '#2c5f7c',
        ochre: '#a0522d',
        gold: '#c9a96e',
        moon: '#d6e4e1',
      },
      fontFamily: {
        serif: ['var(--font-noto-serif)', 'serif'],
        sans: ['var(--font-noto-sans)', 'sans-serif'],
        calligraphy: ['var(--font-ma-shan-zheng)', 'cursive'],
      },
      borderRadius: {
        card: '1rem',
      },
      animation: {
        'ink-spread': 'inkSpread 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        inkSpread: {
          '0%': { clipPath: 'circle(0% at 50% 50%)' },
          '100%': { clipPath: 'circle(150% at 50% 50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
