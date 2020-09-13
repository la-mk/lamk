import { getEmailTemplate } from '../templateProcessor';

describe('email templates', () => {
  it('can render a reset password template', async () => {
    const resetEmail = await getEmailTemplate('reset-password', {
      storeName: 'Demo',
      storeUrl: 'https://demo.la.mk',
      resetLink: 'https://demo.la.mk/account/resetPassword?resetToken=23456',
    });

    expect(resetEmail.includes('https://demo.la.mk')).toBeTruthy();
    expect(resetEmail).toMatchSnapshot();
  });
});
