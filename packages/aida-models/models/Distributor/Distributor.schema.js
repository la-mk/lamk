const { removeBlacklistedFields } = require('../../helpers');
const DistributorCore = require('./User.core').default;

const User = {
  ...DistributorCore,
};

const blacklist = ['id'];

exports.default = removeBlacklistedFields(User, blacklist);
