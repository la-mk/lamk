import { Button, Flex, Result, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { CheckoutProps } from "../../../containers/checkout";
import { PaymentMethodNames } from "../../../domain/payment";
import { urls } from "../../../tooling/url";
import { Summary } from "../components/cart/Summary";
import { Page } from "../Page";
import { SelectAddress } from "./SelectAddress";
import { SelectPaymentMethod } from "./SelectPaymentMethod";

export const Checkout = ({
  store,
  order,
  cart,
  user,
  campaigns,
  delivery,
  paymentMethods,
  isLoading,
  onOrder,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedDeliverTo,
  setSelectedDeliverTo,
}: CheckoutProps) => {
  const { t } = useTranslation("translation");
  // if (order && order.paymentMethod === PaymentMethodNames.PAY_ON_DELIVERY) {
  //   return <Success mt={[7, 8, 8]} order={order} />;
  // }

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

  return (
    <Flex
      minHeight="inherit"
      direction={["column", "column", "row"]}
      justify={["flex-start", "flex-start", "space-between"]}
      align={["center", "center", "stretch"]}
    >
      <Flex
        mt={6}
        px={4}
        maxWidth={"60rem"}
        minWidth={["20rem", "26rem", "28rem"]}
        width="100%"
        direction="column"
        mx={[1, 2, 4]}
        mb={3}
      >
        <SelectPaymentMethod
          storePaymentMethods={paymentMethods}
          paymentMethod={selectedPaymentMethod}
          setPaymentMethod={setSelectedPaymentMethod}
        />
        <SelectAddress
          storeId={store._id}
          deliverTo={selectedDeliverTo}
          setDeliverTo={setSelectedDeliverTo}
          user={user}
        />
      </Flex>

      <Flex
        align={"center"}
        justify="center"
        minWidth={["20rem", "26rem", "36rem"]}
        maxWidth={["100%", "100%", "44rem"]}
        width="100%"
      >
        <Summary
          store={store}
          currency={store.preferences?.currency ?? "mkd"}
          showProductsSummary
          items={cart.items}
          delivery={delivery!}
          campaigns={campaigns}
          disabled={!selectedDeliverTo}
          showLeaveNote
          buttonTitle={
            selectedPaymentMethod === PaymentMethodNames.CREDIT_CARD
              ? t("actions.toPayment")
              : t("actions.orderNow")
          }
          onCheckout={onOrder}
        />
      </Flex>
    </Flex>
  );
};
