import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          light: "#FAFAFA",
          shade: "#0A0A09",
          background: "#F1E9DA", // Light Beige
          foreground: "#2E294E", // Dark Indigo
          primary: "#FFD400", // Bright Yellow
          accent: "#D90368", // Vivid Pink
          highlight: "#541388", // Deep Purple
          dark: {
            background: "#1A1A2E", // Deep Navy
            foreground: "#EAEAEA", // Light Grey
            primary: "#FFDD33", // Muted Yellow
            accent: "#FF4F7B", // Bright Pink
            highlight: "#6A28A5", // Soft Purple
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        dmSans: "var(--font-dm-sans)", // headings
        workSans: "var(--font-work-sans)", //texts
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
