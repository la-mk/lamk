import Document from 'next/document';
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

  input {
    line-height: inherit;
    font: inherit;
    font-variant: inherit;
    color: inherit;
    font-size: inherit;
  }

  .ant-card-actions > li > span a,
  .ant-card-actions > li > span i {
    width: initial;
  }

  body {
    height: 100%;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

// Setup the SDK so it can be used on the server-side in getInitialProps calls.
setupSdk({
  transport: 'rest',
  host: env.HOST,
  port: env.PORT,
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
}
