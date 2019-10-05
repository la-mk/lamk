const { removeBlacklistedFields } = require('../../helpers');
const UserCore = require('./User.core').default;

const User = {
  ...UserCore,
};

const blacklist = ['id'];

exports.default = removeBlacklistedFields(User, blacklist);
