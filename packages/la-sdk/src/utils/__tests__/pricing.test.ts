import * as pricing from '../pricing';

const productFixture = {
  price: 200,
  discount: 100,
}

// const cartItemFixture = {

// }

// const orderItemFixture = {

// }

// const deliveryFixture = {

// }

// const campaignFixture = {

// }

describe('calculateProductPrice utility', () => {
  test('calculates value correctly without discount', () => {
    expect(pricing.calculateProductPrice({...productFixture, discount: undefined})).toBe(200);
  });

  test('calculates value correctly with discount', () => {
    expect(pricing.calculateProductPrice(productFixture)).toBe(100);
  });
});

// describe('calculatePrices utility', () => {
//   test('calculates value correctly without discount', () => {
//     expect(pricing.calculatePrices()).toBe(200);
//   });
// });
