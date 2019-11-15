const _ = require('lodash/fp');
const modelUtils = require('../../dist/utils/modelUtils');
const v8n = require('v8n');

const sampleSchema = {
  name: v8n().string().maxLength(511),
  country: v8n().string().maxLength(255),
  region: v8n().optional(v8n().string().maxLength(255), true),
  numberOfOffices: v8n().between(1, 50),
  addresses: v8n().optional(v8n().every.schema({
    street: v8n().string().maxLength(63),
    apartment: v8n().string().maxLength(63),
  })),
}

const sampleData = {
  name: 'John Doe',
  country: 'Japan',
  region: 'Kansai',
  numberOfOffices: 3,
  addresses: [{
    street: "Isoji",
    apartment: "Avanzare"
  },
  {
    street: "Wakayama",
    apartment: "Pure Country"
  }]
}

describe('Validation utility', () => {
  test('Should pass when a valid object is passed', () => {
    expect(modelUtils.validate(sampleSchema, sampleData)).toBeFalsy();
  });

  test('Should pass when an optional field is passed a trimmed string', () => {
    expect(modelUtils.validate(sampleSchema, { ...sampleData, region: '  ' })).toBe(null)
  });

  test('Should pass when required should be ignored and object is empty', () => {
    expect(modelUtils.validate(sampleSchema, {}, true)).toBeFalsy();
  });

  test('Should return an error when required should be ignored and a required property has invalid value', () => {
    expect(modelUtils.validate(sampleSchema, {country: 123}, true)).toHaveProperty('country');
    expect(modelUtils.validate(sampleSchema, {country: 123}, true)['country']['name']).toBe('string')
  });

  test('Should return an error if at least one required property is not passed', () => {
    expect(modelUtils.validate(sampleSchema, { ...sampleData, name: undefined })).toHaveProperty('name')
  });

  test('Should return an error per invalid field', () => {
    expect(Object.keys(modelUtils.validate(sampleSchema, {}))).toHaveLength(3)
    expect(modelUtils.validate(sampleSchema, {})).toHaveProperty('name')
    expect(modelUtils.validate(sampleSchema, {})).toHaveProperty('country')
    expect(modelUtils.validate(sampleSchema, {})).toHaveProperty('numberOfOffices')
  });

  test('Should return an error from an array of objects', () => {
    expect(modelUtils.validate(sampleSchema, { ...sampleData, addresses: [{ street: 'No apartment' }] })).toHaveProperty('addresses')
  });

  test('Should return the true validation error on an optional field', () => {
    expect(modelUtils.validate(sampleSchema, { ...sampleData, region: 123 }).region.name).toBe('string')
  });

  test('Should return the violated parameter values in a parametrized validator', () => {
    const err = modelUtils.validate(sampleSchema, { ...sampleData, numberOfOffices: 123 }).numberOfOffices;
    expect(err.message).toContain('1');
    expect(err.message).toContain('50');
    expect(err.args).toContain(1);
    expect(err.args).toContain(50);
  });
});