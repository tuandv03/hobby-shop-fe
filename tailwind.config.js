/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Rajdhani", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",
        primary: "hsl(var(--primary))",
        primaryForeground: "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        secondaryForeground: "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        accentForeground: "hsl(var(--accent-foreground))",
        muted: "hsl(var(--muted))",
        mutedForeground: "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      boxShadow: {
        glow: "0 0 0 3px hsl(var(--primary)/0.35), 0 0 40px 0 hsl(var(--accent)/0.15)",
      },
      backgroundImage: {
        "ygo-grid":
          "radial-gradient(circle at 1px 1px, hsl(var(--grid-dot)) 1px, transparent 0)",
      },
      backgroundSize: {
        "grid-size": "28px 28px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
