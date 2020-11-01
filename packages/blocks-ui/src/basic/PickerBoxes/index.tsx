import React from 'react';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Text } from '../Typography';
import styled, { withTheme } from 'styled-components';
import { BlocksTheme } from 'theme';

const ButtonWrapper = styled(Button)<{
  highlight: boolean;
  pickerType: PickerBoxProps['type'];
}>`
  border-radius: ${props => props.theme.radii[0]}px;
  border: ${props =>
    props.highlight
      ? `solid 2px ${props.theme.colors.primary}`
      : `solid 2px ${props.theme.colors.background.light}`};

  &:focus,
  &:active,
  &:hover {
    border: ${props => `solid 2px ${props.theme.colors.primary}`};
  }

  &:not([disabled]) {
    ${props =>
      props.pickerType === 'color' ? `background: ${props.value}` : ''};
  }

  &:disabled,
  &:disabled:hover {
    ${props =>
      props.pickerType === 'color'
        ? `background: ${props.value}; opacity: 0.5;`
        : ''};
  }
`;

export type PickerBoxProps = React.ComponentProps<typeof Button> & {
  value: string;
  disabled?: boolean;
  highlight: boolean;
  size?: PickerBoxesProps['size'];
  type?: PickerBoxesProps['type'];
  theme: BlocksTheme;
};

// TODO: Add aria label for the color or text name and show on hover.
export const PickerBox = withTheme(
  ({
    value,
    highlight,
    disabled,
    type = 'text',
    size = 'default',
    theme,
    ...otherProps
  }: PickerBoxProps) => {
    const boxSize =
      size === 'small' ? theme.baseHeight[0] : theme.baseHeight[1];

    return (
      <ButtonWrapper
        size={size}
        highlight={highlight}
        pickerType={type}
        value={value}
        height={boxSize}
        width={type === 'color' ? boxSize : 'fit-content'}
        disabled={disabled}
        {...otherProps}
      >
        {type === 'text' ? (
          <Flex alignItems="center" justifyContent="center">
            <Text fontSize={0}>{value}</Text>{' '}
          </Flex>
        ) : (
          ' '
        )}
      </ButtonWrapper>
    );
  }
);

export interface PickerBoxesProps {
  values: string[];
  disabled?: string[];
  onSelect: (color: string | undefined) => void;
  selected: string | undefined;
  size?: 'small' | 'default';
  type?: 'color' | 'text';
}

export const PickerBoxes = ({
  values,
  disabled,
  onSelect,
  selected,
  size = 'default',
  type = 'text',
}: PickerBoxesProps) => {
  return (
    <Flex m={-1} flexWrap="wrap">
      {values.map(value => (
        <PickerBox
          key={value}
          size={size}
          onClick={() => onSelect(value === selected ? undefined : value)}
          highlight={selected === value}
          value={value}
          type={type}
          disabled={disabled ? disabled.includes(value) : false}
          m={1}
        />
      ))}
    </Flex>
  );
};
