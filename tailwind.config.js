module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-green': '#A8C7A7',
        theme: '#447B43',
      },
    },
  },
  plugins: [],
};
