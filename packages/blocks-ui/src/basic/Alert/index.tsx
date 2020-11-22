import React from 'react';
import {
  Alert as ChakraAlert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertProps as ChakraAlertProps,
  SpaceProps,
} from '@chakra-ui/react';
import { MinWidthProps, MaxWidthProps } from 'styled-system';

export type AlertVariant = 'solid' | 'ghost' | 'outline' | 'link';

export interface AlertProps
  extends Pick<ChakraAlertProps, 'status' | 'children'>,
    SpaceProps,
    MaxWidthProps,
    MinWidthProps {
  message?: string;
}

ChakraAlert.defaultProps = {};

export const Alert = ({ message, children, ...props }: AlertProps) => {
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
    </ChakraAlert>
  );
};
