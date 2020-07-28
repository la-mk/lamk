import React from 'react';
import { Flex } from '../../basic/Flex';
import { Button } from '../../basic/Button';
import { Text } from '../../basic/Typography';
import styled, { withTheme } from 'styled-components';
import { BlocksTheme } from 'theme';

const ButtonWrapper = styled(Button)<{ highlight: boolean, pickerType: 'color' | 'size' }>`
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
    ${props => props.pickerType === 'color' ? `background: ${props.value}` : ''};
  }

  &:disabled, &:disabled:hover {
    ${props => props.pickerType === 'color' ? `background: ${props.value}; opacity: 0.5;` : ''};
  }
`;

// TODO: Add aria label for the color or text name and show on hover.
export const PickerBox = withTheme(
  ({
    value,
    highlight,
    disabled,
    type = 'text',
    theme,
    ...otherProps
  }: React.ComponentProps<typeof Button> & {
    value: string;
    disabled?: boolean;
    type: 'color' | 'text';
    highlight: boolean;
    theme: BlocksTheme;
  }) => {
    const boxSize = theme.baseHeight[1];

    return (
      <ButtonWrapper
        highlight={highlight}
        pickerType={type}
        value={value}
        py={1}
        px={type === 'color' ? 1 : 2}
        height={boxSize}
        width={type === 'color' ? boxSize : 'fit-content'}
        disabled={disabled}
        {...otherProps}
      >
        {type === 'text' ? <Text fontSize={0}>{value}</Text> : ' '}
      </ButtonWrapper>
    );
  }
);

export const PickerBoxes = ({
  values,
  disabled,
  onSelect,
  selected,
  type = 'text',
}: {
  values: string[];
  disabled?: string[];
  onSelect: (color: string | undefined) => void;
  selected: string | undefined;
  type?: 'color' | 'text';
}) => {
  return (
    <Flex m={-1} flexWrap="wrap">
      {values.map(value => (
        <PickerBox
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
