import React, { Component, Suspense } from "react";
import { Provider } from "react-redux";
// @ts-ignore
import { PersistGate } from "redux-persist/es/integration/react";
import { Provider as ThemeProvider } from "@lamk/blocks-ui";
import { setupSdk } from "@lamk/la-sdk";
import { ConnectedRouter } from "connected-react-router";
import { Root } from "./components/Root";
import { FullScreenSpinner } from "./components/shared/components/FullScreenSpinner";
import configureStore, { history } from "./state/configureStore";
import env from "./common/env";

export class App extends Component {
  state = {
    ...configureStore(env.NODE_ENV)
  };

  onBeforeLift = () => {
    setupSdk({
      transport: "socket",
      host: env.HOST,
      port: env.PORT
    });
  };

  render() {
    return (
      <Provider store={this.state.store}>
        <PersistGate
          loading={<FullScreenSpinner/>}
          onBeforeLift={this.onBeforeLift}
          persistor={this.state.persistor}
        >
          <ThemeProvider>
            <ConnectedRouter history={history}>
              <Suspense
                fallback={<FullScreenSpinner/>}
              >
                <Root />
              </Suspense>
            </ConnectedRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
