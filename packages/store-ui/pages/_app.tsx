import React from 'react';
import App from 'next/app';
import { default as NextHead } from 'next/head';
import { Provider as ThemeProvider, Empty } from '@sradevski/blocks-ui';
import { Provider as ReduxProvider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { ConnectedRouter } from 'connected-next-router';
import configureStore from '../src/state/configureStore';
import { StoreLayout } from '../src/common/pageComponents/StoreLayout';
import { setStore } from '../src/state/modules/store/store.module';
import { AuthModal } from '../src/components/signup/AuthModal';
import { sdk, setupSdk } from '@sradevski/la-sdk';
import env from '../src/common/env';
import { getStore } from '../src/state/modules/store/store.selector';
import { appWithTranslation, useTranslation } from '../src/common/i18n';
import 'antd/dist/antd.less';
import mk_MK from 'antd/lib/locale/mk_MK';
import { I18n } from 'next-i18next';

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

// TODO: Cache heavily for a long period.
const getSlugForCustomDomain = async (host: string) => {
  const laStoreResult = await sdk.store.find({ query: { customDomain: host } });
  if (laStoreResult.total === 0) {
    throw new Error('Store not found');
  }

  if (laStoreResult.total > 1) {
    console.error(`Multiple stores with the domain ${host} found`);
    throw new Error('Found multiple stores with the same domain.');
  }

  return laStoreResult.data[0];
};

const getStoreFromHost = (host: string) => {
  const tld = host.substr(host.indexOf('.'), host.indexOf('/'));
  const serverTld = env.API_ENDPOINT.substr(env.API_ENDPOINT.indexOf('.') + 1);
  if (tld !== serverTld) {
    return getSlugForCustomDomain(host);
  }

  const slug = host.substr(0, host.indexOf('.'));
  if (!slug) {
    throw new Error('Store not found');
  }

  return sdk.store.getBySlug(slug).catch(err => {
    console.log(err);
    return null;
  });
};

const setInitialDataInState = async (appCtx: any) => {
  // If it is SSR, fetch the store information, otherwise it should be in redux already
  if (appCtx.ctx.req) {
    const host: string = appCtx.ctx.req.headers.host;
    if (!host) {
      throw new Error('Store request misconfigured');
    }

    const laStore = await getStoreFromHost(host);
    appCtx.ctx.store.dispatch(setStore(laStore));
  }
};

const Main = ({ store, children }) => {
  const { t, i18n } = useTranslation();
  return (
    <ThemeProvider
      basicLocale={i18n.language === 'mk' ? mk_MK : undefined}
      compoundLocale={getCompoundLocale(t)}
    >
      <ReduxProvider store={store}>
        <ConnectedRouter>
          <StoreLayout>
            <>
              {children}
              <AuthModal />
            </>
          </StoreLayout>
        </ConnectedRouter>
      </ReduxProvider>
    </ThemeProvider>
  );
};

class MyApp extends App<{ store: any; i18nServerInstance: I18n }> {
  static async getInitialProps(appCtx: any) {
    // You need to set the initial state before doing `getInitialProps`, otherwise the individual pages won't have access to the initial state.
    await setInitialDataInState(appCtx);
    const appProps = await App.getInitialProps(appCtx);
    return appProps;
  }

  render() {
    const { Component, pageProps, store, i18nServerInstance } = this.props;
    const laStore = getStore(store.getState());

    // This makes sure the sdk is available on the client-side as well.
    if (!sdk) {
      setupSdk({
        transport: 'rest',
        apiEndpoint: env.API_ENDPOINT,
        imagesEndpoint: env.ARTIFACTS_ENDPOINT,
      });
    }

    return (
      <>
        {laStore && (
          <NextHead>
            <link
              rel='shortcut icon'
              href={sdk.artifact.getUrlForArtifact(laStore.logo, laStore._id)}
            />
          </NextHead>
        )}
        <Main store={store}>
          {laStore ? (
            <Component {...pageProps} />
          ) : (
            <Empty description='Store not found'></Empty>
          )}
        </Main>
      </>
    );
  }
}

// We initialize the redux store, which will add the `store` prop to the context object.
export default withRedux((initialState, options) =>
  configureStore(process.env.NODE_ENV, initialState, options),
)(appWithTranslation(MyApp));
