import merge from 'lodash/merge';
import * as React from 'react';
import defaultTheme, {
  BlocksTheme,
  DeepPartial,
  getChakraTheme,
} from '../../theme';
import { ThemeProvider } from 'styled-components';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfigProvider } from 'antd';
import { BreakpointProvider } from '../../hooks/useBreakpoint';

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

export const Provider = ({
  theme,
  basicLocale,
  compoundLocale,
  children,
}: {
  theme?: DeepPartial<BlocksTheme>;
  basicLocale?: any;
  compoundLocale?: LocalizationContext;
  children: React.ReactElement;
}) => {
  const mergedTheme: BlocksTheme = merge(defaultTheme, theme);

  return (
    <ThemeProvider theme={mergedTheme}>
      <ChakraProvider theme={getChakraTheme(mergedTheme)}>
        <BreakpointProvider breakpoints={mergedTheme.breakpoints.map(parseInt)}>
          <ConfigProvider locale={basicLocale}>
            <LocalizationContext.Provider value={compoundLocale || {}}>
              {children}
            </LocalizationContext.Provider>
          </ConfigProvider>
        </BreakpointProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
};
