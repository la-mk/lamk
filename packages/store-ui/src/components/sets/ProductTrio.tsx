import React from 'react';
import { Product, ProductSet } from '@sradevski/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { Flex, hooks, Box } from '@sradevski/blocks-ui';
import { ProductCard } from '../shared/ProductCard';
import { SeeAllLink } from './SeeAllLink';
import { useTranslation, getTranslationBaseForSet } from '../../common/i18n';
import { getSetHref } from '../../common/filterUtils';

interface ProductSetProps {
  set: ProductSet;
  storeId: string;
}

export const ProductTrio = ({ set, storeId }: ProductSetProps) => {
  const { t } = useTranslation();
  const areCardsHorizontal = hooks.useBreakpoint([false, false, true]);

  const allHref = getSetHref(set);
  const products = set.data;
  const title = t(getTranslationBaseForSet(set.setTag));
  const subtitle = 'Best picks of the week';

  const focusProduct = products[0];
  const productOne = products[1];
  const productTwo = products[2];

  return (
    <>
      <SetTitle title={title} subtitle={subtitle} />
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection={['column', 'column', 'row']}
      >
        <Box mr={[0, 0, 4]}>
          <ProductCard
            emphasized
            detailed
            product={focusProduct}
            storeId={storeId}
          />
        </Box>

        <Flex
          ml={[0, 0, 4]}
          flexDirection={['row', 'row', 'column']}
          alignItems={['flex-start', 'flex-start', 'center']}
          justifyContent='center'
        >
          <Box mb={[0, 0, 2]} mr={[2, 2, 0]}>
            <ProductCard
              detailed
              horizontal={areCardsHorizontal}
              product={productOne}
              storeId={storeId}
            />
          </Box>
          <Box mt={[0, 0, 2]} ml={[2, 2, 0]}>
            <ProductCard
              detailed
              horizontal={areCardsHorizontal}
              product={productTwo}
              storeId={storeId}
            />
          </Box>
        </Flex>
      </Flex>
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
