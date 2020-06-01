import React from 'react';
import { Provider } from 'react-redux';
// @ts-ignore
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider as BlocksUiProvider } from '@sradevski/blocks-ui';
import { setupSdk } from '@sradevski/la-sdk';
import { ConnectedRouter } from 'connected-react-router';
import { Root } from './components/Root';
import { FullScreenSpinner } from './components/shared/components/FullScreenSpinner';
import configureStore, { history } from './state/configureStore';
import env from './common/env';
import { useTranslation } from 'react-i18next';
import mk_MK from 'antd/es/locale/mk_MK';

const getCompoundLocale = (t: (key: string) => string) => {
  return {
    email: t('common.email'),
    password: t('common.password'),
    signup: t('auth.signup'),
    login: t('auth.login'),
    or: t('common.or'),
    authSameAccount: t('auth.authSameAccount'),
  };
};

const store = configureStore(env.NODE_ENV);

export const App = () => {
  const { t, i18n } = useTranslation();
  const compoundLocale = getCompoundLocale(t);

  const onBeforeLift = () => {
    setupSdk({
      transport: 'socket',
      apiEndpoint: env.API_ENDPOINT,
      imagesEndpoint: env.ARTIFACTS_ENDPOINT,
    });
  };

  return (
    <Provider store={store.store}>
      <PersistGate
        loading={<FullScreenSpinner />}
        onBeforeLift={onBeforeLift}
        persistor={store.persistor}
      >
        <BlocksUiProvider
          theme={{ fontSizes: [12, 14, 16, 18, 20, 26, 34, 48] }}
          basicLocale={i18n.language === 'mk' ? mk_MK : undefined}
          compoundLocale={compoundLocale}
        >
          <ConnectedRouter history={history}>
            <Root />
          </ConnectedRouter>
        </BlocksUiProvider>
      </PersistGate>
    </Provider>
  );
};
