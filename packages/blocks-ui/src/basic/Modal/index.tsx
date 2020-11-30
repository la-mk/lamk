import React from 'react';
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as ChakraModalProps,
  SpaceProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export interface ModalProps
  extends Pick<ChakraModalProps, 'isOpen' | 'onClose'>,
    SpaceProps {
  size?: Size;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string | string[];
}

export const Modal = ({
  children,
  header,
  footer,
  maxWidth,
  ...props
}: ModalProps) => {
  return (
    <ChakraModal preserveScrollBarGap motionPreset="slideInBottom" {...props}>
      <ModalOverlay />
      <ModalContent marginTop="2rem" maxWidth={maxWidth}>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
