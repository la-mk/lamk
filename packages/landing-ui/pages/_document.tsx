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
  /* @font-face {
    font-family: 'Noto Sans';
    src: url('/fonts/noto-sans-v9-latin-regular.woff2'); 
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  } */
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
          <link
            href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=fallback'
            rel='stylesheet'
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
