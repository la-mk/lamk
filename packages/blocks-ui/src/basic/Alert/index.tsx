import React from 'react';
import {
  Alert as ChakraAlert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  CloseButton,
  AlertProps as ChakraAlertProps,
  SpaceProps,
} from '@chakra-ui/react';
import { MinWidthProps, MaxWidthProps } from 'styled-system';

export type AlertVariant = 'subtle' | 'solid' | 'left-accent' | 'top-accent';

export interface AlertProps
  extends Pick<ChakraAlertProps, 'status' | 'children'>,
    SpaceProps,
    MaxWidthProps,
    MinWidthProps {
  variant?: AlertVariant;
  message?: string;
  onClose?: () => void;
}

export const Alert = ({ message, onClose, children, ...props }: AlertProps) => {
  return (
    // @ts-ignore it complains that it doesn't support MaxWidth and MinWidth, but it does.
    <ChakraAlert {...props}>
      <AlertIcon />
      {message && <AlertTitle>{message}</AlertTitle>}
      {typeof children === 'string' ? (
        <AlertDescription>{children}</AlertDescription>
      ) : (
        children
      )}
      {onClose && <CloseButton ml="auto" onClick={onClose} />}
    </ChakraAlert>
  );
};
