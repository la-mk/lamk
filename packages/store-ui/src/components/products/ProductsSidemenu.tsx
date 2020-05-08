import React from 'react';
import { Divider } from '@sradevski/blocks-ui';
import { CategoriesFilter } from '../shared/Filters/CategoriesFilter';
import { PriceFilter } from '../shared/Filters/PriceFilter';
import { SortFilter } from '../shared/Filters/SortFilter';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

// A pretty random max price, until we have a better method to calculate it for each query.
const MAX_PRICE = 20000;
const MIN_PRICE = 0;

interface ProductsSidemenuProps {
  filters: FilterObject;
  setFilters: (filters: FilterObject) => void;
}

export const ProductsSidemenu = ({
  filters,
  setFilters,
}: ProductsSidemenuProps) => {
  return (
    <>
      <CategoriesFilter mode='inline' filters={filters} onChange={setFilters} />
      <Divider />
      <PriceFilter
        filters={filters}
        max={MAX_PRICE}
        min={MIN_PRICE}
        onChange={setFilters}
      />
      <Divider />
      <SortFilter filters={filters} onChange={setFilters} />
    </>
  );
};
