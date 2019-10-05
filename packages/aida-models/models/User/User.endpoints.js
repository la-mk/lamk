const UserResponse = require('./User.response').default;
const UserRequest = require('./User.request').default;
const ErrorCore = require('../Shared/Error.core').default;

const User = {
  '/users': {
    put: {
      description: 'Update a user',
      operationId: 'updateUser',
      request: {
        body: UserRequest,
      },
      response: {
        '200': {
          description: 'Returns the updated user',
          body: UserResponse,
        },
        '400': {
          description: 'Failed to update the user.',
          body: ErrorCore,
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      description: 'Get a single user',
      operationId: 'getUser',
      request: {
        path: {
          id: UserRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Returning the user model',
          body: UserResponse,
        },
        '403': {
          description:
            'The user does not have permissions to get information about the specified user',
          body: ErrorCore,
        },
      },
    },
  },
};

exports.default = User;
