import {
  Button as ChakraButton,
  ButtonOptions,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export type ButtonVariant = 'solid' | 'ghost' | 'outline' | 'link';

// TODO: Check IconButton and Link and either merge the two or add aria-label to this one.
export interface ButtonProps
  extends Omit<ButtonOptions, 'iconSpacing' | 'spinner'>,
    Pick<React.ComponentProps<'button'>, 'onClick'>,
    Pick<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'>,
    SpaceProps {
  size?: Size;
  variant?: ButtonVariant;
  as?: As;
}

ChakraButton.defaultProps = {
  colorScheme: 'primary',
  iconSpacing: 1,
};

export const Button = ChakraButton as React.FunctionComponent<ButtonProps>;
