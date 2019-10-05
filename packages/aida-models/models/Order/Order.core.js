const Store = require('../Store/Store.core');
const User = require('../User/User.core');
const Product = require('../Product/Product.core');

const Order = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  orderedFrom: Store.id,
  orderedBy: User.id,
  ordered: [
    {
      product: Product.id,
      quantity: {
        vtype: 'number',
        required: true,
        faker: 'random.number',
      },
    },
  ],
  status: {
    vtype: 'string',
    required: true,
    faker: ['pending', 'complete'],
  },
};

exports.default = Order;
