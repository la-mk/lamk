import NextI18Next from 'next-i18next';
import { ProductSetTag } from '@sradevski/la-sdk/dist/models/product';

export const NextI18NextInstance = new NextI18Next({
  defaultNS: 'translation',
  lng: 'mk',
  defaultLanguage: 'mk',
  otherLanguages: ['en'],
  localePath: 'public/locales',
});

/* Optionally, export class methods as named exports */
export const {
  appWithTranslation,
  useTranslation,
  withTranslation,
} = NextI18NextInstance;

export const getTitleForSet = (setTag: ProductSetTag) => {
  switch (setTag.name) {
    case 'category':
      return `categories.${setTag.value}`;
    default:
      return `sets.${setTag.name}`;
  }
};

export const getSubtitleForSet = (setTag: ProductSetTag) => {
  switch (setTag.name) {
    case 'category':
      return `sets.categoryExplanation`;
    default:
      return `sets.${setTag.name}Explanation`;
  }
};
