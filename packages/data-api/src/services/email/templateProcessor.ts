import * as _ from 'lodash';
import mjml2html from 'mjml';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { t } from '../../common/i18n';

interface Templates {
  'reset-password'?: string;
  'order-success'?: string;
}

const getTranslationsForTemplate = (
  templateName: keyof Templates,
  context: any,
) => {
  switch (templateName) {
    // storeName, storeUrl, resetLink
    case 'reset-password': {
      return {
        tResetYourPassword: t('auth.resetPassword'),
        tAskedResetPasswordOn: t('auth.askedResetPasswordOn'),
        tStoreEnabledBy: t('store.storeEnabledBy').toLowerCase(),
        tResetPassword: t('actions.resetPassword'),
        tDidntAskResetExplanation: t('auth.didntAskResetExplanation'),
      };
    }

    // storeName, storeUrl, seeOrderLink, deliveryMethod, paymentMethod, subtotal, campaignDiscount, shippingCost, total, deliverTo (country, city, zip, street, person), currency
    case 'order-success': {
      return {
        tOrderSuccess: t('cart.orderSuccess'),
        tOrderSuccessExplanation: t('cart.orderSuccessExplanation'),
        tSeeOrder: t('order.seeOrder'),

        tYourOrderFrom: t('emails.yourOrderFrom'),
        tWasSuccessful: t('emails.orderWasSuccessful'),

        tSummary: t('common.summary'),

        tSubtotal: t('finance.subtotal'),
        tCampaignDiscount: t('finance.campaignDiscount'),
        tShippingCost: t('finance.shippingCost'),
        tTotal: t('finance.total'),

        tShippingAddress: t('address.shippingAddress'),
        tDeliveryMethod: t('delivery.deliveryMethod'),
        tPaymentMethod: t('payment.paymentMethod'),

        tDeliveryMethodName: t(`deliveryMethods.${context.deliveryMethod}`),
        tPaymentMethodName: t(`paymentMethodNames.${context.paymentMethod}`),

        tCountryName: t('countries.mk'),
      };
    }
  }
};

// Moustashe {{}} syntax
const interpolate = /{{([\s\S]+?)}}/g;

let templates: Templates | undefined;

// Load and cache the compiled templates
const loadTemplates = async () => {
  const dirName = path.join(process.cwd(), 'assets/templates');
  const filenames = await fs.promises.readdir(dirName);
  const res: Templates = {};

  await Promise.all(
    filenames.map(async filename => {
      if (!filename.endsWith('.mjml')) {
        return;
      }

      const mjmsTemplate = (
        await fs.promises.readFile(path.join(dirName, filename))
      ).toString('utf-8');

      const mjmlOutput = mjml2html(mjmsTemplate, {
        keepComments: false,
        minify: true,
      });
      if (mjmlOutput.errors.length) {
        throw new Error(mjmlOutput.errors[0].formattedMessage);
      }

      // remove extension
      res[filename.split('.')[0] as keyof Templates] = mjmlOutput.html;
    }),
  );

  return res;
};

export const getEmailTemplate = async (
  templateName: keyof Templates,
  data: any,
) => {
  if (!templates) {
    templates = await loadTemplates();
  }

  if (!templates[templateName]) {
    throw new Error(`${templateName} template not found.`);
  }

  const executeTemplate = _.template(templates[templateName], {
    interpolate,
  });

  const translations = getTranslationsForTemplate(templateName, data);

  return executeTemplate({ ...data, ...translations });
};
