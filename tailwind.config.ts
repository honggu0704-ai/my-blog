import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx,mdx,css}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
