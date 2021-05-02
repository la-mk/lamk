import React from 'react';
import {
  Popover as ChakraPopover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Portal,
} from '@chakra-ui/react';

export interface PopoverProps {
  title?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Popover = ({ title, trigger, children }: PopoverProps) => {
  return (
    <ChakraPopover isLazy closeOnBlur closeOnEsc>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <Portal>
        <PopoverContent bg="background.light">
          <PopoverArrow bg="background.light" />
          {title && <PopoverHeader>{title}</PopoverHeader>}
          <PopoverCloseButton />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </ChakraPopover>
  );
};
