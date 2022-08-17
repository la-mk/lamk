import React from "react";
import { Box, Button, Flex, Result, Spinner, Text } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { ProductSet } from "../components/sets/ProductSet";
import { CartProps } from "../../../containers/cart";
import { OrderProductsList } from "../components/product/OrderProductsList";
import { calculatePrices } from "../../../domain/order";
import Link from "next/link";
import { urls } from "../../../tooling/url";

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
      <Flex align={"center"} justify="center" direction={"column"}>
        <Result
          status="empty"
          mt={9}
          description={t("cart.emptyCartDescription")}
        />
        <Link href={urls.products} passHref>
          <Button mx="auto" size="lg" mt={6} as="a" variant="solid">
            {t("actions.shopNow")}
          </Button>
        </Link>
      </Flex>
    );
  }

  const prices: any = !isLoadingSummaryData
    ? calculatePrices(cart.items, delivery!, campaigns)
    : {};

  const currency = store.preferences?.currency ?? "mkd";

  return (
    <>
      <Page title={t("pages.cart")}>
        <Spinner isLoaded={!isLoadingSummaryData}>
          <Flex
            px={[4, 5, 6]}
            direction="column"
            align="center"
            justify="center"
          >
            <Text mb={7} mx="auto" size="md" color="mutedText.dark">
              {t("delivery.addToGetFreeDelivery", {
                priceUntilFreeDelivery: `${
                  (delivery?.freeDeliveryOver ?? 0) -
                  (prices.withCampaignsTotal ?? 0)
                } ${t(`currencies.${currency}`)}`,
              })}
            </Text>

            <Flex
              maxWidth={"60rem"}
              width="100%"
              align="flex-start"
              wrap="wrap"
            >
              <Flex direction="column" flex={2} mx={[1, 2, 2]} my={3}>
                <OrderProductsList
                  items={cart.items}
                  store={store}
                  currency={store.preferences?.currency ?? "mkd"}
                  handleRemove={handleRemoveFromCart}
                  handleChangeItemQuantity={handleChangeQuantity}
                />
                <Flex ml="auto" mt={4} direction="row">
                  <Text color="mutedText.dark">
                    {t("finance.subtotal")}:
                    <Text ml={2}>
                      {prices.productsTotal} {t(`currencies.${currency}`)}
                    </Text>
                  </Text>
                </Flex>
                <Flex ml="auto" mt={4} direction="row">
                  <Text color="mutedText.dark">
                    {t("finance.shippingCost")}:
                    <Text ml={2}>
                      {prices.deliveryTotal} {t(`currencies.${currency}`)}
                    </Text>
                  </Text>
                </Flex>
                <Flex ml="auto" mt={4} direction="row">
                  <Text color="mutedText.dark">{t("finance.total")}:</Text>
                  <Text as="strong" ml={2}>
                    {prices.total} {t(`currencies.${currency}`)}
                  </Text>
                </Flex>

                {handleOnCheckout && (
                  <Button
                    onClick={handleOnCheckout}
                    size="lg"
                    ml="auto"
                    mt={5}
                    // @ts-ignore
                    width={["100%", "20rem", "20rem"]}
                  >
                    {t("actions.toCheckout")}
                  </Button>
                )}
              </Flex>
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
