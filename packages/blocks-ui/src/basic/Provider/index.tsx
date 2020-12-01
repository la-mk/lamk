import merge from 'lodash/merge';
import * as React from 'react';
import defaultTheme, {
  BlocksTheme,
  DeepPartial,
  getChakraTheme,
} from '../../theme';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
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

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  html body {
    height: 100%;
    font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Hide clear button in Chrome */
  [type="search"]::-webkit-search-cancel-button,
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  /* More than the modal, remove when we move away from ant */
  .ant-select-dropdown {
    z-index: 1410;
  }

  .anticon {
    vertical-align: 0;
  }
`;

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
        <GlobalStyle />
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
