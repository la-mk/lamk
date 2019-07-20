import React from 'react';
import { Card } from '../../../component-lib/basic/Card';
import { Title } from '../../../component-lib/basic/Typography';
import { Flex } from '../../../component-lib/basic/Flex';
import { Icon } from '../../../component-lib/basic/Icon';
import styled from 'styled-components';

export const CARD_WIDTH = 200;

const CategoryIcon = styled(Icon)`
  font-size: 40px;
`;

export const CategoryCard = ({ category }: { category: any }) => {
  return (
    <Card
      width={CARD_WIDTH}
      cover={
        <Flex p={3} justifyContent='center' alignItems='center'>
          <CategoryIcon type={category.icon} />
        </Flex>
      }
    >
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        <Title level={3}>{category.name}</Title>
      </Flex>
    </Card>
  );
};
