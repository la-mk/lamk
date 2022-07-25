import React from "react";
import { Heading, Flex, Box, Image } from "@la-mk/blocks-ui";
import { TFunction, useTranslation } from "next-i18next";
import { Product } from "../../../../../domain/product";
import { Store } from "../../../../../domain/store";
import { Price } from "./Price";
import { getImageURL } from "../../../../../hacks/imageUrl";
import { urls } from "../../../../../tooling/url";
import { HoverableLink } from "../../../../../components/HoverableLink";

export interface ProductCardProps {
  product: Product;
  store: Store;
}

const ProductDescription = ({
  t,
  product,
  store,
}: {
  t: TFunction;
  product: Product;
  store: Store;
}) => {
  const headingLines = 2;
  /* Make sure the heading always occupies the same height */
  // const headingHeight =`${
  //   headingLines +
  //   (theme.components.Heading.sizes.sm.lineHeight * headingLines -
  //     headingLines)
  // }em`

  return (
    <Box py={0}>
      <Heading mb={1} as="h3" size="sm" noOfLines={headingLines}>
        {product.name}
      </Heading>

      <Price
        minCalculatedPrice={product.minCalculatedPrice ?? 0}
        maxCalculatedPrice={product.maxCalculatedPrice ?? 0}
        minPrice={product.minPrice ?? 0}
        maxPrice={product.maxPrice ?? 0}
        currency={t(`currencies.${store.preferences?.currency ?? "mkd"}`)}
      />
    </Box>
  );
};

const ProductImage = ({
  store,
  product,
  width,
  height,
  t,
}: {
  store: Store;
  product: Product;
  width: number[];
  height: number[];
  t: TFunction;
}) => {
  return (
    <Flex
      height={height}
      justify="center"
      align="center"
      bg="gray.100"
      // @ts-ignore
      style={{ position: "relative" }}
      mb={4}
      mr={0}
      p={5}
    >
      <Image
        style={{ objectFit: "contain" }}
        height={height}
        getSrc={(params) =>
          getImageURL(product.media[0]?._id, store._id, params)
        }
        alt={product.name}
      />
    </Flex>
  );
};

export const ProductCard = ({ product, store }: ProductCardProps) => {
  const { t } = useTranslation("translation");

  return (
    <HoverableLink
      href={`${urls.products}/[pid]`}
      as={`${urls.products}/${product._id}`}
    >
      <Flex direction={"column"} p={[1, 3, 3]} my={2} width={[300, 300, 420]}>
        <ProductImage
          t={t}
          store={store}
          product={product}
          height={[300, 300, 420]}
          width={[300, 300, 420]}
        />

        <ProductDescription t={t} store={store} product={product} />
      </Flex>
    </HoverableLink>
  );
};
