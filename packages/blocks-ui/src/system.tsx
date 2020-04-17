import {
  space,
  width,
  height,
  textColor,
  backgroundColor,
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
  BackgroundColorProps,
  TextColorProps,
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
    TextColorProps, 
    BackgroundColorProps {}


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
      ${additionalProps?.includes('color') ? textColor : undefined}
      ${additionalProps?.includes('bg') ? backgroundColor : undefined}
    }
  `;
};
