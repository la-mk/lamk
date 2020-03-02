import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';
import styled from 'styled-components';

interface PriceProps {
  calculatedPrice: number;
  basePrice: number;
  currency: string;
}

const CrossedOutPrice = styled(Text)`
  text-decoration: line-through;
`;

export const Price = ({ basePrice, calculatedPrice, currency }: PriceProps) => {
  const discounted = basePrice !== calculatedPrice;

  return (
    <Flex flexWrap='wrap'>
      <Text
        style={{ fontSize: 16 }}
        type={discounted ? 'danger' : undefined}
        mr={discounted ? [1, 1, 2, 2] : undefined}
        strong
      >
        {calculatedPrice} {currency}
      </Text>
      {discounted && (
        <CrossedOutPrice style={{ fontSize: 16 }}>
          {basePrice} {currency}
        </CrossedOutPrice>
      )}
    </Flex>
  );
};
