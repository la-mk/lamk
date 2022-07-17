import React from "react";
import { Box, Flex, Result, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { OrderProductsList } from "../components/product/OrderProductsList";
import { Summary } from "../account/orders/Summary";
import { ProductSet } from "../components/sets/ProductSet";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CartProps } from "../../../containers/cart";

export const Cart = ({
  store,
  cart,
  delivery,
  campaigns,
  sets,
  isLoadingSummaryData,
  isLoadingSets,
  handleRemoveFromCart,
  handleOnCheckout,
  handleChangeQuantity,
}: CartProps) => {
  const { t } = useTranslation("translation");

  if (cart.items.length === 0) {
    return (
      <Result
        status="empty"
        mt={8}
        description={t("cart.emptyCartDescription")}
      />
    );
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.cart, title: t("pages.myCart") },
        ]}
      />
      <Page>
        <Spinner isLoaded={true}>
          <Flex width="100%" align="flex-start" wrap="wrap">
            <Flex direction="column" flex={2} mx={[1, 2, 2]} my={3}>
              <OrderProductsList
                items={cart.items}
                store={store}
                currency={store.preferences?.currency ?? "mkd"}
                handleRemove={handleRemoveFromCart}
                handleChangeItemQuantity={handleChangeQuantity}
              />
            </Flex>
            <Flex
              align="center"
              justify="center"
              flex={1}
              mx={[1, 2, 2]}
              my={3}
            >
              <Spinner isLoaded={!isLoadingSummaryData}>
                <Summary
                  store={store}
                  currency={store.preferences?.currency ?? "mkd"}
                  showContinueShopping
                  items={cart.items}
                  delivery={delivery!}
                  campaigns={campaigns ?? []}
                  buttonTitle={t("actions.toCheckout")}
                  disabled={false}
                  onCheckout={handleOnCheckout}
                />
              </Spinner>
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
    </>
  );
};
