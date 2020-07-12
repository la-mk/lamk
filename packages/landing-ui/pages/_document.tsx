import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, createGlobalStyle } from 'styled-components';
import { NextPageContext } from 'next';

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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

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
          <link rel='shortcut icon' href='/favicon.ico' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />

          <link
            href='https://fonts.googleapis.com/css2?family=Ubuntu&display=fallback'
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
