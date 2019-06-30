import {
  space,
  width,
  height,
  SpaceProps,
  WidthProps,
  HeightProps,
} from 'styled-system';
import styled from 'styled-components';
import {} from 'styled-system';

export interface SystemProps extends SpaceProps, WidthProps, HeightProps {}

export const system = function<T>(Component: React.ComponentClass<T>) {
  return styled(Component)<SystemProps>`
		${space}
		${width}
		${height}
`;
};
