// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        heartPop: {
          "0%": { transform: "scale(0)" },
          "25%": { transform: "scale(1.2)" },
          "50%": { transform: "scale(1)", filter: "brightness(1.5)" },
        },
        celebrate: {
          "0%": { transform: "scale(0)" },
          "50%": { opacity: "1", filter: "brightness(1.5)" },
          "100%": { transform: "scale(1.4)", opacity: "0", display: "none" },
        },
      },
      animation: {
        "heart-pop": "heartPop 1s ease forwards",
        celebrate: "celebrate 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
