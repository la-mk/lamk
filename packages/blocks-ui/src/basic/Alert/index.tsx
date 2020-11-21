import React from 'react';
import {
  Alert as ChakraAlert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertProps as ChakraAlertProps,
  SpaceProps,
} from '@chakra-ui/react';

export type AlertVariant = 'solid' | 'ghost' | 'outline' | 'link';

export interface AlertProps
  extends Pick<ChakraAlertProps, 'status' | 'children'>,
    SpaceProps {
  message?: string;
}

ChakraAlert.defaultProps = {};

export const Alert = ({ message, children, ...props }: AlertProps) => {
  return (
    <ChakraAlert {...props}>
      <AlertIcon />
      {message && <AlertTitle>{message}</AlertTitle>}
      {typeof children === 'string' ? (
        <AlertDescription>{children}</AlertDescription>
      ) : (
        children
      )}
    </ChakraAlert>
  );
};
