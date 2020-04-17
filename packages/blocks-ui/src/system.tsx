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
    ColorProps {}


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
    }
  `;
};
