import {
  Tag as ChakraTag,
  TagProps as ChakraTagProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export interface TagProps
  extends Pick<ChakraTagProps, 'children' | 'colorScheme'>,
    SpaceProps {
  size?: Size;
  as?: As;
}

ChakraTag.defaultProps = {
  variant: 'solid',
};

export const Tag = ChakraTag as React.FunctionComponent<TagProps>;
