import i18n, { TFunction } from 'i18next';
import i18nBackend from 'i18next-fs-backend';

export let t: TFunction;

export const initializeI18n = async () => {
  t = await i18n.use(i18nBackend).init({
    lng: 'mk',
    fallbackLng: 'en',
    preload: ['mk', 'en'],
    debug: false,
    backend: {
      loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
    },
  });

  return i18n;
};
