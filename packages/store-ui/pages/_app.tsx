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
import { appWithTranslation } from '../src/common/i18n';
import 'antd/dist/antd.less';

const setInitialDataInState = async (appCtx: any) => {
  // If it is SSR, fetch the store information, otherwise it should be in redux already
  if (appCtx.ctx.req) {
    const host: string = appCtx.ctx.req.headers.host;
    if (!host) {
      throw new Error('Store not found');
    }

    const slug = host.substr(0, host.indexOf('.'));

    if (!slug) {
      throw new Error('Store not found');
    }

    const laStore = await sdk.store.getBySlug(slug).catch(err => {
      console.log(err);
      return null;
    });

    appCtx.ctx.store.dispatch(setStore(laStore));
  }
};

class MyApp extends App<{ store: any }> {
  static async getInitialProps(appCtx: any) {
    // You need to set the initial state before doing `getInitialProps`, otherwise the individual pages won't have access to the initial state.
    await setInitialDataInState(appCtx);
    const appProps = await App.getInitialProps(appCtx);
    return appProps;
  }

  render() {
    const { Component, pageProps, store } = this.props;
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
              href={sdk.artifact.getUrlForArtifact(laStore.logo)}
            />
          </NextHead>
        )}
        <ThemeProvider>
          <ReduxProvider store={store}>
            <ConnectedRouter>
              <StoreLayout>
                <>
                  {laStore ? (
                    <Component {...pageProps} />
                  ) : (
                    <Empty description='Store not found'></Empty>
                  )}
                  <AuthModal />
                </>
              </StoreLayout>
            </ConnectedRouter>
          </ReduxProvider>
        </ThemeProvider>
      </>
    );
  }
}

// We initialize the redux store, which will add the `store` prop to the context object.
export default withRedux((initialState, options) =>
  configureStore(process.env.NODE_ENV, initialState, options),
)(appWithTranslation(MyApp));
