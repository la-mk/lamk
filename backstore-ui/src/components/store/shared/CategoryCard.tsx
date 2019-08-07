import React from 'react';
import { Card } from '../../../blocks-ui/basic/Card';
import { Title } from '../../../blocks-ui/basic/Typography';
import { Flex } from '../../../blocks-ui/basic/Flex';
import styled from 'styled-components';

export const CARD_SIZE = 240;

const PositionedCard = styled(Card)`
  position: relative;
  & > .ant-card-body {
    padding: 0;
    height: ${CARD_SIZE - 2}px;
    width: ${CARD_SIZE - 2}px;
  }
`;

const CenteredContent = styled(Flex)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CategoryImg = styled.img`
  width: ${CARD_SIZE}px;
  height: ${CARD_SIZE}px;
  filter: blur(2px);
`;

export const CategoryCard = ({ category }: { category: any }) => {
  return (
    <PositionedCard width={CARD_SIZE} height={CARD_SIZE}>
      <CategoryImg src='https://images.cdn4.stockunlimited.net/preview1300/various-home-appliances-and-household-items_1350574.jpg' />
      <CenteredContent
        width='100%'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Title level={3}>{category.name}</Title>
      </CenteredContent>
    </PositionedCard>
  );
};
