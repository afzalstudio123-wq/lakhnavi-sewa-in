import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5C33F6",
          hover: "#4B29D4",
        },
        accent: {
          DEFAULT: "#FF6B6B",
          hover: "#FF5252",
        },
        canvas: "#FFFFFF",
        surface: "#F8F9FC",
        surface2: "#EEF0F8",
        ink: "#1A1A2E",
        muted: "#6E7191",
        borderColor: "#DDE2F0", // Named differently to avoid conflict with standard borders
        semantic: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
