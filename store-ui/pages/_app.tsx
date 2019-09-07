import React from 'react';
import App, { Container } from 'next/app';
import { Provider as ThemeProvider } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_STORE':
      return { ...state, store: action.payload };
    default:
      return state;
  }
};

const makeStore = initialState => {
  return createStore(reducer, initialState);
};

class MyApp extends App<{ store: any }> {
  static async getInitialProps(appCtx: any) {
    // If it is SSR, fetch the store information, otherwise it should be in redux already
    if (appCtx.ctx.req) {
      const laStore = await sdk.store
        .get('239add16-6c9d-4e2c-adb2-650664c0e1f1')
        .catch(err => {
          console.log(err);
        });

      console.log(laStore);
      appCtx.ctx.store.dispatch({ type: 'SET_STORE', payload: laStore });
    }

    const appProps = await App.getInitialProps(appCtx);
    return appProps;
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const state = store.getState();
    return (
      <Container>
        <ThemeProvider>
          <ReduxProvider store={store}>
            {state.store ? <Component {...pageProps} /> : <div>Not found</div>}
          </ReduxProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default withRedux(makeStore)(MyApp);
