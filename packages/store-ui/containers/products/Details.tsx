import { Product as StandardProduct } from "../../templates/Standard/products/Product";
import { Product as ElegantProduct } from "../../templates/Elegant/products/Product";
import { Templates } from "..";
import {
  Attributes,
  getVariantForAttributes,
  hasVariants,
  OrderedProduct,
  Product as ProductType,
  Variant,
} from "../../domain/product";
import { Store } from "../../domain/store";
import { CartWithProducts } from "../../domain/cart";
import { Delivery } from "../../domain/delivery";
import { useCart } from "../../hooks/useCart";
import { TFunction, useTranslation } from "next-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "../../sdk/useQuery";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useEffect, useState } from "react";
import { utils } from "@la-mk/blocks-ui";
import { AnalyticsEvents } from "@la-mk/analytics";
import {
  getSubtitleForSet,
  getTitleForSet,
  ProductSetResult,
  ProductSetType,
} from "../../domain/set";

export interface ProductProps {
  product: ProductType;
  store: Store;
  cart: CartWithProducts;
  delivery?: Delivery;
  sets?: ProductSetResult[];
  isLoadingSets: boolean;
  isLoadingProduct: boolean;
  chosenAttributes: Attributes | undefined;
  setChosenAttributes: (attributes: Attributes) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  outOfStock: boolean;
  selectedVariant: Variant | undefined | null;
  onAddToCart: () => void;
  previousPage: string | undefined;
}

const getSets = (product: ProductType, t: TFunction) => [
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
];

export const Product = ({
  template,
  store,
  isLoadingProduct,
  product,
}: {
  template: Templates;
  store: Store;
  isLoadingProduct: boolean;
  product: ProductType;
}) => {
  const { user } = useAuth();
  const { t } = useTranslation("translation");
  const { cart, addToCart } = useCart(store._id, user, t);
  const { trackEvent, getSessionInfo } = useAnalytics(store._id);
  const [sets, isLoadingSets] = useQuery("product", "getProductSetsForStore", [
    store._id,
    getSets(product, t),
  ]);
  const [delivery, isLoadingDelivery] = useQuery("delivery", "findForStore", [
    store._id,
  ]);

  // If the product has at least one attribute, it means it has variants.
  const hasAttributes = hasVariants(product);
  const outOfStock = product.totalStock === 0;
  const hasSingleAvailableVariant =
    hasAttributes && !outOfStock && product.variants.length === 1;

  const [chosenAttributes, setChosenAttributes] = useState<
    Attributes | undefined
  >(undefined);

  const [trackedEvent, setTrackedEvent] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const selectedVariant = getVariantForAttributes(product, chosenAttributes);

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

    const previousPage = getSessionInfo()?.previousPage;
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
  }, [product, trackedEvent, trackEvent, getSessionInfo]);

  const handleAddToCart = async () => {
    try {
      const orderedProduct = await addToCart(
        product,
        chosenAttributes!,
        quantity
      );
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

  const props = {
    store,
    delivery: delivery?.data?.[0],
    product,
    cart,
    sets: sets?.filter((set) => Boolean(set.data)),
    isLoadingSets,
    isLoadingProduct,
    chosenAttributes,
    setChosenAttributes,
    quantity,
    setQuantity,
    outOfStock,
    selectedVariant,
    onAddToCart: handleAddToCart,
    previousPage: getSessionInfo()?.previousPage,
  };

  switch (template) {
    case "standard":
      return <StandardProduct {...props} />;
    case "elegant":
      return <ElegantProduct {...props} />;
  }
};
