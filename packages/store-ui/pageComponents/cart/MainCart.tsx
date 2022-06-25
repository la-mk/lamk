import React, { useEffect } from "react";
import { Box, Flex, Result, Spinner } from "@la-mk/blocks-ui";
import { AnalyticsEvents } from "@la-mk/analytics";
import { TFunction, useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { Store } from "../../domain/store";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useCart } from "../../hooks/useCart";
import { User } from "../../domain/user";
import { useQuery } from "../../sdk/useQuery";
import { useRouter } from "next/router";
import { Page } from "../../layout/Page";
import { OrderProductsList } from "../../components/product/OrderProductsList";
import { Summary } from "../account/orders/Summary";
import {
  getSubtitleForSet,
  getTitleForSet,
  ProductSetType,
} from "../../domain/set";
import { ProductSet } from "../../components/sets/ProductSet";
import { OrderItem } from "../../domain/order";
import { urls } from "../../tooling/url";

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

export const Cart = ({ store, user }: { store: Store; user?: User }) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { trackEvent } = useAnalytics(store._id);
  const { cart, removeFromCart, changeQuantityInCart } = useCart(
    store,
    user,
    t
  );

  const [campaigns] = useQuery("campaign", "findActiveForStore", [store._id]);
  const [delivery] = useQuery("delivery", "findForStore", [store._id]);
  const [sets, isLoadingSets] = useQuery("product", "getProductSetsForStore", [
    store._id,
    getSets(t),
  ]);

  useBreadcrumbs([
    { url: urls.home, title: t("pages.home") },
    { url: urls.cart, title: t("pages.myCart") },
  ]);

  useEffect(() => {
    trackEvent(AnalyticsEvents.viewCart, {});
  }, [trackEvent]);

  if (cart.items.length === 0) {
    return (
      <Result
        status="empty"
        mt={8}
        description={t("cart.emptyCartDescription")}
      />
    );
  }

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
    router.push(urls.checkout);
  };

  return (
    <Page>
      <Spinner isLoaded={true}>
        <Flex width="100%" align="flex-start" wrap="wrap">
          <Flex direction="column" flex={2} mx={[1, 2, 2]} my={3}>
            <OrderProductsList
              items={cart.items}
              store={store}
              currency={store.preferences?.currency ?? "mkd"}
              handleRemove={handleRemove}
              handleChangeItemQuantity={handleChangeQuantity}
            />
          </Flex>
          <Flex align="center" justify="center" flex={1} mx={[1, 2, 2]} my={3}>
            <Summary
              store={store}
              currency={store.preferences?.currency ?? "mkd"}
              showContinueShopping
              items={cart.items}
              delivery={delivery?.data?.[0]!}
              campaigns={campaigns?.data ?? []}
              buttonTitle={t("actions.toCheckout")}
              disabled={false}
              onCheckout={handleCheckout}
            />
          </Flex>
        </Flex>
      </Spinner>

      <Spinner isLoaded={!isLoadingSets}>
        <Box mt={8}>
          {(sets ?? [])
            .filter((set) => Boolean(set.data))
            .map((set, i) => (
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
    </Page>
  );
};
