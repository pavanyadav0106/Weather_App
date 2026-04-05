// ============================================
// FILE: frontend/tailwind.config.js
// ============================================

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      colors: {
        sky: {
          950: "#03071e",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "spin-slow":   "spin 3s linear infinite",
        "pulse-slow":  "pulse 4s ease-in-out infinite",
        "float":       "float 6s ease-in-out infinite",
        "fade-in":     "fadeIn 0.5s ease forwards",
        "slide-up":    "slideUp 0.4s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
