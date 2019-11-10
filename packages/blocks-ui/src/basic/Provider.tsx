import merge from 'lodash/merge';
import * as React from 'react';
import defaultTheme from '../theme';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';

interface LocalizationContext {
  email?: string;
  password?: string;
  login?: string;
  signup?: string;
  noAccount?: string;
  alreadyHaveAccount?: string;
}

export const LocalizationContext = React.createContext<LocalizationContext>({});

export const Provider = ({
  theme,
  basicLocale,
  compoundLocale,
  children,
}: {
  theme?: any;
  basicLocale?: any;
  compoundLocale?: LocalizationContext;
  children: React.ReactElement;
}) => {
  return (
    <ThemeProvider theme={merge(defaultTheme, theme)}>
      <ConfigProvider locale={basicLocale}>
        <LocalizationContext.Provider value={compoundLocale || {}}>
          {children}
        </LocalizationContext.Provider>
      </ConfigProvider>
    </ThemeProvider>
  );
};
