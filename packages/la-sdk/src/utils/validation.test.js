const _ = require('lodash/fp');
const {extendValidation} = require('../../dist/utils/validation');
const v8n = require('v8n');

describe('Custom validators', () => {
  beforeAll(() => {
    extendValidation();
  })

  test('oneOf', () => {
    expect(v8n().oneOf(['a', 'b']).test('a')).toBeTruthy();
    expect(v8n().oneOf(['a', 'b']).test('b')).toBeTruthy();
    expect(v8n().oneOf([1, 2]).test(1)).toBeTruthy();
    expect(v8n().oneOf([true, false]).test(true)).toBeTruthy();
    
    expect(v8n().oneOf(['a', 'b']).test('c')).toBeFalsy();
    expect(v8n().oneOf([]).test('a')).toBeFalsy();
    expect(v8n().oneOf([]).test('a')).toBeFalsy();
    expect(v8n().oneOf([1, 2]).test('a')).toBeFalsy();
  });
});