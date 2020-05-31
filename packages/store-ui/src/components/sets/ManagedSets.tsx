import React, { useState, useEffect } from 'react';
import {
  ProductSet as ProductSetType,
  ProductSetTag,
} from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { hooks, Box, Spin } from '@sradevski/blocks-ui';
import { ProductSet } from './ProductSet';

export const ManagedSets = ({
  storeId,
  setTags = [],
  ...props
}: {
  storeId: string | null;
  setTags: ProductSetTag[];
} & React.ComponentProps<typeof Box>) => {
  const [caller, showSpinner] = hooks.useCall();
  const [productSets, setProductSets] = useState<ProductSetType[]>([]);

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
    <Spin spinning={showSpinner}>
      <Box {...props}>
        {productSets
          .filter(set => Boolean(set.data))
          .map(set => (
            <Box my={[6, 7, 7]}>
              <ProductSet
                set={set}
                storeId={storeId}
                key={set.setTag.name + (set.setTag.value || '')}
              />
            </Box>
          ))}
      </Box>
    </Spin>
  );
};
