import {
  Box as ChakraBox,
  BoxProps as ChakraBoxProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';

export interface BoxProps
  extends Pick<
      ChakraBoxProps,
      | 'maxHeight'
      | 'maxWidth'
      | 'minHeight'
      | 'minWidth'
      | 'height'
      | 'width'
      | 'bg'
      | 'display'
      | 'flex'
      | 'order'
      | 'overflow'
      | 'lineHeight'
      | 'textAlign'
      | 'color'
      | 'children'
      | 'className'
    >,
    SpaceProps {
  as?: As;
}

export const Box = ChakraBox as React.FunctionComponent<BoxProps>;
