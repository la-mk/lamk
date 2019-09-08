import React from 'react';
import App, { Container } from 'next/app';
import { Provider as ThemeProvider } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { Provider as ReduxProvider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { makeStore } from '../src/state/configureStore';
import { StoreLayout } from './common/StoreLayout';

const setInitialDataInState = async (appCtx: any) => {
  // If it is SSR, fetch the store information, otherwise it should be in redux already
  if (appCtx.ctx.req) {
    const laStore = await sdk.store
      .get('bc8ae691-459d-41fe-bf3e-d86abbf3677c')
      .catch(err => {
        console.log(err);
      });

    appCtx.ctx.store.dispatch({ type: 'SET_STORE', payload: laStore });
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
    const laStore = store.getState().store;
    return (
      <Container>
        <ThemeProvider>
          <ReduxProvider store={store}>
            <StoreLayout store={laStore}>
              {laStore ? <Component {...pageProps} /> : <div>Not found</div>}
            </StoreLayout>
          </ReduxProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

// We initialize the redux store, which will add the `store` prop to the context object.
export default withRedux(makeStore)(MyApp);
