import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';

interface PriceProps {
  calculatedPrice: number;
  basePrice: number;
  currency: string;
  size?: 'small' | 'default' | 'large';
  vertical?: boolean;
}

export const Price = ({
  basePrice,
  calculatedPrice,
  currency,
  size,
  vertical,
}: PriceProps) => {
  const discounted = basePrice !== calculatedPrice;
  const fontSize =
    size === 'small' ? 1 : size === 'large' ? [3, 4, 4] : [1, 2, 2];

  return (
    <Flex flexDirection={vertical ? 'column' : 'row'} flexWrap='wrap'>
      <Text
        fontSize={fontSize}
        color={discounted ? 'danger' : 'text.dark'}
        mr={discounted ? fontSize : undefined}
        strong
      >
        {calculatedPrice} {currency}
      </Text>

      {discounted && (
        <Text delete color={'mutedText.light'} fontSize={fontSize}>
          {basePrice} {currency}
        </Text>
      )}
    </Flex>
  );
};
