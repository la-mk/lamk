import React from "react";
import { Flex, Box, Spinner } from "@la-mk/blocks-ui";
import { Page } from "../Page";
import { ProductDescription } from "./ProductDescription";
import { ProductImage } from "./ProductImage";
import { ProductOptions } from "./ProductOptions";
import { ProductDetails } from "./ProductDetails";
import { ProductSet } from "../components/sets/ProductSet";
import { ServicesSet } from "../components/sets/ServicesSet";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductProps } from "../../../containers/products/Details";
import { useTranslation } from "next-i18next";

const getProductsHref = (href: string) => {
  if (!href) {
    return urls.products;
  }

  const url = new URL(href);
  if (url.pathname.includes(urls.products) && !!url.search) {
    return url.pathname + url.search;
  }

  return urls.products;
};

export const Product = ({
  product,
  store,
  cart,
  delivery,
  sets,
  isLoadingSets,
  isLoadingProduct,
  outOfStock,
  selectedVariant,
  chosenAttributes,
  setChosenAttributes,
  quantity,
  setQuantity,
  onAddToCart,
  previousPage,
}: ProductProps) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          {
            url: getProductsHref(previousPage ?? ""),
            title: t("pages.product_plural"),
          },
          {
            urlPattern: `${urls.products}/[pid]`,
            url: `${urls.products}/${product._id}`,
            title: product.name.slice(0, 40),
          },
        ]}
      />
      <Page>
        <Spinner isLoaded={!isLoadingProduct}>
          <Flex direction={["column", "row", "row"]}>
            <ProductImage product={product} store={store} />
            <Flex
              ml={[0, 2, 2]}
              width={["100%", "50%", "50%"]}
              align={["center", "flex-start", "flex-start"]}
              justify="flex-start"
              direction="column"
            >
              <ProductDescription
                store={store}
                product={product}
                selectedVariant={selectedVariant}
                outOfStock={outOfStock}
              />

              <ProductOptions
                product={product}
                cart={cart}
                selectedVariant={selectedVariant}
                outOfStock={outOfStock}
                chosenAttributes={chosenAttributes}
                setChosenAttributes={setChosenAttributes}
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCart={onAddToCart}
              />
              <Box width="100%" mx={[4, 0, 0]} mt={[6, 7, 7]}>
                <ProductDetails
                  store={store}
                  product={product}
                  delivery={delivery}
                />
              </Box>
            </Flex>
          </Flex>
        </Spinner>

        <Spinner isLoaded={!isLoadingSets}>
          <Box mt={[8, 9, 9]}>
            {(sets ?? []).map((set, i) => (
              <Box key={set.setTag.value ?? i} my={[8, 9, 9]}>
                <ProductSet
                  set={set}
                  store={store}
                  key={set.setTag.type + (set.setTag.value || "")}
                />
              </Box>
            ))}
          </Box>
        </Spinner>

        <Box mt={[8, 9, 9]}>
          <ServicesSet store={store} delivery={delivery} />
        </Box>
      </Page>
    </>
  );
};
