import React from 'react';
import { ProductSetResult } from '@sradevski/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { Flex, hooks, Box } from '@sradevski/blocks-ui';
import { ProductCard } from '../shared/product/ProductCard';
import { SeeAllLink } from './SeeAllLink';
import { useTranslation } from '../../common/i18n';
import { getSetHref } from '../../common/filterUtils';

interface ProductSetProps {
  set: ProductSetResult;
  storeId: string;
}

export const ProductTrio = ({ set, storeId }: ProductSetProps) => {
  const { t } = useTranslation();
  const areCardsHorizontal = hooks.useBreakpoint([false, false, true]);

  const allHref = getSetHref(set);
  const products = set.data;

  const focusProduct = products[0];
  const productOne = products[1];
  const productTwo = products[2];

  return (
    <>
      <SetTitle title={set.setTag.title} subtitle={set.setTag.subtitle} />
      <Flex
        align='center'
        justify='center'
        direction={['column', 'column', 'row']}
      >
        <Box mr={[0, 0, 6]}>
          <ProductCard
            emphasized
            detailed
            product={focusProduct}
            storeId={storeId}
          />
        </Box>

        <Flex
          ml={[0, 0, 6]}
          direction={['row', 'row', 'column']}
          align={['flex-start', 'flex-start', 'center']}
          justify='center'
        >
          <Box mb={[0, 0, 4]} mr={[3, 4, 0]}>
            <ProductCard
              detailed
              horizontal={areCardsHorizontal}
              product={productOne}
              storeId={storeId}
            />
          </Box>
          <Box mt={[0, 0, 4]} ml={[3, 4, 0]}>
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
