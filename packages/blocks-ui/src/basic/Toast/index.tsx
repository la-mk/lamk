import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';

const showToast = (options: UseToastOptions) => {
  const standaloneToast = createStandaloneToast();
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
