import React, { useRef } from 'react';
import styled from 'styled-components';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from '../Button';
import { system } from '../../system';
import { Flex } from '../Flex';
import { Box } from '../Box';

export type ArrowDirection = 'left' | 'right';
type SetProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemKey: string;
  gutter?: number | string | (number | string)[];
} & React.ComponentProps<typeof Box>;

const SetContainer = styled(Box)`
  width: 100%;
  box-sizing: border-box;
  position: relative;
`;

const ArrowButton = ({
  direction,
  ...props
}: {
  direction: ArrowDirection;
} & React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      size="compact"
      $style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: direction === 'left' ? 0 : undefined,
        right: direction === 'right' ? 0 : undefined,
        marginTop: 'auto',
        marginBottom: 'auto',
      }}
    />
  );
};

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
    <SetContainer px={5} {...props}>
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
        kind="tertiary"
        onClick={() => handleArrowClick('left')}
        direction="left"
      >
        <LeftOutlined />
      </ArrowButton>
      <ArrowButton
        kind="tertiary"
        onClick={() => handleArrowClick('right')}
        direction="right"
      >
        <RightOutlined />
      </ArrowButton>
    </SetContainer>
  );
}

export const Set = system<SetProps<any>>(SetBase);
