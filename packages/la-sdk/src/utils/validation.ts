import v8n from 'v8n';

type Primitive = string | boolean | number;

const extendValidation = () => {
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
    // We check if the string is a valid ISO date
    datetime: () => (value: string) => {
      const parsed = Date.parse(value);
      if (isNaN(parsed)) {
        return false;
      }

      // We strictly check if the string date passed is in the ISO format toISOString returns.
      return value === new Date(parsed).toISOString();
    },
  });
};

extendValidation();