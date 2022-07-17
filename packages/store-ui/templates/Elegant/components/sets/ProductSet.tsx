import React from "react";
import { Box, Carousel, hooks } from "@la-mk/blocks-ui";
import { SetTitle } from "./SetTitle";
import { getSetHref, ProductSetResult } from "../../../../domain/set";
import { ProductCard } from "../product/ProductCard/ProductCard";
import { SeeAllLink } from "./SeeAllLink";
import { useTranslation } from "next-i18next";
import { Product } from "../../../../domain/product";
import { Store } from "../../../../domain/store";

interface ProductSetProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductSet = ({ set, store }: ProductSetProps) => {
  const { t } = useTranslation("translation");
  const allHref = getSetHref(set);
  const products = set.data;
  const navigation: "none" | "arrows" = hooks.useBreakpoint([
    "none",
    "arrows",
    "arrows",
  ]);

  if (products?.length === 0) {
    return null;
  }

  return (
    <>
      <SetTitle title={set.setTag.title ?? ""} subtitle={set.setTag.subtitle} />
      <Carousel
        // @ts-ignore
        align="center"
        navigation={navigation}
        loop
        skipSnaps
        slidesToScroll={"auto"}
        items={products ?? []}
        renderItem={(product: Product) => (
          <Box mx={[2, 3, 4]}>
            <ProductCard key={product._id} product={product} store={store} />
          </Box>
        )}
      />

      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
