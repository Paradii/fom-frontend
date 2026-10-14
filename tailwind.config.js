export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFC529",
          strong: "#F5B400",
          deco: "#C78A00",
          text: "#8A5A00",
          soft: "#FFF6D6",
          line: "#E0A800",
        },
        ink: { DEFAULT: "#1C1B19", 2: "#5F5D58", 3: "#77756F" },
        line: "#ECEAE5",
        bg: "#FAFAF8",
        danger: "#FF4D4F",
      },
      fontFamily: {
        head: ["Prompt", "sans-serif"],
        body: ['"IBM Plex Sans Thai"', "sans-serif"],
      },
      borderRadius: { card: "16px" },
    },
  },
  corePlugins: { preflight: false },
  plugins: [],
};
