import {
  Tag as ChakraTag,
  TagProps as ChakraTagProps,
  As,
  SpaceProps,
  LayoutProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export type TagProps = Pick<ChakraTagProps, 'children' | 'colorScheme'> &
  SpaceProps & { minWidth?: LayoutProps['minWidth'] } & {
    size?: Size;
    as?: As;
  };

ChakraTag.defaultProps = {
  variant: 'solid',
  textAlign: 'center',
};

export const Tag = ChakraTag as React.FunctionComponent<TagProps>;
