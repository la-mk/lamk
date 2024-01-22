import React from "react";
import { Flex, Spinner, Heading, Text, Box } from "@la-mk/blocks-ui";
import { OrderDescription } from "./OrderDescription";
import { OrderSteps } from "./OrderSteps";
import { BackButton } from "../BackButton";
import { OrderStatus } from "../../../../domain/order";
import { useTranslation } from "next-i18next";
import { Page } from "../../Page";
import { CustomCard } from "../../components/CustomCard";
import { ShippingDescription } from "../../components/ShippingDescription";
import { sdk } from "../../../../sdk/sdk";
import { PaymentMethodNames } from "../../../../domain/payment";
import { Summary } from "../../components/cart/Summary";
import { ProductSet } from "../../components/sets/ProductSet";
import { urls } from "../../../../tooling/url";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { OrderProps } from "../../../../containers/account/orders/Details";

export const Order = ({
  store,
  order,
  isLoadingOrder,
  sets,
  isLoadingSets,
  onPayment,
}: OrderProps) => {
  const { t } = useTranslation("translation");
  const isCardPayment = order.paymentMethod === PaymentMethodNames.CREDIT_CARD;
  const shouldPay =
    order.status === OrderStatus.PENDING_PAYMENT && isCardPayment;

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.accountOrders, title: t("pages.order_plural") },
          {
            urlPattern: `${urls.accountOrders}/[oid]`,
            url: `${urls.accountOrders}/${order?._id}`,
            title: `${t("pages.order")} - ${
              order.orderNumber
                ? `#${order.orderNumber}`
                : sdk.utils.getShortId(order._id)
            }`,
          },
        ]}
      />
      <Page>
        <BackButton />
        <Spinner isLoaded={!isLoadingOrder}>
          <OrderSteps
            t={t}
            status={order.status}
            isCardPayment={isCardPayment}
          />

          <Flex
            mt={6}
            width="100%"
            justify="space-between"
            align={"flex-end"}
            wrap="wrap-reverse"
          >
            <Flex maxWidth={"60rem"} mx={[1, 3, 3]} flex={2} direction="column">
              <CustomCard my={3}>
                <OrderDescription
                  hideDetailsButton
                  order={order}
                  store={store}
                />
              </CustomCard>
              {order.deliverTo && (
                <CustomCard my={3}>
                  <ShippingDescription address={order.deliverTo} />
                </CustomCard>
              )}

              {order.buyerNote && (
                <CustomCard mt={3}>
                  <Heading mb={3} noOfLines={1} as="h4" size="sm">
                    {t("order.note")}
                  </Heading>
                  <Text color="mutedText.dark">{order.buyerNote}</Text>
                </CustomCard>
              )}
            </Flex>

            <Flex
              align={"flex-start"}
              justify="center"
              width="100%"
              flex={1}
              maxWidth={"60rem"}
              mx={[1, 3, 3]}
              my={3}
            >
              <Summary
                store={store}
                hideFreeShipping
                items={order.ordered}
                delivery={order.delivery}
                campaigns={order.campaigns ?? []}
                currency={order.currency}
                buttonTitle={shouldPay ? t("actions.toPayment") : undefined}
                onCheckout={shouldPay ? onPayment : undefined}
                title={t("finance.priceBreakdown")}
              />
            </Flex>
          </Flex>

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
        </Spinner>
      </Page>
    </>
  );
};
