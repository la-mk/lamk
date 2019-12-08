import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import { App } from './App';
import './index.css';
import './config/i18n';
import { FullScreenSpinner } from './components/shared/components/FullScreenSpinner';

ReactDOM.render(
  <Suspense fallback={<FullScreenSpinner />}>
    <App />
  </Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
