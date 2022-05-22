const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "mk",
    locales: ["mk", "en"],
    // This prevents nextjs from redirecting based on Accept-Language header
    localeDetection: false,
  },
  defaultNS: "translation",
  localePath: path.resolve("./public/locales"),
};
