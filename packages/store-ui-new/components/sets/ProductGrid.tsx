import React from "react";
import { DataGrid, Box, hooks } from "@la-mk/blocks-ui";
import { ProductSetResult } from "@la-mk/la-sdk/dist/models/product";
import { SetTitle } from "./SetTitle";
import { Store } from "../../domain/store";
import { getSetHref } from "../../domain/set";
import { useTranslation } from "next-i18next";
import { ProductCard } from "../product/ProductCard";
import { SeeAllLink } from "./SeeAllLink";

interface ProductGridProps {
  set: ProductSetResult;
  store: Store;
  horizontal?: boolean;
}

export const ProductGrid = ({ set, store, horizontal }: ProductGridProps) => {
  const { t } = useTranslation();
  const productCount = hooks.useBreakpoint([6, 6, 8]);
  const productCountHorizontal = hooks.useBreakpoint([3, 4, 6]);

  const allHref = getSetHref(set);
  const products = set.data;

  if (!products) {
    return null;
  }

  const productsToShow = products.slice(
    0,
    horizontal ? productCountHorizontal : productCount
  );

  return (
    <>
      <SetTitle title={set.setTag.title ?? ""} subtitle={set.setTag.subtitle} />
      <DataGrid
        isLoaded={true}
        spacing={[4, 5, 5]}
        rowKey="_id"
        items={productsToShow}
        renderItem={(item) => (
          <Box mb={"auto"}>
            <ProductCard product={item} store={store} horizontal={horizontal} />
          </Box>
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
