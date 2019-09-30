import styled from 'styled-components';
import {
  alignSelf,
  order,
  flex,
  FlexProps as StyledFlexProps,
  AlignSelfProps,
  OrderProps,
} from 'styled-system';
import { system } from '../system';

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement>,
    OrderProps,
    AlignSelfProps,
    StyledFlexProps {}

export const Box = system<BoxProps>(styled.div`
  box-sizing: border-box;
  ${flex};
  ${alignSelf};
  ${order};` as any);
