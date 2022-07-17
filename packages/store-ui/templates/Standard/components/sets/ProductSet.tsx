import React from "react";
import { Box, Carousel } from "@la-mk/blocks-ui";
import { SetTitle } from "./SetTitle";
import { Store } from "../../../../domain/store";
import { getSetHref, ProductSetResult } from "../../../../domain/set";
import { SeeAllLink } from "./SeeAllLink";
import { useTranslation } from "next-i18next";
import { Product } from "../../../../domain/product";
import { ProductCard } from "../product/ProductCard/ProductCard";

interface ProductSetProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductSet = ({ set, store }: ProductSetProps) => {
  const { t } = useTranslation("translation");
  const allHref = getSetHref(set);
  const products = set.data;

  if (products?.length === 0) {
    return null;
  }

  return (
    <>
      <SetTitle title={set.setTag.title ?? ""} subtitle={set.setTag.subtitle} />
      <Carousel
        navigation="arrows"
        loop
        skipSnaps
        slidesToScroll={"auto"}
        items={products ?? []}
        renderItem={(product: Product) => (
          <Box mx="2">
            <ProductCard key={product._id} product={product} store={store} />
          </Box>
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
