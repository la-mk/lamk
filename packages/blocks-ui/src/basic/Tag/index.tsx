import {
  Tag as ChakraTag,
  TagProps as ChakraTagProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { MinWidthProps } from 'styled-system';
import { Size } from '../../system';

export interface TagProps
  extends Pick<ChakraTagProps, 'children' | 'colorScheme'>,
    SpaceProps,
    MinWidthProps {
  size?: Size;
  as?: As;
}

ChakraTag.defaultProps = {
  variant: 'solid',
  textAlign: 'center',
};

export const Tag = ChakraTag as React.FunctionComponent<TagProps>;
