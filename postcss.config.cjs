// Tailwind v4 (@tailwindcss/vite) performs its own vendor prefixing via
// Lightning CSS, and emits modern CSS (color-mix(), @property, oklch(), etc.)
// that the standalone autoprefixer cannot parse. Running both made `astro dev`
// throw "Unknown word arb" while transforming global.css. Prefixing is handled
// by Tailwind v4, so no extra PostCSS plugins are needed here.
module.exports = {
  plugins: [],
};
