import React from 'react';
import App, { AppContext, AppInitialProps } from 'next/app';
import { default as NextHead } from 'next/head';
import { Provider as ThemeProvider } from '@la-mk/blocks-ui';
import { ConnectedRouter } from 'connected-next-router';
import { withRedux } from '../src/state/configureStore';
import { StoreLayout } from '../src/common/pageComponents/StoreLayout';
import { setStore } from '../src/state/modules/store/store.module';
import { AuthModal } from '../src/components/auth/AuthModal';
import { sdk, setupSdk } from '@la-mk/la-sdk';
import env from '../src/common/env';
import { getStore } from '../src/state/modules/store/store.selector';
import { appWithTranslation, useTranslation } from '../src/common/i18n';
import { connect } from 'react-redux';
import memoize from 'mem';
import { initializeAnalytics } from '../src/common/analytics';
import { getTheme } from '../src/common/theme';
import { StoreNotFound } from '../src/common/pageComponents/StoreNotFound';
import { setLandingContent } from '../src/state/modules/storeContents/storeContents.module';
import { setCategories } from '../src/state/modules/categories/categories.module';
import { NextPageContext } from 'next';

const getTranslations = (t: (key: string) => string) => {
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

// Cache for 30 min, since custom domains will rarely change.
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

const setInitialDataInState = async (ctx: NextPageContext) => {
  // If it is SSR, fetch the store information, otherwise it should be in redux already.
  if (ctx.req) {
    const host: string = ctx.req.headers.host;
    if (!host) {
      throw new Error('Store request misconfigured');
    }

    const laStore = await getStoreFromHost(host);
    if (!laStore) {
      return;
    }

    // These are shown in the navbar, so they are esentially needed on every page.
    const [landingContent, categoriesResult] = await Promise.all([
      sdk.storeContents.getLandingContentForStore(laStore._id),
      sdk.storeCategory.findForStore(laStore._id),
    ]);

    ctx.store.dispatch(setStore(laStore));
    ctx.store.dispatch(setLandingContent(landingContent));
    ctx.store.dispatch(setCategories(categoriesResult.data));
  }
};

const Main = ({ laStore, children }) => {
  const { t } = useTranslation();
  const brandColor = laStore?.color;

  return (
    <ThemeProvider
      theme={getTheme(brandColor)}
      translations={getTranslations(t)}
    >
      <ConnectedRouter>
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
      </ConnectedRouter>
    </ThemeProvider>
  );
};

class MyApp extends App<AppInitialProps> {
  public static getInitialProps = async ({ Component, ctx }: AppContext) => {
    await setInitialDataInState(ctx);

    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
        // Some custom thing for all pages
      },
    };
  };

  render() {
    // @ts-ignore
    const { Component, pageProps, laStore } = this.props;

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
          </NextHead>
        )}

        <Main laStore={laStore}>
          {laStore ? <Component {...pageProps} /> : null}
        </Main>
      </>
    );
  }
}

// We initialize the redux store, which will add the `store` prop to the context object.
export default withRedux(
  appWithTranslation(
    connect(state => {
      return {
        laStore: getStore(state),
      };
    })(MyApp),
  ),
);
