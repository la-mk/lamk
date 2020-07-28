import React from 'react';
import { Flex } from '../../basic/Flex';
import { Box } from '../../basic/Box';
import { Text } from '../../basic/Typography';
import { withTheme } from 'styled-components';
import { BlocksTheme } from 'theme';

// TODO: Add aria label for the color or text name and show on hover.
export const PickerBox = withTheme(
  ({
    value,
    highlight,
    type = 'text',
    theme,
    ...otherProps
  }: React.ComponentProps<typeof Box> & {
    value: string | number;
    type: 'color' | 'text';
    highlight: boolean;
    theme: BlocksTheme;
  }) => {
    const boxSize = theme.space[1] * 2 + theme.baseHeight[0];

    return (
      <Box
        style={{
          border: highlight
            ? `solid 2px ${theme.colors.primary}`
            : `solid 2px ${theme.colors.background.light}`,
          borderRadius: theme.radii[0],
        }}
        py={1}
        px={type === 'color' ? 1 : 2}
        height={boxSize}
        width={type === 'color' ? boxSize : 'fit-content'}
        bg={type === 'color' ? value : 'inherit'}
        {...otherProps}
      >
        {type === 'text' ? <Text fontSize={0}>{value}</Text> : undefined}
      </Box>
    );
  }
);

export const PickerBoxes = ({
  values,
  onSelect,
  selected,
  type = 'text',
}: {
  values: string[] | number[];
  onSelect: (color: string | number | undefined) => void;
  selected: string | number | undefined;
  type?: 'color' | 'text';
}) => {
  return (
    <Flex flexWrap="wrap">
      {(values as any[]).map(value => (
        <PickerBox
          onClick={() => onSelect(value === selected ? undefined : value)}
          highlight={selected === value}
          value={value}
          type={type}
          m={1}
        />
      ))}
    </Flex>
  );
};
