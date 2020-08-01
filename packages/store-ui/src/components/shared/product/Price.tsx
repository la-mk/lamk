import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';

interface PriceProps {
  minCalculatedPrice: number;
  maxCalculatedPrice: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  size?: 'small' | 'default' | 'large';
  vertical?: boolean;
}

export const Price = ({
  minCalculatedPrice,
  maxCalculatedPrice,
  minPrice,
  maxPrice,
  currency,
  size,
  vertical,
}: PriceProps) => {
  const discounted =
    minPrice !== minCalculatedPrice || maxPrice !== maxCalculatedPrice;

  const fontSize =
    size === 'small' ? 1 : size === 'large' ? [3, 4, 4] : [1, 2, 2];
  const margin = size === 'small' ? 2 : 3;

  return (
    <Flex flexDirection={vertical ? 'column' : 'row'} flexWrap='wrap'>
      <Text
        fontSize={fontSize}
        color={discounted ? 'danger' : 'text.dark'}
        mr={discounted ? margin : undefined}
        strong
      >
        {minCalculatedPrice !== maxCalculatedPrice
          ? `${minCalculatedPrice} ~ ${maxCalculatedPrice}`
          : minCalculatedPrice}{' '}
        {currency}
      </Text>

      {discounted && (
        <Text delete color={'mutedText.light'} fontSize={fontSize}>
          {minPrice !== maxPrice ? `${minPrice} ~ ${maxPrice}` : minPrice}{' '}
          {currency}
        </Text>
      )}
    </Flex>
  );
};
