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
  bg?: string;
  children: React.ReactNode;
}

// @ts-ignore
ChakraDrawer.defaultProps = {
  size: 'full',
  preserveScrollBarGap: true,
};

export const Drawer = ({
  title,
  children,
  bg = 'white',
  ...props
}: DrawerProps) => {
  return (
    <ChakraDrawer {...props}>
      <ChakraDrawerOverlay>
        <ChakraDrawerContent bg={bg}>
          <ChakraDrawerCloseButton />
          {title && <ChakraDrawerHeader>{title}</ChakraDrawerHeader>}
          <ChakraDrawerBody>{children}</ChakraDrawerBody>
        </ChakraDrawerContent>
      </ChakraDrawerOverlay>
    </ChakraDrawer>
  );
};
