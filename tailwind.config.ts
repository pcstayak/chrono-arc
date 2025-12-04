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
        // Chrono Arc theme colors
        arc: {
          primary: "#2563eb", // blue-600
          secondary: "#7c3aed", // violet-600
          accent: "#db2777", // pink-600
        },
        event: {
          new: "#3b82f6", // blue-500
          safe: "#10b981", // green-500
          danger: "#f59e0b", // amber-500
          attack: "#ef4444", // red-500
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
