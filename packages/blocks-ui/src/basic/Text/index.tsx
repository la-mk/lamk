import React from 'react';
import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { TextSize } from '../../system';

export interface TextProps
  extends Pick<
      ChakraTextProps,
      | 'children'
      | 'noOfLines'
      | 'align'
      | 'casing'
      | 'color'
      | 'width'
      | 'maxWidth'
      | 'minWidth'
      | 'display'
      | 'lineHeight'
      | 'letterSpacing'
      | 'textTransform'
    >,
    SpaceProps {
  size?: TextSize;
  as?: As;
  // This is not explicitly supported but it works
  whiteSpace?:
    | 'normal'
    | 'nowrap'
    | 'pre'
    | 'pre-line'
    | 'pre-wrap'
    | 'initial'
    | 'inherit';
}

export const Text = React.forwardRef(
  ({ size, ...props }: TextProps, ref: any) => {
    return (
      <ChakraText
        ref={ref}
        fontSize={size}
        color="text.dark"
        as="span"
        {...props}
      />
    );
  }
);
