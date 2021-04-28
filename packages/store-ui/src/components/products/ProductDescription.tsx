import React from 'react';
import { Flex, Text, Heading } from '@la-mk/blocks-ui';
import { Product, Variant } from '@la-mk/la-sdk/dist/models/product';
import { Price } from '../shared/product/Price';
import { useTranslation } from '../../common/i18n';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';

export const ProductDescription = ({
  product,
  selectedVariant,
  outOfStock,
}: {
  product: Product;
  selectedVariant: Variant;
  outOfStock?: boolean;
}) => {
  const store = useSelector(getStore);
  const { t } = useTranslation();

  return (
    <>
      <Heading as='h1' size='lg' noOfLines={2}>
        {product.name}
      </Heading>
      <Flex
        mt={[3, 5, 5]}
        direction='column'
        align={['center', 'flex-start', 'flex-start']}
        justify='center'
      >
        <Price
          size='large'
          minCalculatedPrice={
            selectedVariant
              ? selectedVariant.calculatedPrice
              : product.minCalculatedPrice
          }
          maxCalculatedPrice={
            selectedVariant
              ? selectedVariant.calculatedPrice
              : product.maxCalculatedPrice
          }
          minPrice={selectedVariant ? selectedVariant.price : product.minPrice}
          maxPrice={selectedVariant ? selectedVariant.price : product.maxPrice}
          currency={t(`currencies.${store.preferences.currency ?? 'mkd'}`)}
        />
        <Text color='mutedText.dark'>{t(`units.${product.unit}`)}</Text>
      </Flex>

      <Flex align='center' justify='center' mt={[3, 5, 5]} mb={2}>
        <Text mr={2}>{t('product.availability')}:</Text>
        <Text color={outOfStock ? 'danger' : 'success'}>
          {outOfStock ? t('product.outOfStock') : t('product.inStock')}
        </Text>
      </Flex>
    </>
  );
};
