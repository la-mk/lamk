import React from 'react';
import App from 'next/app';
import { default as NextHead } from 'next/head';
import { Provider as ThemeProvider, hooks, theme } from '@sradevski/blocks-ui';
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
import memoize from 'mem';
import { initializeAnalytics } from '../src/common/analytics';
import { BrandColorWrapper } from '../src/common/antdOverride/BrandColorWrapper';
import { getTheme } from '../src/common/theme';
import { StoreNotFound } from '../src/common/pageComponents/StoreNotFound';

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

// Cache for 30 min, since custom domain will very rarely change.
const memoizedGetSlugForCustomDomain = memoize(getSlugForCustomDomain, {
  maxAge: 30 * 60 * 1000,
});

const stripWww = (host: string) => {
  if (host.startsWith('www')) {
    return host.substring(4);
  }

  return host;
};

const getStoreFromHost = (host: string) => {
  const normalizedHost = stripWww(host);
  const tld = normalizedHost.substr(normalizedHost.indexOf('.') + 1);
  const serverTld = env.API_ENDPOINT.substr(env.API_ENDPOINT.indexOf('.') + 1);

  if (tld !== serverTld) {
    return memoizedGetSlugForCustomDomain(host);
  }

  const slug = normalizedHost.substr(0, normalizedHost.indexOf('.'));
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

const Main = ({ store, laStore, children }) => {
  const { t, i18n } = useTranslation();
  const brandColor = laStore?.brandColor;

  return (
    <ThemeProvider
      theme={getTheme(brandColor)}
      basicLocale={i18n.language === 'mk' ? mk_MK : undefined}
      compoundLocale={getCompoundLocale(t)}
    >
      <ReduxProvider store={store}>
        <ConnectedRouter>
          <hooks.BreakpointProvider
            breakpoints={theme.breakpoints.map(x => parseInt(x))}
          >
            <BrandColorWrapper brandColor={brandColor} />
            {laStore ? (
              <StoreLayout>
                <>
                  {children}
                  <AuthModal />
                </>
              </StoreLayout>
            ) : (
              <StoreNotFound t={t} />
            )}
          </hooks.BreakpointProvider>
        </ConnectedRouter>
      </ReduxProvider>
    </ThemeProvider>
  );
};

class MyApp extends App<{ store: any; i18nServerInstance: I18n }> {
  static async getInitialProps(appCtx: any) {
    // FUTURE: This (and <style> below) resolves a Chrome bug where the stylings flash for a second when doing SSR. See https://github.com/luffyZh/next-antd-scaffold/blob/master/docs/FAQ.md#the-ant-design-style-flash-when-page-refresh, https://github.com/ant-design/ant-design/issues/16037
    if (typeof window !== 'undefined') {
      window.onload = () => {
        document.getElementById('flashbug_style').remove();
      };
    }
    // You need to set the initial state before doing `getInitialProps`, otherwise the individual pages won't have access to the initial state.
    await setInitialDataInState(appCtx);
    const appProps = await App.getInitialProps(appCtx);
    return appProps;
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const laStore = getStore(store.getState());

    // Initialize analytics and only in the browser for now.
    if (process.browser && laStore?.slug) {
      initializeAnalytics(laStore.slug);
    }

    // This makes sure the sdk is available on the client-side as well.
    if (!sdk) {
      setupSdk({
        transport: 'rest',
        apiEndpoint: env.API_ENDPOINT,
        imagesEndpoint: env.ARTIFACTS_ENDPOINT,
        imagesProxyEndpoint: env.IMAGES_PROXY_ENDPOINT,
      });
    }

    return (
      <>
        {laStore && (
          <NextHead>
            <link
              rel='shortcut icon'
              href={sdk.artifact.getUrlForImage(laStore.logo, laStore._id, {
                h: 128,
              })}
            />
            <style
              id='flashbug_style'
              dangerouslySetInnerHTML={{
                __html: `*, *::before, *::after {
                  transition: none!important;
                }`,
              }}
            />
          </NextHead>
        )}

        <Main store={store} laStore={laStore}>
          {laStore ? <Component {...pageProps} /> : null}
        </Main>
      </>
    );
  }
}

// We initialize the redux store, which will add the `store` prop to the context object.
export default withRedux((initialState, options) =>
  configureStore(process.env.NODE_ENV, initialState, options),
)(appWithTranslation(MyApp));
