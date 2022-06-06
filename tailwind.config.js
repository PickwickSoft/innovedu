module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        card: 'var(--card)',
        theme: 'var(--theme)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
};
