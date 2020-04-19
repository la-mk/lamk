import React from 'react';
import App from 'next/app';
import { default as NextHead } from 'next/head';
import { Provider as ThemeProvider, hooks, theme } from '@sradevski/blocks-ui';
import { theme as themeOverride } from '../src/common/theme';
import { LandingLayout } from '../src/layout/LandingLayout';
import 'antd/dist/antd.less';
import mk_MK from 'antd/lib/locale/mk_MK';

class MyApp extends App<any> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <NextHead>
          <link rel='shortcut icon' href={'path/to/url'} />
        </NextHead>

        <ThemeProvider theme={themeOverride} basicLocale={mk_MK}>
          <hooks.BreakpointProvider
            breakpoints={theme.breakpoints.map((x) => parseInt(x))}
          >
            <LandingLayout>
              <Component {...pageProps} />
            </LandingLayout>
          </hooks.BreakpointProvider>
        </ThemeProvider>
      </>
    );
  }
}

export default MyApp;
