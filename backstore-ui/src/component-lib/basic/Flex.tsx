import styled from 'styled-components';
import {
  alignItems,
  AlignItemsProps,
  alignSelf,
  AlignSelfProps,
  flex,
  flexDirection,
  FlexDirectionProps,
  FlexProps as StyledFlexProps,
  flexWrap,
  FlexWrapProps,
  justifyContent,
  JustifyContentProps,
  order,
  OrderProps,
} from 'styled-system';
import { system } from '../system';

export interface FlexProps
  extends React.RefAttributes<HTMLDivElement>,
    StyledFlexProps,
    OrderProps,
    AlignSelfProps,
    FlexWrapProps,
    FlexDirectionProps,
    AlignItemsProps,
    JustifyContentProps {}

export const Flex = system<FlexProps>(styled.div`
  box-sizing: border-box;
  ${flex};
  ${order};
  ${alignSelf};

  display: flex;
  ${flexWrap};
  ${flexDirection};
  ${alignItems};
  ${justifyContent};` as any);
