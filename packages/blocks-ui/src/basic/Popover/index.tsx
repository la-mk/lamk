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
        <PopoverContent
          onClick={React.useCallback(e => {
            e.stopPropagation();
          }, [])}
        >
          <PopoverArrow />
          {title && <PopoverHeader>{title}</PopoverHeader>}
          <PopoverCloseButton />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </ChakraPopover>
  );
};
