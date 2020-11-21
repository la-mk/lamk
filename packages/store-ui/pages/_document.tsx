import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, createGlobalStyle } from 'styled-components';
import { setupSdk } from '@sradevski/la-sdk';
import { NextPageContext } from 'next';
import env from '../src/common/env';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  .ant-menu i {
    margin-right: 0 !important;
  }

  .ant-table-cell {
    font-weight: 400 !important;
    text-align: left !important;
  }

  .ant-table-tbody > tr > td {
    border: none !important;
  }

  .ant-menu-item-selected {
    background-color: transparent !important;
    
  }

  .ant-menu-item::after {
    border: 0 !important;
  }

  input {
    line-height: inherit;
    font: inherit;
    font-variant: inherit;
    color: inherit;
    font-size: inherit;
  }

  /* This is used by Text strong */
  strong {
    font-weight: 500 !important;
  }

  .ant-card-actions > li > span a,
  .ant-card-actions > li > span i {
    width: initial;
  }

  body {
    height: 100%;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a:hover {
    color: 'inherit';
  }

  .ant-btn.anticon {
    vertical-align: 0;
  }
  .anticon {
    vertical-align: 0.125em;
  }
  .ant-dropdown-menu-item > a, .ant-dropdown-menu-submenu-title > a {
    display: inherit;
    padding: inherit;
    margin: inherit;
    color: inherit;
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
