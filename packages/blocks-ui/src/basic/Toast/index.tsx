import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';

const showToast = (options: UseToastOptions) => {
  const standaloneToast = createStandaloneToast();
  standaloneToast(options);
};

export const toast = {
  success: (msg: string) =>
    showToast({
      title: msg,
      status: 'success',
      position: 'top',
      isClosable: true,
    }),
  error: (msg: string) =>
    showToast({
      title: msg,
      status: 'error',
      position: 'top',
      isClosable: true,
    }),
  warning: (msg: string) =>
    showToast({
      title: msg,
      status: 'warning',
      position: 'top',
      isClosable: true,
    }),
  info: (msg: string) =>
    showToast({
      title: msg,
      status: 'info',
      position: 'top',
      isClosable: true,
    }),
};
