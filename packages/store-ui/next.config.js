const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  swcMinify: true,
  webpack5: true,
  // Otherwise transactions in _error will fail
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  useSuspense: false,
  experimental: {
    concurrentFeatures: true,
    // This prevents shipping JS and all rendering happens on backend, enable later on
    // serverComponents: true
  },
};
