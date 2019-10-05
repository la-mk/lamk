const PaginationCursors = {
  before: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  after: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  hasAfter: {
    vtype: 'boolean',
    faker: 'random.boolean',
  },
  hasBefore: {
    vtype: 'boolean',
    faker: 'random.boolean',
  },
};

exports.default = PaginationCursors;
