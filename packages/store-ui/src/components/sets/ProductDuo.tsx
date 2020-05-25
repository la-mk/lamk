import React from 'react';
import { ProductSet } from '@sradevski/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { Flex, Box } from '@sradevski/blocks-ui';
import { ProductCard } from '../shared/product/ProductCard';
import { SeeAllLink } from './SeeAllLink';
import { useTranslation, getTranslationBaseForSet } from '../../common/i18n';
import { getSetHref } from '../../common/filterUtils';

interface ProductSetProps {
  set: ProductSet;
  storeId: string;
}

export const ProductDuo = ({ set, storeId }: ProductSetProps) => {
  const { t } = useTranslation();
  const allHref = getSetHref(set);
  const products = set.data;
  const title = t(getTranslationBaseForSet(set.setTag));
  const subtitle = 'Best picks of the week';

  const productOne = products[0];
  const productTwo = products[1];

  return (
    <>
      <SetTitle title={title} subtitle={subtitle} />
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection={['column', 'column', 'row']}
      >
        <Box mr={productTwo ? [0, 0, 4] : 0}>
          <ProductCard
            emphasized
            detailed
            product={productOne}
            storeId={storeId}
          />
        </Box>
        {productTwo && (
          <Box ml={[0, 0, 4]}>
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
