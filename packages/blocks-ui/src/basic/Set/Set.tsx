import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { Box, BoxProps } from '../Box';

export type ArrowDirection = 'left' | 'right';

export interface SetProps<T> extends BoxProps {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemKey: string;
  gutter?: number | string | (number | string)[];
  footer?: React.ReactNode;
}

const SetContainer = styled(Box)`
  width: 100%;
  box-sizing: border-box;
  position: relative;
`;

const ArrowButton = styled(Button)<{ direction: ArrowDirection }>`
  position: absolute !important;
  top: 0;
  bottom: 0;
  ${props => (props.direction === 'left' ? 'left: 0' : 'right: 0')};
  margin-top: auto;
  margin-bottom: auto;
`;

// scroll-behavior has no support on Safari and iOS browser as of September 2019.
const SetList = styled.ul`
  display: flex;
  list-style: none;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  min-width: 100%;
  padding: 0;
  margin: 0;

  /* Supported by Chrome */
  &::-webkit-scrollbar {
    display: none !important;
  }
  /* Only supported by Firefox */
  scrollbar-width: none;
`;

const SetItem = styled.li`
  border-width: 0;
  box-sizing: border-box;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`;

export function Set<T>({
  items,
  renderItem,
  itemKey,
  gutter,
  ...props
}: SetProps<T>) {
  const setListRef = useRef<HTMLUListElement>(null);
  const handleArrowClick = (direction: ArrowDirection) => {
    if (items.length <= 0) {
      return;
    }

    if (setListRef && setListRef.current) {
      const scrollWidth = setListRef.current.scrollWidth;
      const scrollLeft = setListRef.current.scrollLeft;
      const itemWidth = scrollWidth / items.length;

      setListRef.current.scrollTo({
        left:
          direction === 'left'
            ? Math.max(scrollLeft - itemWidth, 0)
            : Math.min(scrollLeft + itemWidth, scrollWidth),
        behavior: 'smooth',
      });
    }
  };

  return (
    <SetContainer px={6} {...props}>
      <SetList ref={setListRef}>
        {items.map(item => {
          return (
            <SetItem key={(item as any)[itemKey]}>
              <Flex mx={gutter || [3, 4, 4]}>{renderItem(item)}</Flex>
            </SetItem>
          );
        })}
      </SetList>
      <ArrowButton
        variant="ghost"
        onClick={() => handleArrowClick('left')}
        direction="left"
        leftIcon={<ChevronLeft />}
      />
      <ArrowButton
        variant="ghost"
        onClick={() => handleArrowClick('right')}
        direction="right"
        leftIcon={<ChevronRight />}
      />
    </SetContainer>
  );
}
