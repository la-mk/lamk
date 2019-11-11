import v8n from 'v8n';

type Primitive = string | boolean | number;

export const extendValidation = () => {
  v8n.extend({
    oneOf: (expected: Array<Primitive>) => (value: Primitive) => expected.includes(value),
  });
} 