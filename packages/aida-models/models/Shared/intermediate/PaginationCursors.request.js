const PaginationCursors = {
  before: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  after: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  limit: {
    vtype: 'string',
    faker: 'random.number',
  },
};

exports.default = PaginationCursors;
