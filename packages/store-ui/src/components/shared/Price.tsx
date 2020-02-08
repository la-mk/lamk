import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';
import styled from 'styled-components';

interface PriceProps {
  price: number;
  discountedPrice?: number;
  currency: string;
}

const CrossedOutPrice = styled(Text)`
  text-decoration: line-through;
`;

export const Price = ({ price, discountedPrice, currency }: PriceProps) => {
  return (
    <Flex flexWrap='wrap'>
      <Text
        style={{ fontSize: 16 }}
        type={discountedPrice ? 'danger' : undefined}
        mr={discountedPrice ? [1, 1, 2, 2] : undefined}
        strong
      >
        {price} {currency}
      </Text>
      {discountedPrice && (
        <CrossedOutPrice style={{ fontSize: 16 }}>
          {discountedPrice} {currency}
        </CrossedOutPrice>
      )}
    </Flex>
  );
};
