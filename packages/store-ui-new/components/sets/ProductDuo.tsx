import React from "react";
import { ProductSetResult } from "@la-mk/la-sdk/dist/models/product";
import { SetTitle } from "./SetTitle";
import { Flex, Box } from "@la-mk/blocks-ui";
import { Store } from "../../domain/store";
import { getSetHref } from "../../domain/set";
import { useTranslation } from "next-i18next";
import { ProductCard } from "../product/ProductCard";
import { SeeAllLink } from "./SeeAllLink";

interface ProductSetProps {
  set: ProductSetResult;
  store: Store;
}

export const ProductDuo = ({ set, store }: ProductSetProps) => {
  const { t } = useTranslation();
  const allHref = getSetHref(set);
  const products = set.data;

  if (!products) {
    return null;
  }

  const productOne = products[0];
  const productTwo = products[1];

  return (
    <>
      <SetTitle title={set.setTag.title ?? ""} subtitle={set.setTag.subtitle} />
      <Flex
        align={["center", "center", "flex-start"]}
        justify="center"
        direction={["column", "column", "row"]}
      >
        <Box mr={productTwo ? [0, 0, 5] : 0}>
          <ProductCard emphasized detailed product={productOne} store={store} />
        </Box>
        {productTwo && (
          <Box ml={[0, 0, 5]}>
            <ProductCard
              emphasized
              detailed
              product={productTwo}
              store={store}
            />
          </Box>
        )}
      </Flex>
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
