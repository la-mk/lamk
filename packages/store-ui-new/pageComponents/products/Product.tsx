import React, { useState, useEffect } from "react";
import { Flex, Box, Spinner, utils } from "@la-mk/blocks-ui";
import { session, AnalyticsEvents } from "@la-mk/analytics";
import { Store } from "../../domain/store";
import { Delivery } from "../../domain/delivery";
import {
  Attributes,
  getVariantForAttributes,
  hasVariants,
  OrderedProduct,
  Product as ProductType,
  ProductSetType,
} from "../../domain/product";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { Page } from "../../layout/Page";
import { ProductDescription } from "./ProductDescription";
import { ProductImage } from "./ProductImage";
import { ProductOptions } from "./ProductOptions";
import { ProductDetails } from "./ProductDetails";
import { CartWithProducts } from "../../domain/cart";
import { useAnalytics } from "../../hooks/useAnalytics";

interface ProductProps {
  product: ProductType;
  store: Store;
  cart: CartWithProducts;
  delivery?: Delivery;
  isLoadingProduct: boolean;
  addToCart: (
    attributes: Attributes,
    quantity: number
  ) => Promise<OrderedProduct | undefined>;
}

const getProductsHref = (href: string) => {
  if (!href) {
    return "/products";
  }

  const url = new URL(href);

  if (
    url.pathname.startsWith("/products") &&
    url.pathname.split("/").length <= 2
  ) {
    return url.pathname + url.search;
  }

  return "/products";
};

export const Product = ({
  product,
  store,
  cart,
  delivery,
  isLoadingProduct,
  addToCart,
}: ProductProps) => {
  const { trackEvent, previousPage } = useAnalytics(store._id);

  // If the product has at least one attribute, it means it has variants.
  const hasAttributes = hasVariants(product);
  const outOfStock = product.totalStock === 0;
  const hasSingleAvailableVariant =
    hasAttributes && !outOfStock && product.variants.length === 1;

  const [chosenAttributes, setChosenAttributes] = useState<
    Attributes | undefined
  >(undefined);

  const [trackedEvent, setTrackedEvent] = useState(false);
  const { t } = useTranslation("translation");

  const [quantity, setQuantity] = React.useState(1);
  const selectedVariant = getVariantForAttributes(product, chosenAttributes);

  useBreadcrumbs(
    [
      { url: "/", title: t("pages.home") },
      {
        url: getProductsHref(previousPage ?? ""),
        title: t("pages.product_plural"),
      },
      {
        urlPattern: "/products/[pid]",
        url: `/products/${product._id}`,
        title: product.name.slice(0, 40),
      },
    ],
    [product?._id]
  );

  useEffect(() => {
    if (!product?._id) {
      return;
    }

    setQuantity(1);
    setTrackedEvent(false);
    setChosenAttributes(
      hasSingleAvailableVariant
        ? product.variants[0].attributes
        : hasAttributes
        ? {}
        : undefined
    );
  }, [
    product?._id,
    product?.variants,
    hasAttributes,
    hasSingleAvailableVariant,
  ]);

  useEffect(() => {
    if (!product || trackedEvent) {
      return;
    }

    const previousPage = session.getSessionInfo()?.previousPage;
    const filters = utils.filter.parseFiltersUrl(previousPage ?? "");
    const searchTerm = filters.searching ?? "";
    const filterings = Object.keys(filters.filtering ?? {});
    const onPage = filters.pagination?.currentPage;
    const pageSize = filters.pagination?.pageSize;

    trackEvent(AnalyticsEvents.viewProduct, {
      productId: product._id,
      category: product.category,
      searchTerm,
      filterings: filterings.length > 0 ? filterings : undefined,
      onPage,
      pageSize,
    });

    setTrackedEvent(true);
  }, [product, trackedEvent, trackEvent]);

  const handleAddToCart = async () => {
    try {
      const orderedProduct = await addToCart(chosenAttributes!, quantity);
      if (!orderedProduct) {
        return;
      }

      trackEvent(AnalyticsEvents.addItemToCart, {
        productId: orderedProduct._id,
        attributes: JSON.stringify(chosenAttributes),
        category: orderedProduct.category,
        price: orderedProduct.calculatedPrice,
        discount: orderedProduct.discount,
        quantity,
      });
    } catch {
      // Handle error if necessary
    }
  };

  return (
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
              handleAddToCart={handleAddToCart}
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
      {/* TODO: Add sets */}
      {/* 
      <ManagedSets
        mt={[8, 9, 9]}
        store={store}
        setTags={[
          {
            title: t(
              getTitleForSet({
                type: ProductSetType.CATEGORY,
                value: product.category,
              })
            ),
            subtitle: t(
              getSubtitleForSet({
                type: ProductSetType.CATEGORY,
                value: product.category,
              })
            ),
            type: ProductSetType.CATEGORY,
            value: product.category,
            isPromoted: false,
          },
          {
            title: t(
              getTitleForSet({
                type: ProductSetType.DISCOUNTED,
                value: undefined,
              })
            ),
            subtitle: t(
              getSubtitleForSet({
                type: ProductSetType.DISCOUNTED,
                value: undefined,
              })
            ),
            type: ProductSetType.DISCOUNTED,
            value: undefined,
            isPromoted: false,
          },
        ]}
      />

      <Box mt={[8, 9, 9]}>
        <ServicesSet />
      </Box> */}
    </Page>
  );
};
