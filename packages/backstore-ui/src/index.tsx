import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import './config/i18n';
import { FullScreenSpinner } from './components/shared/components/FullScreenSpinner';

const GlobalStyle = createGlobalStyle`
  .ant-btn.anticon {
    vertical-align: 0;
  }
  .anticon {
    vertical-align: 0em;
  }

  i {
    vertical-align: middle;
  }


  /* This is used by Text strong */
  strong {
    font-weight: 500 !important;
  }
`;

// Remove spinner in index.html shown while loading script resources
document.getElementById('loading-spinner')?.remove();

ReactDOM.render(
  <Suspense fallback={<FullScreenSpinner />}>
    <GlobalStyle />
    <App />
  </Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
