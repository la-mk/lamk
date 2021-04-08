import Document, { Html, Head, Main, NextScript } from 'next/document';
import { setupSdk } from '@la-mk/la-sdk';
import env from '../src/common/env';
import { css, Global } from '@emotion/react';

// Setup the SDK so it can be used on the server-side in getInitialProps calls.
setupSdk({
  transport: 'rest',
  apiEndpoint: env.API_ENDPOINT,
  imagesEndpoint: env.ARTIFACTS_ENDPOINT,
  imagesProxyEndpoint: env.IMAGES_PROXY_ENDPOINT,
});

// The custom document is required to setup styled components for SSR.
export default class MyDocument extends Document {
  render() {
    return (
      <Html prefix='og: https://ogp.me/ns#'>
        <Head>
          <link
            href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=fallback'
            rel='stylesheet'
          />
          <Global
            styles={css`
              html {
                height: 100%;
              }

              html body {
                height: 100%;
                font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif,
                  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                margin: 0;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              a:hover {
                color: 'inherit';
              }

              strong {
                font-weight: 500 !important;
              }
            `}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
