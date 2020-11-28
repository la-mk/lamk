import React from 'react';
import {
  Button as ChakraButton,
  ButtonOptions,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { Size, ButtonVariant } from '../../system';

// TODO: Check IconButton and Link and either merge the two or add aria-label to this one.
export interface ButtonProps
  extends Omit<ButtonOptions, 'iconSpacing' | 'spinner'>,
    Pick<React.ComponentProps<'button'>, 'onClick' | 'children'>,
    Pick<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'>,
    SpaceProps {
  isDanger?: boolean;
  size?: Size;
  variant?: ButtonVariant;
  as?: As;
}

ChakraButton.defaultProps = {
  colorScheme: 'primary',
  iconSpacing: 1,
};

export const Button = ({ isDanger, ...props }: ButtonProps) => {
  return <ChakraButton {...props} colorScheme={isDanger ? 'red' : 'primary'} />;
};
