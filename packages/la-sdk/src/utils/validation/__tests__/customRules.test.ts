import Ajv from 'ajv';
import { keywords, formats } from '../customRules';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
keywords.forEach(keyword => ajv.addKeyword(keyword));
formats.forEach(format => ajv.addFormat(format.name, format.format));

describe('Custom formats', () => {
  // The tests are sparse as this is a built-in format and it should just work.
  test('email', () => {
    const emailValidator = ajv.compile({
      type: 'string',
      format: 'email',
    });

    expect(emailValidator('some@email.com')).toBeTruthy();
    expect(emailValidator('somenotemail')).toBeFalsy();
  });

  test('date', () => {
    const datetimeValidator = ajv.compile({
      type: 'string',
      format: 'date-time',
    });

    // Valid date
    expect(datetimeValidator('2020-01-12T11:03:14.071Z')).toBeTruthy();
    // Valid leap year
    expect(datetimeValidator('2020-02-29T11:03:14.071Z')).toBeTruthy();
    // Invalid leap year
    expect(datetimeValidator('2020-02-30T11:03:14.071Z')).toBeFalsy();
    // Invalid time
    expect(datetimeValidator('2020-02-30T11:63:14.071Z')).toBeFalsy();
    // Invalid date
    expect(datetimeValidator('2020-02230T11:63:14.071Z')).toBeFalsy();
    // No timezone
    expect(datetimeValidator('2020-01-12T11:03:14.071')).toBeTruthy();
    // Non-T separator
    expect(datetimeValidator('2020-01-12 11:03:14.071Z')).toBeTruthy();
    // Valid date but in a different ISO format
    expect(datetimeValidator('1994-11-05T08:15:30-05:00')).toBeTruthy();
    // Invalid date-only format
    expect(datetimeValidator('1994-11-05')).toBeFalsy();
  });

  test('unique', () => {
    const nestedValidator = ajv.compile({
      type: 'array',
      items: {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: {
            type: 'string',
          },
          b: {
            type: 'string',
          },
        },
      },
      uniqueOn: '/a',
    });

    const deepNestedValidator = ajv.compile({
      type: 'array',
      items: {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: {
            type: 'object',
            properties: {
              c: {
                type: 'string',
              },
            },
          },
          b: {
            type: 'string',
          },
        },
      },
      uniqueOn: '/a/c',
    });

    const shallowNestedValidator = ajv.compile({
      type: 'array',
      items: {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: {
            type: 'object',
            properties: {
              c: {
                type: 'string',
              },
            },
          },
          b: {
            type: 'string',
          },
        },
      },
      uniqueOn: '/a',
    });

    const builtinValidator = ajv.compile({
      type: 'array',
      items: {
        type: 'string',
      },
      uniqueItems: true,
    });

    expect(nestedValidator([])).toBeTruthy();
    expect(builtinValidator(['a', 'b', 'c'])).toBeTruthy();
    expect(builtinValidator(['a', 'b', 'b'])).toBeFalsy();
    expect(
      nestedValidator([
        { a: 'a', b: 'b' },
        { a: 'c', b: 'b' },
      ])
    ).toBeTruthy();

    expect(
      nestedValidator([
        { a: 'a', b: 'b' },
        { a: 'a', b: 'c' },
      ])
    ).toBeFalsy();

    expect(
      nestedValidator([
        { a: 'a', b: 'b' },
        { a: 'a', b: 'c' },
      ])
    ).toBeFalsy();

    expect(
      deepNestedValidator([
        { a: { c: 'd' }, b: 'b' },
        { a: { c: 'e' }, b: 'b' },
      ])
    ).toBeTruthy();

    expect(
      deepNestedValidator([
        { a: { c: 'd' }, b: 'b' },
        { a: { c: 'd' }, b: 'b' },
      ])
    ).toBeFalsy();

    expect(
      shallowNestedValidator([
        { a: { c: 'd' }, b: 'b' },
        { a: { c: 'e' }, b: 'b' },
      ])
    ).toBeTruthy();

    expect(
      shallowNestedValidator([
        { a: { c: 'd' }, b: 'b' },
        { a: { c: 'd' }, b: 'b' },
      ])
    ).toBeFalsy();
  });

  test('equalSchema', () => {
    const rootValidator = ajv.compile({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a: {
            type: ['string', 'null'],
          },
          b: {
            type: ['string', 'null'],
          },
        },
      },
      equalSchema: '',
    });

    const nestedValidator = ajv.compile({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          c: {
            type: 'object',
            properties: {
              a: {
                type: 'string',
              },
              b: {
                type: 'string',
              },
            },
          },
        },
      },
      equalSchema: '/c',
    });

    expect(
      rootValidator([
        { a: 'c', b: 'b' },
        { a: 'c', b: 'b' },
      ])
    ).toBeTruthy();
    expect(
      rootValidator([
        { a: 'd', b: 'b' },
        { a: 'c', b: 'b' },
      ])
    ).toBeTruthy();
    expect(rootValidator([{ a: 'd', b: 'b' }, {}])).toBeFalsy();
    expect(rootValidator([{ a: 'd' }, { b: 'c' }])).toBeFalsy();
    expect(rootValidator([])).toBeTruthy();
    expect(rootValidator([{ a: null }, {}])).toBeTruthy();
    expect(
      nestedValidator([{ c: { a: 'd', b: 'b' } }, { c: { a: 'c', b: 'b' } }])
    ).toBeTruthy();
    expect(
      nestedValidator([{ c: { a: 'd' } }, { c: { a: 'c', b: 'b' } }])
    ).toBeFalsy();
    expect(
      nestedValidator([{ c: { a: 'd', b: 'b' } }, { c: { a: 'c' } }])
    ).toBeFalsy();
    expect(
      nestedValidator([{ c: { a: 'd' } }, { c: { a: 'b' } }])
    ).toBeTruthy();
    expect(nestedValidator([{ c: { a: 'd' } }, { c: { b: 'b' } }])).toBeFalsy();
  });

  test('uuid', () => {
    const uuidValidator = ajv.compile({
      type: 'string',
      format: 'uuid',
    });

    expect(uuidValidator('')).toBeFalsy();
    expect(uuidValidator(null)).toBeFalsy();
    expect(uuidValidator(12345)).toBeFalsy();
    expect(uuidValidator({})).toBeFalsy();
    expect(uuidValidator([])).toBeFalsy();
    expect(uuidValidator('hey')).toBeFalsy();
    expect(
      uuidValidator('0b480e2a-b30c-4548-8cbc-882b9d48e2fe-somemore')
    ).toBeFalsy();
    expect(uuidValidator('0b480e2a-b30c-4548-8cbc-882b9d48e2fe')).toBeTruthy();
    expect(uuidValidator('0b480e2ab30c45488cbc882b9d48e2fe')).toBeFalsy();
  });

  test('hexColor', () => {
    const hexColorValidator = ajv.compile({
      type: 'string',
      format: 'hexColor',
    });

    expect(hexColorValidator('')).toBeFalsy();
    expect(hexColorValidator(null)).toBeFalsy();
    expect(hexColorValidator(12345)).toBeFalsy();
    expect(hexColorValidator('#123')).toBeFalsy();
    expect(hexColorValidator('#hhy')).toBeFalsy();
    expect(hexColorValidator('#abc')).toBeFalsy();
    expect(hexColorValidator('#123456')).toBeTruthy();
    expect(hexColorValidator('#abcdef')).toBeTruthy();
    expect(hexColorValidator('#aaaaaa')).toBeTruthy();
    expect(hexColorValidator('#000000')).toBeTruthy();
    expect(hexColorValidator('#ffffff')).toBeTruthy();
  });
});
