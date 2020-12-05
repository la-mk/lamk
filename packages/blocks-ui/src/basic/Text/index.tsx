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
      'children' | 'isTruncated' | 'noOfLines' | 'align' | 'casing' | 'color'
    >,
    SpaceProps {
  size?: TextSize;
  as?: As;
}

export const Text = ChakraText as React.FunctionComponent<TextProps>;
