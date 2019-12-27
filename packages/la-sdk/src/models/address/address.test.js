const SDK = require('../../../dist/index');

// const sampleAddress = {
//   addressFor: 'uuid',
//   name: 'John Doe',
//   country: 'Japan',
//   region: 'Kansai',
//   city: 'Osaka',
//   zip: '630-0001',
//   street: 'Isoji 3',
//   phoneNumber: '080-1234-3231',
// }

describe('Address validation', () => {
  beforeAll(() => {
    SDK.setupSdk({
      transport: 'socket',
      apiEndpoint: 'http://localhost:3000',
    });
  });

  test('Test', () => {
    expect(false).toBeFalsy();
  });
});
