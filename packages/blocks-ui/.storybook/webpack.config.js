//dont need stories path if you have your stories inside your //components folder
module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.less$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "less-loader",
        options: {
          lessOptions: {
            javascriptEnabled: true
          }
        }
      }]
    })

    return config;
};