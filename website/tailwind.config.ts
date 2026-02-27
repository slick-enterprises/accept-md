import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        display: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
      },
      fontSize: {
        "section-label": ["0.6875rem", { lineHeight: "1", letterSpacing: "0.12em" }],
        "display-2xl": ["6rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "400" }],
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "400" }],
        "display-sm": ["2rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "400" }],
      },
      lineHeight: {
        "relaxed": "1.75",
        "loose": "2",
      },
      letterSpacing: {
        "tighter": "-0.02em",
        "tight": "-0.01em",
        "normal": "0",
        "wide": "0.01em",
        "wider": "0.02em",
      },
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        ink: {
          950: "#0c0c0e",
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
          600: "#52525b",
          500: "#71717a",
          400: "#a1a1aa",
          200: "#e4e4e7",
          50: "#fafafa",
        },
      },
      spacing: {
        "section": "7rem",
        "section-sm": "5rem",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgb(255 255 255 / 0.025) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.025) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      borderRadius: {
        "card": "1rem",
        "card-lg": "1.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
