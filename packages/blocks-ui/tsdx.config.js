const alias = require('@rollup/plugin-alias');

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    config.plugins.push(
      alias({
        entries: [
          {
            find: 'react/jsx-dev-runtime',
            replacement: 'react/jsx-dev-runtime.js',
          },
          { find: 'react/jsx-runtime', replacement: 'react/jsx-runtime.js' },
        ],
      })
    );
    return config; // always return a config.
  },
};
