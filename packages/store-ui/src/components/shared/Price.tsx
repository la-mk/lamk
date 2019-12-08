import React from 'react';
import { Text } from '@sradevski/blocks-ui';

interface PriceProps {
  price: number;
  currency: string;
}

export const Price = ({ price, currency }: PriceProps) => {
  return (
    <Text strong>
      {price} {currency}
    </Text>
  );
};
