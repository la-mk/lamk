import isEqual from "lodash/isEqual";
import React, { useState, useEffect } from "react";
import {
  ProductSet as ProductSetType,
  ProductSetResult,
} from "@la-mk/la-sdk/dist/models/product";
import { hooks, Box, Spinner } from "@la-mk/blocks-ui";
import { ProductSet } from "./ProductSet";
import { Store } from "../../domain/store";
import { sdk } from "@la-mk/la-sdk";

const ManagedSetsBase = ({
  store,
  setTags = [],
  ...props
}: {
  store: Store | null;
  setTags: ProductSetType[];
} & React.ComponentProps<typeof Box>) => {
  const [caller, showSpinner] = hooks.useCall();
  const [productSets, setProductSets] = useState<ProductSetResult[]>([]);

  useEffect(() => {
    if (!store?._id) {
      return;
    }

    caller(
      sdk.product.getProductSetsForStore(store._id, setTags),
      setProductSets
    );
  }, [store, setTags]);

  if (!setTags.length) {
    return null;
  }

  return (
    <Spinner isLoaded={!showSpinner}>
      <Box {...props}>
        {productSets
          .filter((set) => Boolean(set.data))
          .map((set) => (
            <Box my={[8, 9, 9]}>
              <ProductSet
                set={set}
                store={store}
                key={set.setTag.type + (set.setTag.value || "")}
              />
            </Box>
          ))}
      </Box>
    </Spinner>
  );
};

export const ManagedSets = React.memo(
  ManagedSetsBase,
  // Perform deep equal so we can pass the tags array inline without memoizing it everywhere.
  isEqual
);
