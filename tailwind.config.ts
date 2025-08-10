import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'var(--font-noto-sans-sc)', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'noto-sc': ['var(--font-noto-sans-sc)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;