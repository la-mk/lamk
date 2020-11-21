import {
  Avatar as ChakraAvatar,
  AvatarProps as ChakraAvatarProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export interface AvatarProps
  extends Pick<ChakraAvatarProps, 'name' | 'src' | 'srcSet'>,
    SpaceProps {
  size?: Size;
  as?: As;
}

ChakraAvatar.defaultProps = {
  loading: 'lazy',
};

export const Avatar = ChakraAvatar as React.FunctionComponent<AvatarProps>;
