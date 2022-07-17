import React from "react";
import { Flex, Result, Spinner } from "@la-mk/blocks-ui";
import { Success } from "./Success";
import { SelectAddress } from "./SelectAddress";
import { SelectPaymentMethod } from "./SelectPaymentMethod";
import { useTranslation } from "next-i18next";
import { PaymentMethodNames } from "../../../domain/payment";
import { Page } from "../Page";
import { Summary } from "../account/orders/Summary";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CheckoutProps } from "../../../containers/checkout";

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
  if (order && order.paymentMethod === PaymentMethodNames.PAY_ON_DELIVERY) {
    return <Success mt={[7, 8, 8]} order={order} />;
  }

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
          { url: urls.checkout, title: t("pages.checkout") },
        ]}
      />
      <Page>
        <Spinner isLoaded={!isLoading}>
          <Flex justify="space-between" align="flex-start" wrap="wrap">
            <Flex
              px={2}
              maxWidth={"60rem"}
              minWidth={["18rem", "24rem", "24rem"]}
              flex={1}
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
              minWidth={"18rem"}
              maxWidth={["48rem", "48rem", "36rem"]}
              width="100%"
              flex={1}
              mx={[1, 2, 4]}
              my={3}
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
        </Spinner>
      </Page>
    </>
  );
};
