import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import './config/i18n';
import { css, Global } from '@emotion/react';

ReactDOM.render(
  <Suspense fallback={null}>
    <Global
      styles={css`
        /* This is used by Text strong */
        strong {
          font-weight: 500 !important;
        }
      `}
    />
    <App />
  </Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
