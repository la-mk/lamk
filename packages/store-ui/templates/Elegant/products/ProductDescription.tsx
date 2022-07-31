import React from "react";
import { Flex, Text, Heading } from "@la-mk/blocks-ui";
import { Product, Variant } from "../../../domain/product";
import { Store } from "../../../domain/store";
import { useTranslation } from "next-i18next";
import { Price } from "../components/product/ProductCard/Price";

export const ProductDescription = ({
  product,
  store,
  selectedVariant,
  outOfStock,
}: {
  store: Store;
  product: Product;
  selectedVariant?: Variant | null;
  outOfStock?: boolean;
}) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Heading mt={[3, 3, 6]} as="h1" size="lg" noOfLines={2}>
        {product.name}
      </Heading>
      <Flex
        mt={[3, 3, 3]}
        direction="column"
        align={["center", "flex-start", "flex-start"]}
        justify="center"
      >
        <Price
          size="large"
          minCalculatedPrice={
            (selectedVariant
              ? selectedVariant.calculatedPrice
              : product.minCalculatedPrice) ?? 0
          }
          maxCalculatedPrice={
            (selectedVariant
              ? selectedVariant.calculatedPrice
              : product.maxCalculatedPrice) ?? 0
          }
          minPrice={
            (selectedVariant ? selectedVariant.price : product.minPrice) ?? 0
          }
          maxPrice={
            (selectedVariant ? selectedVariant.price : product.maxPrice) ?? 0
          }
          currency={t(`currencies.${store.preferences?.currency ?? "mkd"}`)}
        />
        <Text color="mutedText.dark">{t(`units.${product.unit}`)}</Text>
      </Flex>
    </>
  );
};
