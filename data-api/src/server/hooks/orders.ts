// These are executed in the same order they are written down.
const messagesHooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

export const registerOrdersHooks = (app: any) =>
  app.service('orders').hooks(messagesHooks);
