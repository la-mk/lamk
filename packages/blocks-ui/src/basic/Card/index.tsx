import React from 'react';
import { Box as ChakraBox, BoxProps as ChakraBoxProps } from '@chakra-ui/react';
import { BoxProps } from '../../';

export interface CardProps
  extends BoxProps,
    Pick<ChakraBoxProps, 'borderWidth' | 'borderRadius' | 'shadow'> {}

export const Card = (props: CardProps) => {
  return (
    <ChakraBox
      shadow="sm"
      borderWidth="1px"
      borderRadius="md"
      p={5}
      {...props}
    />
  );
};
