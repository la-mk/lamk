import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, createGlobalStyle } from 'styled-components';
import { setupSdk } from '@sradevski/la-sdk';
import { NextPageContext } from 'next';
import env from '../src/common/env';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  html body {
    height: 100%;
    font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a:hover {
    color: 'inherit';
  }

  .anticon {
    vertical-align: 0.125em;
  }
`;

// Setup the SDK so it can be used on the server-side in getInitialProps calls.
setupSdk({
  transport: 'rest',
  apiEndpoint: env.API_ENDPOINT,
  imagesEndpoint: env.ARTIFACTS_ENDPOINT,
  imagesProxyEndpoint: env.IMAGES_PROXY_ENDPOINT,
});

// The custom document is required to setup styled components for SSR.
export default class MyDocument extends Document {
  static async getInitialProps(ctx: NextPageContext & { renderPage: any }) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(
              <>
                <App {...props} />
                <GlobalStyle />
              </>,
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html prefix='og: https://ogp.me/ns#'>
        <Head>
          <link
            href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=fallback'
            rel='stylesheet'
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
