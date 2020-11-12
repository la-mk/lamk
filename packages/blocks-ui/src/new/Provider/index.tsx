import React from 'react';
import { Client, Server } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { getTheme } from '../theme';
import { BreakpointProvider } from '../../hooks/useBreakpoint';
import { BlocksTheme } from '../theme';

// interface LocalizationContext {
//   email?: string;
//   password?: string;
//   currentPassword?: string;
//   newPassword?: string;
//   forgotPassword?: string;
//   forgotPasswordExplanation?: string;
//   resetPassword?: string;
//   resetPasswordExplanation?: string;
//   sendPasswordResetLink?: string;
//   forgotPasswordSuccess?: string;
//   forgotPasswordSuccessExplanation?: string;
//   loginInstead?: string;
//   login?: string;
//   signup?: string;
//   or?: string;
//   authSameAccount?: string;
//   update?: string;
//   upload?: string;
//   uploadHint?: string;
// }

// export const LocalizationContext = React.createContext<LocalizationContext>({});

// This adds support for server-side rendering, see https://github.com/vercel/next.js/tree/canary/examples/with-styletron
const getHydrateClass = () =>
  document.getElementsByClassName('_styletron_hydrate_');

export const styletron =
  typeof window === 'undefined'
    ? new Server()
    : new Client({
        //@ts-ignore
        hydrate: getHydrateClass(),
      });

export const Provider = ({
  theme,
  // basicLocale,
  // compoundLocale,
  children,
}: {
  theme?: BlocksTheme;
  // basicLocale?: any;
  // compoundLocale?: LocalizationContext;
  children: React.ReactElement;
}) => {
  const finalTheme = getTheme(theme);

  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={finalTheme}>
        <BreakpointProvider
          breakpoints={[
            finalTheme.breakpoints.small,
            finalTheme.breakpoints.medium,
            finalTheme.breakpoints.large,
          ]}
        >
          {children}
        </BreakpointProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};
