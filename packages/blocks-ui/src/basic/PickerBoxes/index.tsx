import React from 'react';
import { Flex } from '../Flex';
import { Button, ButtonProps } from '../Button';
import { Text } from '../Text';
import styled from '@emotion/styled';
import { Size } from '../../system';

export type PickerVariant = 'text' | 'color';

const ButtonWrapper = styled(Button)<{
  value: string;
  highlight: boolean;
  variant: PickerBoxProps['variant'];
}>`
  border-radius: ${props => props.theme.radii.sm}px;
  border: ${props =>
    props.highlight
      ? `solid 2px ${props.theme.colors.primary['500']}`
      : `solid 2px ${props.theme.colors.background.light}`};

  &:focus,
  &:active,
  &:hover {
    border: ${props => `solid 2px ${props.theme.colors.primary['500']}`};
  }

  &:not([disabled]) {
    ${props => (props.variant === 'color' ? `background: ${props.value}` : '')};
  }

  &:disabled,
  &:disabled:hover {
    ${props =>
      props.variant === 'color'
        ? `background: ${props.value}; opacity: 0.5;`
        : ''};
  }
`;

export type PickerBoxProps = Omit<ButtonProps, 'variant'> & {
  value: string | undefined;
  disabled?: boolean;
  highlight?: boolean;
  size?: Size;
  variant?: PickerBoxesProps['variant'];
};

// TODO: Add aria label for the color or text name and show on hover.
export const PickerBox = ({
  value,
  highlight,
  disabled,
  variant = 'text',
  size = 'md',
  ...otherProps
}: PickerBoxProps) => {
  return (
    <ButtonWrapper
      size={size}
      highlight={!!highlight}
      variant={variant as any}
      value={value!}
      isDisabled={disabled}
      {...otherProps}
    >
      {variant === 'text' ? (
        <Flex align="center" justify="center">
          <Text size="sm">{value}</Text>{' '}
        </Flex>
      ) : (
        ' '
      )}
    </ButtonWrapper>
  );
};

export interface PickerBoxesProps {
  values: string[];
  disabled?: string[];
  onSelect: (color: string | undefined) => void;
  selected: string | undefined;
  size?: Size;
  variant?: PickerVariant;
}

export const PickerBoxes = ({
  values,
  disabled,
  onSelect,
  selected,
  size = 'md',
  variant = 'text',
}: PickerBoxesProps) => {
  return (
    <Flex m={-1} wrap="wrap">
      {values.map(value => (
        <PickerBox
          key={value}
          size={size}
          onClick={() => onSelect(value === selected ? undefined : value)}
          highlight={selected === value}
          value={value}
          variant={variant}
          disabled={disabled ? disabled.includes(value) : false}
          m={1}
        />
      ))}
    </Flex>
  );
};
