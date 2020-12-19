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
import { env } from './common/env';
import { useTranslation } from 'react-i18next';
import 'antd/dist/antd.min.css';

const getCompoundLocale = (t: (key: string) => string) => {
  return {
    firstName: t('common.firstName'),
    lastName: t('common.lastName'),
    phoneNumber: t('common.phoneNumber'),
    email: t('common.email'),
    password: t('common.password'),
    currentPassword: t('common.currentPassword'),
    newPassword: t('common.newPassword'),
    forgotPassword: t('auth.forgotPassword'),
    forgotPasswordExplanation: t('auth.forgotPasswordExplanation'),
    resetPassword: t('auth.resetPassword'),
    resetPasswordExplanation: t('auth.resetPasswordExplanation'),
    sendPasswordResetLink: t('actions.sendPasswordResetLink'),
    loginInstead: t('actions.loginInstead'),
    forgotPasswordSuccess: t('auth.forgotPasswordSuccess'),
    forgotPasswordSuccessExplanation: t(
      'auth.forgotPasswordSuccessExplanation',
    ),
    signup: t('auth.signup'),
    login: t('auth.login'),
    or: t('common.or'),
    authSameAccount: t('auth.authSameAccount'),
    update: t('actions.update'),
    upload: t('actions.add'),
    uploadHint: t('uploads.hint'),
  };
};

const store = configureStore(env.NODE_ENV);

export const App = () => {
  const { t } = useTranslation();
  const compoundLocale = getCompoundLocale(t);

  const onBeforeLift = () => {
    setupSdk({
      transport: 'socket',
      apiEndpoint: env.API_ENDPOINT,
      imagesEndpoint: env.ARTIFACTS_ENDPOINT,
      imagesProxyEndpoint: env.IMAGES_PROXY_ENDPOINT,
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
          theme={{
            colors: { primary: '#118AB2' },
          }}
          translations={compoundLocale}
        >
          <ConnectedRouter history={history}>
            <Root />
          </ConnectedRouter>
        </BlocksUiProvider>
      </PersistGate>
    </Provider>
  );
};
