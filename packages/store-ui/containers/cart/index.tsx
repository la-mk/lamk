import { Cart as StandardCart } from "../../templates/Standard/cart";
import { Cart as ElegantCart } from "../../templates/Elegant/cart";
import { Templates } from "..";
import { User } from "../../domain/user";
import { Store } from "../../domain/store";
import { useRouter } from "next/router";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useCart } from "../../hooks/useCart";
import { TFunction, useTranslation } from "next-i18next";
import { useQuery } from "../../sdk/useQuery";
import { useEffect } from "react";
import { AnalyticsEvents } from "@la-mk/analytics";
import { OrderItem } from "../../domain/order";
import { urls } from "../../tooling/url";
import { CartWithProducts } from "../../domain/cart";
import { Delivery } from "../../domain/delivery";
import { Campaign } from "../../domain/campaign";
import {
  getSubtitleForSet,
  getTitleForSet,
  ProductSetResult,
  ProductSetType,
} from "../../domain/set";
import { useAuth } from "../../hooks/useAuth";

const getSets = (t: TFunction) => [
  {
    title: t(
      getTitleForSet({
        type: ProductSetType.LATEST,
        value: undefined,
      })
    ),
    subtitle: t(
      getSubtitleForSet({
        type: ProductSetType.LATEST,
        value: undefined,
      })
    ),
    type: ProductSetType.LATEST,
    value: undefined,
    isPromoted: false,
  },
];

export interface CartProps {
  store: Store;
  cart: CartWithProducts;
  delivery: Delivery | undefined;
  campaigns: Campaign[];
  sets: ProductSetResult[];
  isLoadingSummaryData: boolean;
  isLoadingSets: boolean;
  handleRemoveFromCart: (cartItem: OrderItem) => void;
  handleOnCheckout: () => void;
  handleChangeQuantity: (cartItem: OrderItem, newQuantity: number) => void;
}

export const Cart = ({
  template,
  store,
  user,
}: {
  template: Templates;
  store: Store;
  user: User | undefined;
}) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { login } = useAuth();
  const { trackEvent } = useAnalytics(store._id);
  const { cart, removeFromCart, changeQuantityInCart } = useCart(
    store._id,
    user,
    t
  );

  const [campaigns, isLoadingCampaigns] = useQuery(
    "campaign",
    "findActiveForStore",
    [store._id]
  );
  const [delivery, isLoadingDelivery] = useQuery("delivery", "findForStore", [
    store._id,
  ]);
  const [sets, isLoadingSets] = useQuery("product", "getProductSetsForStore", [
    store._id,
    getSets(t),
  ]);

  useEffect(() => {
    trackEvent(AnalyticsEvents.viewCart, {});
  }, [trackEvent]);

  const handleRemove = (cartItem: OrderItem) => {
    removeFromCart({ ...cartItem, fromStore: cartItem.product.soldBy });

    trackEvent(AnalyticsEvents.removeItemFromCart, {
      productId: cartItem.product._id,
      attributes: cartItem.product.attributes
        ? JSON.stringify(cartItem.product.attributes)
        : undefined,
      category: cartItem.product.category,
      price: cartItem.product.calculatedPrice,
      discount: cartItem.product.discount,
      quantity: cartItem.quantity,
    });
  };

  const handleChangeQuantity = (cartItem: OrderItem, newQuantity: number) => {
    changeQuantityInCart(
      { ...cartItem, fromStore: cartItem.product.soldBy },
      newQuantity
    );
  };

  const handleCheckout = () => {
    if (!user) {
      login();
    } else {
      router.push(urls.checkout);
    }
  };

  const props = {
    store,
    cart,
    delivery: delivery?.data?.[0],
    campaigns: campaigns?.data ?? [],
    sets: sets ?? [],
    isLoadingSummaryData: isLoadingCampaigns || isLoadingDelivery,
    isLoadingSets: isLoadingSets,
    handleRemoveFromCart: handleRemove,
    handleOnCheckout: handleCheckout,
    handleChangeQuantity,
  };

  switch (template) {
    case "standard":
      return <StandardCart {...props} />;
    case "elegant":
      return <ElegantCart {...props} />;
  }
};
