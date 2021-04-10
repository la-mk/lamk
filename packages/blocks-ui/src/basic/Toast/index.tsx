import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';
import { FinalBlocksTheme } from '../../theme';

let theme: FinalBlocksTheme | undefined;

const showToast = (options: UseToastOptions) => {
  const standaloneToast = createStandaloneToast({
    theme,
  });

  standaloneToast({
    ...options,
    variant: 'subtle',
    position: 'top',
    isClosable: true,
  });
};

export const toast = {
  success: (msg: string) =>
    showToast({
      description: msg,
      status: 'success',
    }),
  error: (msg: string) =>
    showToast({
      description: msg,
      status: 'error',
    }),
  warning: (msg: string) =>
    showToast({
      description: msg,
      status: 'warning',
    }),
  info: (msg: string) =>
    showToast({
      description: msg,
      status: 'info',
    }),
};

export const init = (builtTheme: FinalBlocksTheme) => {
  theme = builtTheme;
};
