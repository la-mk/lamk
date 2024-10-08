import React from 'react';
import App from 'next/app';
import { FacebookChat, Provider as ThemeProvider } from '@la-mk/blocks-ui';
import { LandingLayout } from '../src/layout/LandingLayout';
import { initializeAnalytics } from '../src/common/analytics';
import { appWithTranslation } from '../src/common/i18n';

class MyApp extends App<any> {
  render() {
    // Initialize analytics and only in the browser for now.
    if (process.browser) {
      initializeAnalytics();
    }

    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider
        translations={{}}
        theme={{
          colors: {
            heading: {
              dark: '#07074F',
            },
          },
          components: {
            Button: {
              baseStyle: {
                fontWeight: 'normal',
              },
            },
            Menu: {
              baseStyle: {
                list: {
                  zIndex: 10000,
                },
              },
            },
          },
        }}
      >
        <>
          <LandingLayout>
            <Component {...pageProps} />
          </LandingLayout>
          <FacebookChat pageId={'102161548245479'} />
        </>
      </ThemeProvider>
    );
  }
}

export default appWithTranslation(MyApp);

// See https://github.com/GoogleChrome/web-vitals-extension and https://nextjs.org/blog/next-9-4#integrated-web-vitals-reporting
export function reportWebVitals(metric) {
  //TODO: These metrics can be sent to our analytics
  console.log(metric);
}
