import React from "react";
import { useTranslation } from "next-i18next";
import { OrderProps } from "../../../../containers/account/orders/Details";
import { PaymentMethodNames } from "../../../../domain/payment";
import { OrderStatus } from "../../../../domain/order";
import { Box, Card, Flex, Heading, Spinner, Text } from "@la-mk/blocks-ui";
import { OrderSteps } from "./OrderSteps";
import { OrderDescription } from "./OrderDescription";
import { ShippingDescription } from "../../components/addresses/ShippingDescription";
import { Summary } from "../../components/cart/Summary";
import { ProductSet } from "../../components/sets/ProductSet";

export const Order = ({
  store,
  order,
  isLoadingOrder,
  isLoadingSets,
  onPayment,
  sets,
}: OrderProps) => {
  const { t } = useTranslation("translation");
  const isCardPayment = order.paymentMethod === PaymentMethodNames.CREDIT_CARD;
  const shouldPay =
    order.status === OrderStatus.PENDING_PAYMENT && isCardPayment;

  return (
    <Box>
      <Spinner isLoaded={!isLoadingOrder}>
        <OrderSteps t={t} status={order.status} isCardPayment={isCardPayment} />

        <Flex
          mt={6}
          width="100%"
          justify="space-between"
          align={"flex-end"}
          wrap="wrap-reverse"
        >
          <Card
            minWidth={"20rem"}
            maxWidth={"60rem"}
            mx={[1, 3, 3]}
            my={3}
            flex={2}
          >
            <Flex direction="column">
              <Box my={4}>
                <OrderDescription
                  hideDetailsButton
                  order={order}
                  store={store}
                />
              </Box>
              {order.deliverTo && (
                <Box my={4}>
                  <ShippingDescription address={order.deliverTo} />
                </Box>
              )}

              {order.buyerNote && (
                <Box mt={4}>
                  <Heading mb={3} noOfLines={1} as="h4" size="sm">
                    {t("order.note")}
                  </Heading>
                  <Text color="mutedText.dark">{order.buyerNote}</Text>
                </Box>
              )}
            </Flex>
          </Card>

          <Flex
            align={"flex-start"}
            justify="center"
            width="100%"
            flex={1}
            minWidth={"20rem"}
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
    </Box>
  );
};
