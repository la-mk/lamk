import set from 'lodash/set';
import unset from 'lodash/unset';
import get from 'lodash/get';

// Converts a json pointer selector to array-split selector.
export const toArrayPath = (jsonPointer: string) =>
  jsonPointer ? jsonPointer.slice(1).split('/') : [];

export const pick = (schema: any, selectors: string[]) => {
  const res = { ...schema, properties: {}, required: [] };
  selectors.forEach(selector => {
    set(res, `properties.${selector}`, get(schema.properties, selector));
  });
  res.required = schema.required.filter((requiredField: any) =>
    selectors.includes(requiredField)
  );

  return res;
};

export const omit = (schema: any, selectors: string[]) => {
  const res = { ...schema, properties: { ...schema.properties }, required: [] };
  selectors.forEach(selector => {
    unset(res, `properties.${selector}`);
  });

  res.required = schema.required.filter(
    (requiredField: any) => !selectors.includes(requiredField)
  );

  return res;
};
