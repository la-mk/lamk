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
      | 'isTruncated'
      | 'noOfLines'
      | 'align'
      | 'casing'
      | 'color'
      | 'maxWidth'
      | 'minWidth'
      | 'display'
      | 'lineHeight'
      | 'letterSpacing'
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

ChakraText.defaultProps = {
  as: 'span',
};

export const Text = ChakraText as React.FunctionComponent<TextProps>;
