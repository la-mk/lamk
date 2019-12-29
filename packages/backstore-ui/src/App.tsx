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

const getCompoundLocale = (t: (key: string) => string) => {
  return {
    email: t('common.email'),
    password: t('common.password'),
    signup: t('auth.signup'),
    login: t('auth.login'),
    noAccount: t('auth.noAccount'),
    alreadyHaveAccount: t('auth.alreadyHaveAccount'),
  };
};

export const App = () => {
  const store = configureStore(env.NODE_ENV);
  const { t } = useTranslation();
  const compoundLocale = getCompoundLocale(t);

  const onBeforeLift = () => {
    setupSdk({
      transport: 'socket',
      apiEndpoint: env.API_ENDPOINT,
    });
  };

  return (
    <Provider store={store.store}>
      <PersistGate
        loading={<FullScreenSpinner />}
        onBeforeLift={onBeforeLift}
        persistor={store.persistor}
      >
        <BlocksUiProvider compoundLocale={compoundLocale}>
          <ConnectedRouter history={history}>
            <Root />
          </ConnectedRouter>
        </BlocksUiProvider>
      </PersistGate>
    </Provider>
  );
};
