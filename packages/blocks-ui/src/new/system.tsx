import React from 'react';
import {
  space,
  width,
  height,
  display,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  SpaceProps,
  WidthProps,
  HeightProps,
  MaxWidthProps,
  MaxHeightProps,
  MinWidthProps,
  MinHeightProps,
  DisplayProps,
  // color,
  // ColorProps,
  // fontSize,
  // FontSizeProps,
  textAlign,
  TextAlignProps,
} from 'styled-system';
import { Theme } from 'baseui/theme';

export interface SystemProps
  extends SpaceProps,
    WidthProps,
    HeightProps,
    MaxWidthProps,
    MaxHeightProps,
    MinWidthProps,
    MinHeightProps,
    // ColorProps,
    TextAlignProps,
    // FontSizeProps,
    DisplayProps {}

const getSystemTheme = (baseTheme: Theme & { space: string[] }) => {
  return {
    breakpoints: [
      `${baseTheme.breakpoints.small}px`,
      `${baseTheme.breakpoints.medium}px`,
      `${baseTheme.breakpoints.large}px`,
    ],
    space: baseTheme.space,
    colors: baseTheme.colors,
  };
};

// BaseWeb already supports props as CSS but they are verbose (paddingLeft instead of pl), and they take `scalexxx` values instead of indices.
export const system = function<T>(
  Component: React.FunctionComponent<T>,
  additionalProps?: string[]
): React.FunctionComponent<T> {
  return (p: T) => {
    return (
      <Component
        $style={(props: any) => {
          const systemProps = { ...props, theme: getSystemTheme(props.$theme) };

          return {
            ...space(systemProps),
            ...width(systemProps),
            ...height(systemProps),
            ...minWidth(systemProps),
            ...minHeight(systemProps),
            ...maxWidth(systemProps),
            ...maxHeight(systemProps),
            ...display(systemProps),
            // ...(additionalProps?.includes('color') ? color(systemProps) : {}),
            ...(additionalProps?.includes('textAlign')
              ? textAlign(systemProps)
              : {}),
            // ...(additionalProps?.includes('fontSize')
            //   ? fontSize(systemProps)
            //   : {}),
            ...(props.$style ?? {}),
          };
        }}
        {...p}
      />
    );
  };
};
