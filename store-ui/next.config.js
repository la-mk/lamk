const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const withLess = require('@zeit/next-less')

module.exports = withPlugins([
  [withLess, {
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: {

      }
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/
        const origExternals = [...config.externals]
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ]
  
        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        })
      }
      return config
    },
  }],
  [withBundleAnalyzer, {
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    }
  }]
]);

