import { css, Global } from '@emotion/react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

// The custom document is required to setup styled components for SSR.
export default class MyDocument extends Document {
  render() {
    return (
      <Html prefix='og: https://ogp.me/ns#'>
        <Head>
          <Global
            styles={css`
              html {
                height: 100%;
              }
              body {
                height: 100%;
                margin: 0;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `}
          />
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
            href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=fallback'
            rel='stylesheet'
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:2023967,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
