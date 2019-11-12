import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';
import { system } from '../../system';
import { Title } from '../Typography';
import { Flex } from '../Flex';

export type ArrowDirection = 'left' | 'right';
interface SetProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemKey: string;
  title?: string;
  gutter?: number | string | (number | string)[];
}

const SetContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: relative;
  padding: ${props => props.theme.space[3]}px ${props => props.theme.space[5]}px;
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

function SetBase<T>({
  items,
  renderItem,
  itemKey,
  title,
  gutter,
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
    <SetContainer>
      {title && (
        <Title mb={3} level={3}>
          {title}
        </Title>
      )}
      <SetList ref={setListRef}>
        {items.map(item => {
          return (
            <SetItem key={(item as any)[itemKey]}>
              <Flex mx={gutter || [2, 3, 3]}>{renderItem(item)}</Flex>
            </SetItem>
          );
        })}
      </SetList>
      <ArrowButton
        onClick={() => handleArrowClick('left')}
        icon='left'
        direction='left'
      />
      <ArrowButton
        onClick={() => handleArrowClick('right')}
        icon='right'
        direction='right'
      />

      <Button type='link'>See all</Button>
    </SetContainer>
  );
}

export const Set = system<SetProps<any>>(SetBase as any);
