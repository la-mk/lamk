const copy = require('rollup-plugin-copy-glob');

// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    config.plugins.push(
      copy([
          { files: 'src/locales/**/*', dest: 'dist/locales' }
        ]
      )
    );

    return config; // always return a config.
  },
};