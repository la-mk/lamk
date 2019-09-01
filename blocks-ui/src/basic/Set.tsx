import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { system } from '../system';
import { Title } from './Typography';
import { Flex } from './Flex';

export type ArrowDirection = 'left' | 'right';

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

const SetList = styled.ul`
  display: flex;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  min-width: 100%;
  padding: 0;
  margin: 0;
`;

const SetItem = styled.li`
  border-width: 0;
  box-sizing: border-box;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`;

const SetBase = ({ items, renderItem, itemKey, title, gutter }: any) => {
  const handleArrowClick = (direction: ArrowDirection) => {
    return null;
  };

  return (
    <SetContainer>
      {title && (
        <Title mb={3} level={3}>
          {title}
        </Title>
      )}
      <SetList>
        {items.map((item: any) => {
          return (
            <SetItem key={item[itemKey]}>
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
};

export const Set = system<any>(SetBase as any);
