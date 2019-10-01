import React, { Component } from 'react';
import { Provider } from 'react-redux';
// @ts-ignore
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider as ThemeProvider } from 'blocks-ui';
import { setupSdk } from 'la-sdk';
import { ConnectedRouter } from 'connected-react-router';
import { Root } from './components/Root';
import configureStore, { history } from './state/configureStore';
import env from './common/env';

export class App extends Component {
  state = {
    ...configureStore(env.NODE_ENV),
  };

  onBeforeLift = () => {
    setupSdk({
      transport: 'socket',
      host: env.HOST,
      port: env.PORT,
    });
  };

  render() {
    return (
      <Provider store={this.state.store}>
        <PersistGate
          loading={<div>Loading</div>}
          onBeforeLift={this.onBeforeLift}
          persistor={this.state.persistor}
        >
          <ThemeProvider>
            <ConnectedRouter history={history}>
              <Root />
            </ConnectedRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
