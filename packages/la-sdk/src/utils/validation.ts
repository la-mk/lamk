import v8n from 'v8n';

type Primitive = string | boolean | number;

export const extendValidation = () => {
  v8n.extend({
    oneOf: (expected: Array<Primitive>) => (value: Primitive) =>
      expected.includes(value),
    // Regex source: https://github.com/sindresorhus/email-regex but no need to add it as another dependency
    email: () => (value: string) => {
      const regex =
        '[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*';
      const tester = new RegExp(`^${regex}$`);
      return tester.test(value);
    },
  });
};
