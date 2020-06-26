import * as validation from '../validation';
import v8n from 'v8n';

describe('Custom validators', () => {
  test('oneOf', () => {
    expect(
      v8n()
        .oneOf(['a', 'b'])
        .test('a')
    ).toBeTruthy();
    expect(
      v8n()
        .oneOf(['a', 'b'])
        .test('b')
    ).toBeTruthy();
    expect(
      v8n()
        .oneOf([1, 2])
        .test(1)
    ).toBeTruthy();
    expect(
      v8n()
        .oneOf([true, false])
        .test(true)
    ).toBeTruthy();

    expect(
      v8n()
        .oneOf(['a', 'b'])
        .test('c')
    ).toBeFalsy();
    expect(
      v8n()
        .oneOf([])
        .test('a')
    ).toBeFalsy();
    expect(
      v8n()
        .oneOf([])
        .test('a')
    ).toBeFalsy();
    expect(
      v8n()
        .oneOf([1, 2])
        .test('a')
    ).toBeFalsy();
  });

  // The tests are sparse as the regex used is already well tested and there is no need to repeat it here.
  test('email', () => {
    expect(
      v8n()
        .email()
        .test('some@email.com')
    ).toBeTruthy();

    expect(
      v8n()
        .email()
        .test('somenotemail')
    ).toBeFalsy();
  });

  test('date', () => {
    // Valid date
    expect(
      v8n()
        .datetime()
        .test('2020-01-12T11:03:14.071Z')
    ).toBeTruthy();

    // Valid leap year
    expect(
      v8n()
        .datetime()
        .test('2020-02-29T11:03:14.071Z')
    ).toBeTruthy();

    // Invalid leap year
    expect(
      v8n()
        .datetime()
        .test('2020-02-30T11:03:14.071Z')
    ).toBeFalsy();

    // Invalid time
    expect(
      v8n()
        .datetime()
        .test('2020-02-30T11:63:14.071Z')
    ).toBeFalsy();

    // Invalid date
    expect(
      v8n()
        .datetime()
        .test('2020-02230T11:63:14.071Z')
    ).toBeFalsy();

    // No timezone
    expect(
      v8n()
        .datetime()
        .test('2020-01-12T11:03:14.071')
    ).toBeFalsy();

    // Valid date but in a different ISO format
    expect(
      v8n()
        .datetime()
        .test('1994-11-05T08:15:30-05:00')
    ).toBeFalsy();

    // Invalid date-only format
    expect(
      v8n()
        .datetime()
        .test('1994-11-05')
    ).toBeFalsy();
  });

  test('unique', () => {
    expect(
      v8n()
        .unique()
        .test([])
    ).toBeTruthy();

    expect(
      v8n()
        .unique()
        .test(['a', 'b', 'c'])
    ).toBeTruthy();

    expect(
      v8n()
        .unique()
        .test(['a', 'a', 'b'])
    ).toBeFalsy();

    expect(
      v8n()
        .unique()
        .test([
          { a: 'a', b: 'b' },
          { a: 'c', b: 'b' },
        ])
    ).toBeTruthy();

    expect(
      v8n()
        .unique('a')
        .test([
          { a: 'a', b: 'b' },
          { a: 'c', b: 'b' },
        ])
    ).toBeTruthy();

    expect(
      v8n()
        .unique('b')
        .test([
          { a: 'a', b: 'b' },
          { a: 'c', b: 'b' },
        ])
    ).toBeFalsy();

    expect(
      v8n()
        .unique('a.c')
        .test([
          { a: { c: 'd' }, b: 'b' },
          { a: { c: 'd' }, b: 'b' },
        ])
    ).toBeFalsy();
  });

  test('id', () => {
    expect(
      v8n()
        .id()
        .test('')
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test(null)
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test(12345)
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test({})
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test([])
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test('hey')
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test('0b480e2a-b30c-4548-8cbc-882b9d48e2fe-somemore')
    ).toBeFalsy();
    expect(
      v8n()
        .id()
        .test('0b480e2a-b30c-4548-8cbc-882b9d48e2fe')
    ).toBeTruthy();
  });

  test('hexColor', () => {
    expect(
      v8n()
        .hexColor()
        .test('')
    ).toBeFalsy();
    expect(
      v8n()
        .hexColor()
        .test(null)
    ).toBeFalsy();
    expect(
      v8n()
        .hexColor()
        .test(12345)
    ).toBeFalsy();
    expect(
      v8n()
        .hexColor()
        .test('#123')
    ).toBeFalsy();
    expect(
      v8n()
        .hexColor()
        .test('#hhy')
    ).toBeFalsy();
    expect(
      v8n()
        .hexColor()
        .test('#abc')
    ).toBeFalsy();
    expect(
      v8n()
        .hexColor()
        .test('#123456')
    ).toBeTruthy();
    expect(
      v8n()
        .hexColor()
        .test('#abcdef')
    ).toBeTruthy();
    expect(
      v8n()
        .hexColor()
        .test('#aaaaaa')
    ).toBeTruthy();
    expect(
      v8n()
        .hexColor()
        .test('#000000')
    ).toBeTruthy();
    expect(
      v8n()
        .hexColor()
        .test('#ffffff')
    ).toBeTruthy();
  });
});

const sampleSchema = {
  name: v8n()
    .string()
    .maxLength(511),
  country: v8n()
    .string()
    .maxLength(255),
  region: v8n().optional(
    v8n()
      .string()
      .maxLength(255),
    true
  ),
  numberOfOffices: v8n().between(1, 50),
  addresses: v8n().optional(
    v8n().every.schema({
      street: v8n()
        .string()
        .maxLength(63),
      apartment: v8n()
        .string()
        .maxLength(63),
    })
  ),
  // Here min and max applies to the array length
  employeeNames: v8n()
    .every.string()
    .minLength(4)
    .maxLength(8),
  // Here min and max applies to each element in the array
  phoneNumbers: v8n()
    .every.string()
    .every.minLength(4)
    .every.maxLength(8),
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
    expect(err?.message).toContain('1');
    expect(err?.message).toContain('50');
    expect(err?.args).toContain(1);
    expect(err?.args).toContain(50);
  });
});
