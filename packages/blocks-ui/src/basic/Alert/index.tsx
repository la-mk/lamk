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

export type AlertVariant = 'subtle' | 'solid' | 'left-accent' | 'top-accent';

export interface AlertProps
  extends Pick<
      ChakraAlertProps,
      'status' | 'children' | 'minWidth' | 'maxWidth'
    >,
    SpaceProps {
  variant?: AlertVariant;
  message?: string;
  onClose?: () => void;
}

export const Alert = ({ message, onClose, children, ...props }: AlertProps) => {
  return (
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
