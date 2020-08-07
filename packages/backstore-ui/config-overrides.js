const { override, addLessLoader, fixBabelImports } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      //Find all variables here: https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
      modifyVars: {
        '@font-family': `
      'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
      `,
        '@primary-color': '#118AB2',
        '@menu-highlight-color': '#EF4351',
        '@menu-dark-item-active-bg': '#EF4351',
        '@layout-header-background': '#07074F',
      },
    },
  }),
);
