import {
  space,
  width,
  height,
  color,
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
  ColorProps,
  fontSize,
  FontSizeProps,
} from 'styled-system';
import styled from 'styled-components';

export interface SystemProps
  extends SpaceProps,
    WidthProps,
    HeightProps,
    MaxWidthProps,
    MaxHeightProps,
    MinWidthProps,
    MinHeightProps,
    DisplayProps,
    ColorProps, 
    FontSizeProps {}


export const system = function<T>(Component: React.ComponentClass<T>, additionalProps?: string[]) {
  // Use multiple & to increase specificity over the Ant components.
  return styled(Component)<SystemProps>`
    && {
      ${space}
      ${width}
      ${height}
      ${minWidth}
      ${minHeight}
      ${maxWidth}
      ${maxHeight}
      ${display}
      ${additionalProps?.includes('color') ? color : undefined}
      ${additionalProps?.includes('fontSize') ? fontSize : undefined}
    }
  `;
};
