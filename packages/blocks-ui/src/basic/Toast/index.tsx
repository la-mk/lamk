import {
  createStandaloneToast,
  ToastId,
  UseToastOptions,
} from '@chakra-ui/react';
import { FinalBlocksTheme } from '../../theme';

let theme: FinalBlocksTheme | undefined;
let toaster: (options?: UseToastOptions | undefined) => ToastId;

const showToast = (options: UseToastOptions) => {
  toaster({
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
  const { ToastContainer, toast } = createStandaloneToast({
    theme,
  });

  toaster = toast;
  return ToastContainer;
};
