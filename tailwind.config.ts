import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Verdana", "Geneva", "sans-serif"],
      },
      colors: {
        bgPrimary: "#050505",
        bgSecondary: "#000000",
        accent: "#00bfff",
        textPrimary: "#ffffff",
        textSecondary: "#a0a0a0",
        hologramCurrent: "#d4af37",
        hologramPotential: "#ffffff",
        highlightPolygon: "#00ff00",
      },
      animation: {
        "grid-flow": "gridFlow 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
      },
      keyframes: {
        gridFlow: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 60px" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backdropBlur: {
        md: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
