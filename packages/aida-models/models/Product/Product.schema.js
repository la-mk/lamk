const { removeBlacklistedFields } = require('../../helpers');
const ProductCore = require('./User.core').default;

const User = {
  ...ProductCore,
};

const blacklist = ['id'];

exports.default = removeBlacklistedFields(User, blacklist);
