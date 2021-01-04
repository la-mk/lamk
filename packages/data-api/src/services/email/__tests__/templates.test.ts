import { getEmailTemplate } from '../templateProcessor';
import setup from '../../../server/server';
import { sdk } from '@la-mk/la-sdk';

describe('email templates', () => {
  beforeAll(async () => {
    await setup();
  });

  it('can render a reset password template', async () => {
    const resetEmail = await getEmailTemplate('reset-password', {
      storeName: 'Demo',
      storeUrl: 'https://demo.la.mk',
      resetLink: 'https://demo.la.mk/account/resetPassword?resetToken=23456',
    });

    expect(resetEmail.includes('https://demo.la.mk')).toBeTruthy();
    expect(resetEmail).toMatchSnapshot();
  });

  it('can render an order success template', async () => {
    const templateData = {
      storeName: 'Demo',
      storeUrl: 'https://demo.la.mk',
      storeLogoUrl: 'https://la.mk/logo-horizontal.svg',
      seeOrderLink: `https://demo.la.mk/orders`,
      deliveryMethod: sdk.delivery.DeliveryMethods.CARGO_PICKUP,
      paymentMethod: sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
      subtotal: 1200,
      campaignDiscount: 130,
      shippingCost: 230,
      total: 1300,
      deliverTo: {
        addressFor: '123456',
        name: 'Test',
        country: 'MK',
        region: 'Bitola',
        city: 'Bitola',
        zip: '7000',
        street: 'Solunska 43',
        person: 'John',
        phoneNumber: '5665432',
      },
      currency: 'ден',
    };

    const resetEmail = await getEmailTemplate('order-success', templateData);

    expect(resetEmail.includes('https://demo.la.mk')).toBeTruthy();
    expect(resetEmail).toMatchSnapshot();
  });
});
