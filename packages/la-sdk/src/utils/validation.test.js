const { extendValidation } = require('../../dist/utils/validation');
const v8n = require('v8n');

describe('Custom validators', () => {
  beforeAll(() => {
    extendValidation();
  });

  test('oneOf', () => {
    expect(
      v8n()
        .oneOf(['a', 'b'])
        .test('a'),
    ).toBeTruthy();
    expect(
      v8n()
        .oneOf(['a', 'b'])
        .test('b'),
    ).toBeTruthy();
    expect(
      v8n()
        .oneOf([1, 2])
        .test(1),
    ).toBeTruthy();
    expect(
      v8n()
        .oneOf([true, false])
        .test(true),
    ).toBeTruthy();

    expect(
      v8n()
        .oneOf(['a', 'b'])
        .test('c'),
    ).toBeFalsy();
    expect(
      v8n()
        .oneOf([])
        .test('a'),
    ).toBeFalsy();
    expect(
      v8n()
        .oneOf([])
        .test('a'),
    ).toBeFalsy();
    expect(
      v8n()
        .oneOf([1, 2])
        .test('a'),
    ).toBeFalsy();
  });

  // The tests are sparse as the regex used is already well tested and there is no need to repeat it here.
  test('email', () => {
    expect(
      v8n()
        .email()
        .test('some@email.com'),
    ).toBeTruthy();

    expect(
      v8n()
        .email()
        .test('somenotemail'),
    ).toBeFalsy();
  });

  test('date', () => {
    // Valid date
    expect(
      v8n()
        .datetime()
        .test('2020-01-12T11:03:14.071Z'),
    ).toBeTruthy();

    // Valid leap year
    expect(
      v8n()
        .datetime()
        .test('2020-02-29T11:03:14.071Z'),
    ).toBeTruthy();

    // Invalid leap year
    expect(
      v8n()
        .datetime()
        .test('2020-02-30T11:03:14.071Z'),
    ).toBeFalsy();

    // Invalid time
    expect(
      v8n()
        .datetime()
        .test('2020-02-30T11:63:14.071Z'),
    ).toBeFalsy();

    // Invalid date
    expect(
      v8n()
        .datetime()
        .test('2020-02230T11:63:14.071Z'),
    ).toBeFalsy();

    // No timezone
    expect(
      v8n()
        .datetime()
        .test('2020-01-12T11:03:14.071'),
    ).toBeFalsy();

    // Valid date but in a different ISO format
    expect(
      v8n()
        .datetime()
        .test('1994-11-05T08:15:30-05:00'),
    ).toBeFalsy();

    // Invalid date-only format
    expect(
      v8n()
        .datetime()
        .test('1994-11-05'),
    ).toBeFalsy();
  });
});
