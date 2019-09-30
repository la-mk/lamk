import {
  space,
  width,
  height,
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
} from 'styled-system';
import styled from 'styled-components';

export interface SystemProps
  extends SpaceProps,
    WidthProps,
    HeightProps,
    MaxWidthProps,
    MaxHeightProps,
    MinWidthProps,
    MinHeightProps {}

export const system = function<T>(Component: React.ComponentClass<T>) {
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
    }
  `;
};
