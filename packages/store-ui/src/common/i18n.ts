import NextI18Next from 'next-i18next';
import { ProductSet } from '@la-mk/la-sdk/dist/models/product';
import path from 'path';

export const NextI18NextInstance = new NextI18Next({
  defaultNS: 'translation',
  lng: 'mk',
  defaultLanguage: 'mk',
  otherLanguages: ['en'],
  localePath: path.resolve('./public/locales'),
});

/* Optionally, export class methods as named exports */
export const {
  appWithTranslation,
  useTranslation,
  withTranslation,
} = NextI18NextInstance;

export const getTitleForSet = (setTag: Pick<ProductSet, 'type' | 'value'>) => {
  switch (setTag.type) {
    case 'category':
      return `categories.${setTag.value}`;
    default:
      return `chosenSets.${setTag.type}`;
  }
};

export const getSubtitleForSet = (
  setTag: Pick<ProductSet, 'type' | 'value'>,
) => {
  switch (setTag.type) {
    case 'category':
      return `chosenSets.categoryExplanation`;
    default:
      return `chosenSets.${setTag.type}Explanation`;
  }
};
