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
  textAlign,
  TextAlignProps,
} from 'styled-system';
import { $StyleProp } from 'styletron-react';
import { InternalBlocksTheme } from './theme';

export interface SystemProps
  extends SpaceProps,
    WidthProps,
    HeightProps,
    MaxWidthProps,
    MaxHeightProps,
    MinWidthProps,
    MinHeightProps,
    TextAlignProps,
    DisplayProps {}

const getSystemTheme = (baseTheme: InternalBlocksTheme) => {
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

export type SystemComponentProps<T> = T & {
  $style?: $StyleProp<T & { $theme: InternalBlocksTheme }>;
};

// BaseWeb already supports props as CSS but they are verbose (paddingLeft instead of pl), and they take `scalexxx` values instead of indices.
export const system = function<T extends object>(
  Component: React.FunctionComponent<SystemComponentProps<T & SystemProps>>,
  additionalProps?: string[]
) {
  return (p: SystemComponentProps<T & SystemProps>) => {
    return (
      <Component
        {...p}
        $style={props => {
          // Mutating the props is fine as we don't want to cause unnecessary rerenders.
          const systemProps = {
            ...props,
            theme: getSystemTheme(props.$theme),
          };

          // Styletron doesn't like mixing shorthand `margin` and longhand `marginTop`, so we rewrite everything to longhand.
          if (systemProps.m != null) {
            systemProps.mx = systemProps.m;
            systemProps.my = systemProps.m;
            delete systemProps.m;
          }

          if (systemProps.p != null) {
            systemProps.px = systemProps.p;
            systemProps.py = systemProps.p;
            delete systemProps.p;
          }

          let passedStyles = p.$style ?? {};
          if (typeof p.$style === 'function') {
            passedStyles = p.$style(props);
          }

          return {
            ...space(systemProps),
            ...width(systemProps),
            ...height(systemProps),
            ...minWidth(systemProps),
            ...minHeight(systemProps),
            ...maxWidth(systemProps),
            ...maxHeight(systemProps),
            ...display(systemProps),
            ...(additionalProps?.includes('textAlign')
              ? textAlign(systemProps)
              : {}),
            ...passedStyles,
          };
        }}
      />
    );
  };
};
