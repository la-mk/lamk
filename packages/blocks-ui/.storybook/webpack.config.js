//dont need stories path if you have your stories inside your //components folder
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.less$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    ],
  });

  // See https://github.com/chakra-ui/chakra-ui/issues/2527 why this is needed for now.
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    '@emotion/core': '@emotion/react',
    'emotion-theming': '@emotion/react',
  };
  return config;
};
