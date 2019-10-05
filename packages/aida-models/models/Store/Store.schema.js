const { removeBlacklistedFields } = require('../../helpers');
const StoreCore = require('./User.core').default;

const User = {
  ...StoreCore,
};

const blacklist = ['id'];

exports.default = removeBlacklistedFields(User, blacklist);
