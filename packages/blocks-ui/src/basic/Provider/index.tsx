import * as React from 'react';
import { BlocksTheme, getChakraTheme } from '../../theme';
import { ChakraProvider } from '@chakra-ui/react';
import { BreakpointProvider } from '../../hooks/useBreakpoint';
import { globalStyles as globalCascaderStyles } from '../Cascader/globalStyles';
import { css, Global, ThemeProvider } from '@emotion/react';

interface LocalizationContext {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
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
  decline?: string;
  upload?: string;
  uploadHint?: string;
  genericError?: string;
  genericErrorExplanation?: string;
  registerConfirmTermsOfService?: string;
  termsOfService?: string;
  collectAccountInfoReviewPolicy?: string;
  privacyPolicy?: string;
  forMoreDetails?: string;
  cookiesExplanation?: string;
  readMoreCookies?: string;
  acceptCookies?: string;
}

export const LocalizationContext = React.createContext<LocalizationContext>({});

const convertRemToPixels = (rem: string) => {
  const remVal = parseInt(rem, 10);
  return (
    remVal * parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
};

const getBreakpoints = (themeBreakpoints: string[]) => {
  if (typeof window === 'undefined') {
    return [768, 1024, 1280];
  }

  return themeBreakpoints.map(convertRemToPixels);
};

export const Provider = ({
  theme,
  translations,
  children,
}: {
  theme?: BlocksTheme;
  translations?: LocalizationContext;
  children: React.ReactElement;
}) => {
  const finalTheme = getChakraTheme(theme ?? {});

  return (
    <ChakraProvider theme={finalTheme}>
      <ThemeProvider theme={finalTheme}>
        <Global
          styles={css`
            html {
              height: 100%;
              margin: 0;
              padding: 0;
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

            ${globalCascaderStyles}
          `}
        />
        <BreakpointProvider
          breakpoints={getBreakpoints([
            finalTheme.breakpoints.sm,
            finalTheme.breakpoints.md,
            finalTheme.breakpoints.lg,
          ])}
        >
          <LocalizationContext.Provider value={translations || {}}>
            {children}
          </LocalizationContext.Provider>
        </BreakpointProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};
