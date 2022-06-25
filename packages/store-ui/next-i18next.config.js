const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "mk",
    locales: ["mk", "en"],
    // This prevents nextjs from redirecting based on Accept-Language header, or the NEXT_LOCALE cookie. Unfortuantely in MK most people will have accept language as english, so it's better to just not use it for now.
    localeDetection: false,
  },
  defaultNS: "translation",
  localePath: path.resolve("./public/locales"),
};
