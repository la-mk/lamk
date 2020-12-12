import React from 'react';
import {
  Button as ChakraButton,
  ButtonGroup as ChakraButtonGroup,
  ButtonOptions,
  As,
  SpaceProps,
  IconButton,
} from '@chakra-ui/react';
import { Size, ButtonVariant } from '../../system';

// TODO: Check Link and merge the two
export interface ButtonProps
  extends Omit<ButtonOptions, 'iconSpacing' | 'spinner'>,
    Pick<React.ComponentProps<'button'>, 'onClick' | 'children'>,
    Pick<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'>,
    SpaceProps {
  'aria-label'?: string;
  isDanger?: boolean;
  size?: Size;
  variant?: ButtonVariant;
  as?: As;
}

export const Button = React.forwardRef(
  ({ isDanger, leftIcon, rightIcon, ...props }: ButtonProps, ref: any) => {
    if (!props.children && (leftIcon || rightIcon)) {
      return (
        <IconButton
          ref={ref}
          colorScheme={isDanger ? 'red' : 'primary'}
          icon={leftIcon || rightIcon}
          aria-label={props['aria-label'] || 'Button'}
          {...props}
        />
      );
    }
    return (
      <ChakraButton
        ref={ref}
        colorScheme={isDanger ? 'red' : 'primary'}
        iconSpacing={1}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
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
