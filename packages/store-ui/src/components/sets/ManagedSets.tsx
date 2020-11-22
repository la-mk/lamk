import isEqual from 'lodash/isEqual';
import React, { useState, useEffect } from 'react';
import {
  ProductSet as ProductSetType,
  ProductSetResult,
} from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { hooks, Box, Spinner } from '@sradevski/blocks-ui';
import { ProductSet } from './ProductSet';

export const ManagedSets = React.memo(
  ({
    storeId,
    setTags = [],
    ...props
  }: {
    storeId: string | null;
    setTags: ProductSetType[];
  } & React.ComponentProps<typeof Box>) => {
    const [caller, showSpinner] = hooks.useCall();
    const [productSets, setProductSets] = useState<ProductSetResult[]>([]);

    useEffect(() => {
      if (!storeId) {
        return;
      }

      caller(
        sdk.product.getProductSetsForStore(storeId, setTags),
        setProductSets,
      );
    }, [storeId, setTags]);

    if (!setTags.length) {
      return null;
    }

    return (
      <Spinner isLoaded={!showSpinner}>
        <Box {...props}>
          {productSets
            .filter(set => Boolean(set.data))
            .map(set => (
              <Box my={[6, 7, 7]}>
                <ProductSet
                  set={set}
                  storeId={storeId}
                  key={set.setTag.type + (set.setTag.value || '')}
                />
              </Box>
            ))}
        </Box>
      </Spinner>
    );
  },
  // Perform deep equal so we can pass the tags array inline without memoizing it everywhere.
  isEqual,
);
