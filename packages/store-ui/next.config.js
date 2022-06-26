const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  swcMinify: true,
  webpack5: true,
  experimental: {
    concurrentFeatures: true,
    // This prevents shipping JS and all rendering happens on backend, enable later on
    // serverComponents: true
  },
};
