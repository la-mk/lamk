import React from 'react';
import {
  Button as ChakraButton,
  ButtonGroup as ChakraButtonGroup,
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

export const Button = React.forwardRef(
  ({ isDanger, ...props }: ButtonProps, ref: any) => {
    return (
      <ChakraButton
        ref={ref}
        colorScheme={isDanger ? 'red' : 'primary'}
        {...props}
      />
    );
  }
);

ChakraButtonGroup.defaultProps = {
  isAttached: true,
};

export interface ButtonGroupProps
  extends Pick<ButtonProps, 'size' | 'variant'>,
    SpaceProps {}

export const ButtonGroup = ChakraButtonGroup as React.FunctionComponent<
  ButtonGroupProps
>;
