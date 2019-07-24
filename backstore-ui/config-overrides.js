const { override, addLessLoader } = require('customize-cra');

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    //Find all variables here: https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
    modifyVars: {
      '@primary-color': '#547AA5',
    },
  }),
);
