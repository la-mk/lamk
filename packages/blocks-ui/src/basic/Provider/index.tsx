import React from 'react';
import { Client, Server } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import merge from 'lodash/merge';
import defaultTheme, { getBrandTheme } from '../../theme';
import { getTheme, BlocksTheme } from '../../theme';
import { BreakpointProvider } from '../../hooks/useBreakpoint';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';

interface LocalizationContext {
  email?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  forgotPassword?: string;
  forgotPasswordExplanation?: string;
  resetPassword?: string;
  resetPasswordExplanation?: string;
  sendPasswordResetLink?: string;
  forgotPasswordSuccess?: string;
  forgotPasswordSuccessExplanation?: string;
  loginInstead?: string;
  login?: string;
  signup?: string;
  or?: string;
  authSameAccount?: string;
  update?: string;
  upload?: string;
  uploadHint?: string;
}

export const LocalizationContext = React.createContext<LocalizationContext>({});

// This adds support for server-side rendering, see https://github.com/vercel/next.js/tree/canary/examples/with-styletron
const getHydrateClass = () =>
  document.getElementsByClassName('_styletron_hydrate_');

export const styletron =
  typeof window === 'undefined'
    ? new Server({
        prefix: 'la-',
      })
    : new Client({
        prefix: 'la-',
        //@ts-ignore
        hydrate: getHydrateClass(),
      });

export const Provider = ({
  theme,
  baseTheme,
  basicLocale,
  compoundLocale,
  children,
}: {
  theme?: any;
  baseTheme?: BlocksTheme;
  basicLocale?: any;
  compoundLocale?: LocalizationContext;
  children: React.ReactElement;
}) => {
  const finalTheme = getTheme(baseTheme ?? getBrandTheme());

  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={finalTheme}>
        <ThemeProvider theme={merge(defaultTheme, theme)}>
          <ConfigProvider locale={basicLocale}>
            <LocalizationContext.Provider value={compoundLocale || {}}>
              <BreakpointProvider
                breakpoints={[
                  finalTheme.breakpoints.small,
                  finalTheme.breakpoints.medium,
                  finalTheme.breakpoints.large,
                ]}
              >
                {children}
              </BreakpointProvider>
            </LocalizationContext.Provider>
          </ConfigProvider>
        </ThemeProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};
