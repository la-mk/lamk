const Distributor = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  name: {
    vtype: 'string',
    required: true,
    faker: ['Cargo Express', 'Globko'],
  },
};

exports.default = Distributor;
