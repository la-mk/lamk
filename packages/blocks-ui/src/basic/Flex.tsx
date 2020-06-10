import styled from 'styled-components';
import {
  AlignItemsProps,
  AlignSelfProps,
  flex,
  FlexDirectionProps,
  FlexProps as StyledFlexProps,
  FlexWrapProps,
  JustifyContentProps,
  order,
  OrderProps,
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
  borderRadius,
  BorderRadiusProps,
} from 'styled-system';
import { system } from '../system';

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement>,
    StyledFlexProps,
    OrderProps,
    AlignSelfProps,
    FlexWrapProps,
    FlexDirectionProps,
    AlignItemsProps,
    JustifyContentProps,
    BorderRadiusProps {}

export const Flex = system<FlexProps>(
  styled.div`
    box-sizing: border-box;
    ${flex};
    ${order};
    ${flexWrap};
    ${flexDirection};
    ${alignItems};
    ${justifyContent};
    ${borderRadius}

    display: flex;
  `,
  ['color']
);
