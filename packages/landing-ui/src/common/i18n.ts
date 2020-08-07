import NextI18Next from 'next-i18next';
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
