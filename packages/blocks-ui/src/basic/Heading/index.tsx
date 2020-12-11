import {
  Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps,
  TextProps as ChakraTextProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { HeadingSize } from '../../system';

export interface HeadingProps
  extends Pick<
      ChakraHeadingProps,
      'children' | 'isTruncated' | 'noOfLines' | 'color'
    >,
    Pick<ChakraTextProps, 'align'>,
    SpaceProps {
  size?: HeadingSize;
  as?: As;
}

ChakraHeading.defaultProps = {
  fontWeight: 'normal',
};

export const Heading = ChakraHeading as React.FunctionComponent<HeadingProps>;
