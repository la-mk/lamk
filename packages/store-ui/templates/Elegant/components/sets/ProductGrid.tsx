import React from "react";
import { DataGrid, Box, hooks } from "@la-mk/blocks-ui";
import { SetTitle } from "./SetTitle";
import { Store } from "../../../../domain/store";
import { getSetHref, ProductSetResult } from "../../../../domain/set";
import { useTranslation } from "next-i18next";
import { SeeAllLink } from "./SeeAllLink";
import { ProductCard } from "../product/ProductCard/ProductCard";

interface ProductGridProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductGrid = ({ set, store }: ProductGridProps) => {
  const { t } = useTranslation("translation");
  const productCount = hooks.useBreakpoint([4, 4, 6]);

  const allHref = getSetHref(set);
  const products = set.data;

  if (!products) {
    return null;
  }

  const productsToShow = products.slice(0, productCount);
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
            <ProductCard product={item} store={store} />
          </Box>
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
