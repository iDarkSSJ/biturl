module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        mob: "450px",
      },
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
      },
      animation: {
        toLeft: "toLeft 400ms ease both",
        toRight: "toRight 400ms ease both",
        fadeIn: "fadeIn 400ms ease both",
        fadeOut: "fadeOut 400ms ease both",
      },
      keyframes: {
        toLeft: {
          "0%": { right: "-50%", opacity: "0" },
          "100%": { right: "0", opacity: "1" },
        },
        toRight: {
          "0%": { right: "0", opacity: "1" },
          "100%": { right: "-50%", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
}
