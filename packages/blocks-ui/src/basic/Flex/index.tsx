import {
  Flex as ChakraFlex,
  FlexProps as ChakraFlexProps,
} from '@chakra-ui/react';
import { BoxProps } from '../Box';

export interface FlexProps
  extends BoxProps,
    Pick<
      ChakraFlexProps,
      'direction' | 'wrap' | 'basis' | 'grow' | 'shrink' | 'align' | 'justify'
    > {}

export const Flex = ChakraFlex as React.FunctionComponent<FlexProps>;
