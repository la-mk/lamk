const Store = require('../Store/Store.core');

const Product = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  soldBy: Store.id,
  name: {
    vtype: 'string',
    required: true,
    faker: 'commerce.productName',
  },
  price: {
    vtype: 'number',
    required: true,
    faker: 'commerce.price',
  },
  description: {
    vtype: 'string',
    faker: 'commerce.product',
  },
  images: [
    {
      vtype: 'string',
      required: true,
      faker: 'image.imageUrl',
    },
  ],
  category: {
    vtype: 'string',
    required: true,
    faker: 'commerce.department',
  },
};

exports.default = Product;
