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
  textAlign,
  TextAlignProps,
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
    TextAlignProps,
    FontSizeProps {}

export const system = function<T>(Component: any, additionalProps?: string[]) {
  // Use multiple & to increase specificity over the Ant components.
  return styled(Component as React.FunctionComponent<T>)<SystemProps>`
    &&&& {
      ${space}
      ${width}
      ${height}
      ${minWidth}
      ${minHeight}
      ${maxWidth}
      ${maxHeight}
      ${display}
      ${additionalProps?.includes('color') ? color : undefined}
      ${additionalProps?.includes('textAlign') ? textAlign : undefined}
      ${additionalProps?.includes('fontSize') ? fontSize : undefined}
    }
  `;
};
