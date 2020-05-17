import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { Flex, hooks, Box } from '@sradevski/blocks-ui';
import { ProductCard } from '../shared/ProductCard';

interface ProductSetProps {
  products: Product[];
  title: string;
  subtitle: string;
  storeId: string;
}

export const DetailedProductSet = ({
  products,
  title,
  subtitle,
  storeId,
}: ProductSetProps) => {
  const areCardsHorizontal = hooks.useBreakpoint([false, false, true]);
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
    </>
  );
};
