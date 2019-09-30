import merge from 'lodash/merge';
import * as React from 'react';
import defaultTheme from '../theme';
import { ThemeProvider } from 'styled-components';

export const Provider = ({
  theme,
  children,
}: {
  theme?: any;
  children: React.ReactElement;
}) => {
  return (
    <ThemeProvider theme={merge(defaultTheme, theme)}>{children}</ThemeProvider>
  );
};
