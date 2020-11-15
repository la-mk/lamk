import React from 'react';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { ButtonProps } from '../Button';

export type PickerBoxProps = Omit<
  React.ComponentProps<typeof Button>,
  'type'
> & {
  value?: string;
  highlight?: boolean;
  size?: PickerBoxesProps['size'];
  type?: PickerBoxesProps['type'];
};

// TODO: Add aria label for the color or text name and show on hover.
export const PickerBox = ({
  value,
  highlight,
  disabled,
  type = 'text',
  ...otherProps
}: PickerBoxProps) => {
  return (
    <Button
      {...otherProps}
      kind="tertiary"
      // @ts-ignore
      $style={({ $theme }: any) => {
        return {
          whitespace: 'pre',
          boxSizing: 'border-box',
          border:
            highlight && !disabled
              ? `solid ${$theme.sizing.scale0} ${$theme.colors.primary}`
              : `solid ${$theme.sizing.scale0} ${$theme.colors.borderTransparent}`,
          ...(type === 'color'
            ? {
                backgroundColor: value,
                ':hover': {
                  backgroundColor: value,
                  border: `solid ${$theme.sizing.scale0} ${$theme.colors.primary}`,
                },
                ':disabled': {
                  backgroundColor: `${value}; opacity: 0.5`,
                },
                ':disabled:hover': {
                  border: `solid ${$theme.sizing.scale0} ${$theme.colors.borderTransparent}`,
                },
              }
            : {}),
        };
      }}
      disabled={disabled}
    >
      {/* TODO: A hacky way to make the box squarish, fix it. */}
      {type === 'text' ? value : <div style={{ padding: '0 6px' }}>&nbsp;</div>}
    </Button>
  );
};

export interface PickerBoxesProps {
  values: string[];
  disabled?: string[];
  onSelect: (color: string | undefined) => void;
  selected: string | undefined;
  size?: ButtonProps['size'];
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
