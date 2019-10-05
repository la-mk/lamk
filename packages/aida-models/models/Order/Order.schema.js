const { removeBlacklistedFields } = require('../../helpers');
const OrderCore = require('./Order.core').default;

const User = {
  ...OrderCore,
};

const blacklist = ['id'];

exports.default = removeBlacklistedFields(User, blacklist);
