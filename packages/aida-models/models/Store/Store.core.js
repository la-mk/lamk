const UserCore = require('../User/User.core');

const Store = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  ownedBy: UserCore.id,
  name: {
    vtype: 'string',
    required: true,
    faker: 'company.companyName',
  },
  slug: {
    vtype: 'string',
    required: true,
    faker: 'lorem.slug',
  },
  logo: {
    vtype: 'string',
    required: true,
    faker: 'image.business',
  },
  isPublished: {
    vtype: 'boolean',
    required: true,
    faker: [true, false],
  },
};

exports.default = Store;
