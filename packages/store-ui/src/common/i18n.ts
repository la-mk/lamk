import NextI18Next from 'next-i18next';

export const NextI18NextInstance = new NextI18Next({
  defaultNS: 'translation',
  lng: 'mk',
  defaultLanguage: 'mk',
  otherLanguages: ['en'],
});

/* Optionally, export class methods as named exports */
export const {
  appWithTranslation,
  useTranslation,
  withTranslation,
} = NextI18NextInstance;
