import React from 'react';
import { ProductSetResult } from '@la-mk/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { Flex, Box } from '@la-mk/blocks-ui';
import { ProductCard } from '../shared/product/ProductCard';
import { SeeAllLink } from './SeeAllLink';
import { useTranslation } from '../../common/i18n';
import { getSetHref } from '../../common/filterUtils';

interface ProductSetProps {
  set: ProductSetResult;
  storeId: string;
}

export const ProductDuo = ({ set, storeId }: ProductSetProps) => {
  const { t } = useTranslation();
  const allHref = getSetHref(set);
  const products = set.data;
  const productOne = products[0];
  const productTwo = products[1];

  return (
    <>
      <SetTitle title={set.setTag.title} subtitle={set.setTag.subtitle} />
      <Flex
        align={['center', 'center', 'flex-start']}
        justify='center'
        direction={['column', 'column', 'row']}
      >
        <Box mr={productTwo ? [0, 0, 7] : 0}>
          <ProductCard
            emphasized
            detailed
            product={productOne}
            storeId={storeId}
          />
        </Box>
        {productTwo && (
          <Box ml={[0, 0, 7]}>
            <ProductCard
              emphasized
              detailed
              product={productTwo}
              storeId={storeId}
            />
          </Box>
        )}
      </Flex>
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
