import React from 'react';
import { Box } from '@la-mk/blocks-ui';
import { CategoriesFilter } from '../shared/Filters/CategoriesFilter';
import { PriceFilter } from '../shared/Filters/PriceFilter';
import { FilterObject } from '@la-mk/blocks-ui/dist/hooks/useFilter';

// A pretty random max price, until we have a better method to calculate it for each query.
const MAX_PRICE = 100000;
const MIN_PRICE = 0;

interface ProductsSidemenuProps {
  currency: string;
  filters: FilterObject;
  setFilters: (filters: FilterObject) => void;
}

export const ProductsSidemenu = ({
  filters,
  setFilters,
  currency,
  ...props
}: ProductsSidemenuProps & React.ComponentProps<typeof Box>) => {
  return (
    <Box minWidth='16rem' {...props}>
      <CategoriesFilter mb={6} filters={filters} onChange={setFilters} />

      <PriceFilter
        mt={6}
        filters={filters}
        max={MAX_PRICE}
        min={MIN_PRICE}
        onChange={setFilters}
        currency={currency}
      />
    </Box>
  );
};
