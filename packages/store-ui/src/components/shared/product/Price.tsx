import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';
import { useTheme } from '@chakra-ui/react';

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
  const theme = useTheme();
  const ownTheme = theme.sections.Price;

  const discounted =
    minPrice !== minCalculatedPrice || maxPrice !== maxCalculatedPrice;

  const fontSize = size === 'small' ? 'md' : size === 'large' ? '2xl' : 'lg';
  const margin = size === 'small' ? 2 : size === 'large' ? 3 : 2;

  const pricePart = (
    <Text
      as='strong'
      size={fontSize}
      color={discounted ? 'danger' : 'text.dark'}
      mr={
        discounted && ownTheme.discount.position === 'right'
          ? margin
          : undefined
      }
      ml={
        discounted && ownTheme.discount.position === 'left' ? margin : undefined
      }
    >
      {minCalculatedPrice !== maxCalculatedPrice
        ? `${minCalculatedPrice} ~ ${maxCalculatedPrice}`
        : minCalculatedPrice}{' '}
      {currency}
    </Text>
  );

  const discountedPart = discounted ? (
    <Text as='s' color={'mutedText.light'} size={fontSize}>
      {minPrice !== maxPrice ? `${minPrice} ~ ${maxPrice}` : minPrice}{' '}
      {currency}
    </Text>
  ) : null;

  return (
    <Flex direction={vertical ? 'column' : 'row'} wrap='wrap'>
      {ownTheme.discount.position === 'left' ? discountedPart : null}
      {pricePart}
      {ownTheme.discount.position === 'right' ? discountedPart : null}
    </Flex>
  );
};
