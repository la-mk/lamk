const StoreCore = require('../Store/Store.core').default;
const DistributorCore = require('../Distributor/Distributor.core').default;

const Delivery = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  forStore: StoreCore.id,
  method: {
    vtype: 'string',
    required: true,
    faker: ['none', 'cargo-pickup', 'door-to-door'],
  },
  price: {
    vtype: 'number',
    required: true,
    faker: 'random.number',
  },
  freeDeliveryOver: {
    vtype: 'number',
    required: true,
    faker: 'random.number',
  },
  distributor: DistributorCore.id,
};

exports.default = Delivery;
