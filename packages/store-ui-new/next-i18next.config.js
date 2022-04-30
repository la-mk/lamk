const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "mk",
    locales: ["en", "mk"],
  },
  defaultNS: "translation",
  localePath: path.resolve("./public/locales"),
};
