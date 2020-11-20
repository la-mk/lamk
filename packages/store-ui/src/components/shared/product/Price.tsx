import React from 'react';
import { Label, Flex } from '@sradevski/blocks-ui';

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

  const labelSize: any =
    size === 'small'
      ? 'small'
      : size === 'large'
      ? ['medium', 'large', 'large']
      : ['small', 'medium', 'medium'];
  const margin = size === 'small' ? 2 : 3;

  return (
    <Flex flexDirection={vertical ? 'column' : 'row'} flexWrap='wrap'>
      <Label
        $style={{ fontWeight: 500 }}
        size={labelSize}
        color={discounted ? 'negative' : 'contentPrimary'}
        mr={discounted ? margin : undefined}
      >
        {minCalculatedPrice !== maxCalculatedPrice
          ? `${minCalculatedPrice} ~ ${maxCalculatedPrice}`
          : minCalculatedPrice}{' '}
        {currency}
      </Label>

      {discounted && (
        <Label
          color={'contentTertiary'}
          size={labelSize}
          $style={{ textDecoration: 'line-through', fontWeight: 500 }}
        >
          {minPrice !== maxPrice ? `${minPrice} ~ ${maxPrice}` : minPrice}{' '}
          {currency}
        </Label>
      )}
    </Flex>
  );
};
