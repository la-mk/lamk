import React, { Component } from 'react';
import { Provider } from 'react-redux';
//Note: This makes sure the app is loaded after the state has been rehydrated.
// @ts-ignore
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore, { history } from './state/configureStore';
import { ConnectedRouter } from 'connected-react-router';
import { Root } from './components/Root';
import { Provider as ThemeProvider } from 'blocks-ui';

const env = process.env.REACT_APP_ENV;

export class App extends Component {
  state = {
    ...configureStore(env),
  };

  onBeforeLift = () => {};

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
