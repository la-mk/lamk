import * as validation from '..';

const sampleSchema: any = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'country', 'numberOfOffices', 'employeeNames', 'phoneNumbers'],
  properties: {
    name: {
      type: 'string',
      maxLength: 511,
    },
    country: {
      type: 'string',
      maxLength: 255,
    },
    region: {
      type: 'string',
      maxLength: 255,
    },
    numberOfOffices: {
      type: 'number',
      minimum: 1,
      maximum: 50,
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          street: {
            type: 'string',
            maxLength: 63,
          },
          apartment: {
            type: 'string',
            maxLength: 63,
          },
        },
        required: ['street', 'apartment']
      },
    },
    employeeNames: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 4,
      maxItems: 8
    },
    phoneNumbers: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 4,
        maxLength: 8
      }
    }
  },
};

const sampleData = {
  name: 'John Doe',
  country: 'Japan',
  region: 'Kansai',
  numberOfOffices: 3,
  addresses: [
    {
      street: 'Isoji',
      apartment: 'Avanzare',
    },
    {
      street: 'Wakayama',
      apartment: 'Pure Country',
    },
  ],
  employeeNames: ['John', 'Foo', 'Bar', 'Eric'],
  phoneNumbers: ['123-456', '344-541'],
};

describe('Validation utility', () => {
  test('Should pass when a valid object is passed', () => {
    expect(validation.validate(sampleSchema, sampleData)).toBeFalsy();
  });

  test('Should pass when an optional field is passed a trimmed string', () => {
    expect(
      validation.validate(sampleSchema, { ...sampleData, region: '  ' })
    ).toBe(null);
  });

  test('Should pass when required should be ignored and object is empty', () => {
    expect(validation.validate(sampleSchema, {}, true)).toBeFalsy();
  });

  test('Should return an error when required should be ignored and a required property has invalid value', () => {
    expect(
      validation.validate(sampleSchema, { country: 123 }, true)
    ).toHaveProperty('country');
    expect(
      validation.validate(sampleSchema, { country: 123 }, true)?.country.name
    ).toBe('string');
  });

  test('Should return an error if at least one required property is not passed', () => {
    expect(
      validation.validate(sampleSchema, { ...sampleData, name: undefined })
    ).toHaveProperty('name');
  });

  test('Should return an error per invalid field', () => {
    expect(
      Object.keys(validation.validate(sampleSchema, {}) || {})
    ).toHaveLength(5);
    expect(validation.validate(sampleSchema, {})).toHaveProperty('name');
    expect(validation.validate(sampleSchema, {})).toHaveProperty('country');
    expect(validation.validate(sampleSchema, {})).toHaveProperty(
      'numberOfOffices'
    );
    expect(validation.validate(sampleSchema, {})).toHaveProperty(
      'phoneNumbers'
    );
    expect(validation.validate(sampleSchema, {})).toHaveProperty(
      'employeeNames'
    );
  });

  test('Should return an error from an array of objects', () => {
    expect(
      validation.validate(sampleSchema, {
        ...sampleData,
        addresses: [{ street: 'No apartment' }],
      })
    ).toHaveProperty('addresses');
  });

  test('Should return an error if data field does not exist in schema', () => {
    expect(
      validation.validate(sampleSchema, {
        ...sampleData,
        nonexistentField: 1,
      })
    ).toHaveProperty('nonexistentField');
  });

  test('Should return the true validation error on an optional field', () => {
    expect(
      validation.validate(sampleSchema, { ...sampleData, region: 123 })?.region
        .name
    ).toBe('string');
  });

  test('Should return the violated parameter values in a parametrized validator', () => {
    const err = validation.validate(sampleSchema, {
      ...sampleData,
      numberOfOffices: 123,
    })?.numberOfOffices;
    expect(err?.message).toContain('50');
    expect((err?.args as any).limit).toBe(50);
  });
});
