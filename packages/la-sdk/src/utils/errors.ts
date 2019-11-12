export const errors: {
  [key: string]: {
    name: string;
    message: string;
  }
} = {
  'string': {
    name: 'string',
    message: 'The field is required and should be a string',
  },
  'generic': {
    name: 'generic',
    message: 'Invalid entry'
  },
  'invalid-schema-selector': {
    name: 'invalid-schema-selector',
    message: 'Invalid schema selector passed',
  }
}