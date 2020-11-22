import React from 'react';
import {
  Drawer as ChakraDrawer,
  DrawerBody as ChakraDrawerBody,
  // DrawerFooter as ChakraDrawerFooter,
  DrawerHeader as ChakraDrawerHeader,
  DrawerOverlay as ChakraDrawerOverlay,
  DrawerContent as ChakraDrawerContent,
  DrawerCloseButton as ChakraDrawerCloseButton,
  DrawerProps as ChakraDrawerProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export interface DrawerProps
  extends Pick<ChakraDrawerProps, 'isOpen' | 'placement' | 'onClose'> {
  title?: string;
  size?: Size;
  children: React.ReactNode;
}

// @ts-ignore
ChakraDrawer.defaultProps = {
  size: 'full',
};

export const Drawer = ({ title, children, ...props }: DrawerProps) => {
  return (
    <ChakraDrawer {...props}>
      <ChakraDrawerOverlay>
        <ChakraDrawerContent>
          <ChakraDrawerCloseButton />
          {title && <ChakraDrawerHeader>{title}</ChakraDrawerHeader>}
          <ChakraDrawerBody>{children}</ChakraDrawerBody>
        </ChakraDrawerContent>
      </ChakraDrawerOverlay>
    </ChakraDrawer>
  );
};
