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

  publicRuntimeConfig: {
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    ARTIFACTS_ENDPOINT: process.env.NEXT_PUBLIC_ARTIFACTS_ENDPOINT,
    IMAGES_PROXY_ENDPOINT: process.env.NEXT_PUBLIC_IMAGES_PROXY_ENDPOINT,
    ANALYTICS_TRACKING_ID: process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID,
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NESTPAY_GATEWAY_ENDPOINT: process.env.NEXT_PUBLIC_NESTPAY_GATEWAY_ENDPOINT,
    STATIC_STORE_URL: process.env.NEXT_PUBLIC_STATIC_STORE_URL,
    UI_TEMPLATE: process.env.NEXT_PUBLIC_UI_TEMPLATE,
  },
};
