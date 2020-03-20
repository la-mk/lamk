export const errors: {
  [key: string]: { name: string; message: string; args?: any[] };
} = {
  pattern: {
    name: 'pattern',
    message: 'Field does not match the expected pattern',
  },
  string: {
    name: 'string',
    message: 'Field should be a string',
  },
  number: {
    name: 'number',
    message: 'Field should be a number',
  },
  numeric: {
    name: 'numeric',
    message: 'Field should be a numeric',
  },
  boolean: {
    name: 'boolean',
    message: 'Field should be either true or false',
  },
  lowercase: {
    name: 'lowercase',
    message: 'Field should all be lowercase',
  },
  uppercase: {
    name: 'uppercase',
    message: 'Field should all be uppercase',
  },
  length: {
    name: 'length',
    message: 'Field should have less than {{0}} entries',
  },
  minLength: {
    name: 'minLength',
    message: 'Field should be at least {{0}} characters long',
  },
  maxLength: {
    name: 'maxLength',
    message: 'Field should be at most {{0}} characters long',
  },
  negative: {
    name: 'negative',
    message: 'Field should be a negative value',
  },
  positive: {
    name: 'positive',
    message: 'Field should be a positive value',
  },
  between: {
    name: 'between',
    message: 'Field should be between {{0}} and {{1}}',
  },
  lessThan: {
    name: 'lessThan',
    message: 'Field should be less than {{0}}',
  },
  greaterThan: {
    name: 'greaterThan',
    message: 'Field should be more than {{0}}',
  },
  integer: {
    name: 'integer',
    message: 'Field should be an integer',
  },
  schema: {
    name: 'schema',
    message: 'Field does not match the expected schema',
  },
  oneOf: {
    name: 'oneOf',
    message: 'Field should be one of {{0}}',
  },
  email: {
    name: 'email',
    message: 'Field should be a valid email address',
  },
  date: {
    name: 'date',
    message: 'Field should be a valid date',
  },
  unique: {
    name: 'unique',
    message: 'Field should have unique values',
  },
  generic: {
    name: 'generic',
    message: 'Invalid entry',
  },
  'missing-in-schema': {
    name: 'missing-in-schema',
    message: 'Entry is not permitted for use',
  },
  'invalid-schema-selector': {
    name: 'invalid-schema-selector',
    message: 'Invalid schema selector passed',
  },
};

const singleDigitBrackets = /{{[0-9]}}/g;

export const getError = (name: string, args: any[]) => {
  const error = errors[name];
  if (!error) {
    return errors['generic'];
  }

  // Get all matches (which might not be in the index order), and get the index for each. For now we only support single-digit indices.
  const matches = error.message.match(singleDigitBrackets);
  if (!matches) {
    return error;
  }

  const indices = matches.map(match => parseInt(match[2], 10));
  indices.forEach(index => {
    error.message = error.message.replace(
      `{{${index}}}`,
      args[index].toString(),
    );
  });
  error.args = args;

  return error;
};
