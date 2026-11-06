import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: { 850: "#151c2c", 950: "#070a12" },
        amber: {
          200: "rgb(var(--primary-200, 253 230 138) / <alpha-value>)",
          300: "rgb(var(--primary-300, 252 211 77) / <alpha-value>)",
          400: "rgb(var(--primary-400, 251 191 36) / <alpha-value>)",
          500: "rgb(var(--primary-500, 245 158 11) / <alpha-value>)",
          600: "rgb(var(--primary-600, 217 119 6) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
