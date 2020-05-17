import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';

interface PriceProps {
  calculatedPrice: number;
  basePrice: number;
  currency: string;
  emphasized?: boolean;
}

export const Price = ({
  basePrice,
  calculatedPrice,
  currency,
  emphasized,
}: PriceProps) => {
  const discounted = basePrice !== calculatedPrice;

  return (
    <Flex flexWrap='wrap'>
      <Text
        fontSize={emphasized ? [2, 3, 3] : [1, 2, 2]}
        color={discounted ? 'danger' : 'mutedText.dark'}
        mr={discounted ? [2, 2, 3] : undefined}
        strong
      >
        {calculatedPrice} {currency}
      </Text>

      {discounted && (
        <Text
          delete
          color={'mutedText.light'}
          fontSize={emphasized ? [2, 3, 3] : [1, 2, 2]}
        >
          {basePrice} {currency}
        </Text>
      )}
    </Flex>
  );
};
