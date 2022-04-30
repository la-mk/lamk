import React from "react";
import { Box } from "@la-mk/blocks-ui";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { Category } from "../../domain/category";
import { CategoriesFilter } from "../../components/filters/CategoriesFilter";
import { PriceFilter } from "../../components/filters/PriceFilter";

// A pretty random max price, until we have a better method to calculate it for each query.
const MAX_PRICE = 100000;
const MIN_PRICE = 0;

interface ProductsSidemenuProps {
  currency: string;
  categories: Category[];
  filters: FilterObject;
  setFilters: (filters: FilterObject) => void;
}

export const ProductsSidemenu = ({
  filters,
  setFilters,
  currency,
  categories,
  ...props
}: ProductsSidemenuProps & React.ComponentProps<typeof Box>) => {
  return (
    <Box minWidth="16rem" {...props}>
      <CategoriesFilter
        categories={categories}
        mb={6}
        filters={filters}
        onChange={setFilters}
      />

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
