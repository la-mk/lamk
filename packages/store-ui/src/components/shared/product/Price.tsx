import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';

interface PriceProps {
  minCalculatedPrice: number;
  maxCalculatedPrice: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  size?: 'default' | 'large';
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

  const fontSize = size === 'large' ? '2xl' : 'lg';
  const margin = size === 'large' ? 3 : 2;

  return (
    <Flex direction={vertical ? 'column' : 'row'} wrap='wrap'>
      <Text
        as='strong'
        size={fontSize}
        color={discounted ? 'danger' : 'text.dark'}
        mr={discounted ? margin : undefined}
      >
        {minCalculatedPrice !== maxCalculatedPrice
          ? `${minCalculatedPrice} ~ ${maxCalculatedPrice}`
          : minCalculatedPrice}{' '}
        {currency}
      </Text>

      {discounted && (
        <Text as='s' color={'mutedText.light'} size={fontSize}>
          {minPrice !== maxPrice ? `${minPrice} ~ ${maxPrice}` : minPrice}{' '}
          {currency}
        </Text>
      )}
    </Flex>
  );
};
