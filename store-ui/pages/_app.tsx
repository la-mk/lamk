import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'blocks-ui';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
