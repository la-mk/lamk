import merge from 'lodash/merge';
import * as React from 'react';
import defaultTheme from '../theme';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';

interface LocalizationContext {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  login?: string;
  signup?: string;
  or?: string;
  authSameAccount?: string;
  update?: string;
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
