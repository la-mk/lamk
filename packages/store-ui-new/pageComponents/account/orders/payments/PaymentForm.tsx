import React from "react";
import { NestPay } from "./NestPay";
import { useTranslation } from "next-i18next";
import { sdk } from "../../../../sdk/sdk";
import { calculatePrices, Order } from "../../../../domain/order";
import { PaymentMethod, PaymentMethodNames } from "../../../../domain/payment";

// TODO: Export to sdk
//ISO 4217 currency codes
const currencyIds = {
  mkd: 807,
  eur: 978,
  usd: 840,
};

const TRANSACTION_TYPE = "Auth";

interface PaymentFormProps {
  target: string;
  order: Order;
  storePaymentsId: string;
  cardPaymentInfo: Pick<PaymentMethod, "clientId" | "processor">;
}

export const PaymentForm = ({
  target,
  order,
  storePaymentsId,
  cardPaymentInfo,
}: PaymentFormProps) => {
  const { i18n } = useTranslation("translation");
  const orderTotal = calculatePrices(
    order.ordered,
    order.delivery,
    order.campaigns
  );

  // If rendered on the service, it's fine for this to be an empty string.
  const paymentCallback = window
    ? `${window.location.protocol}//${window.location.hostname}/api/paymentResponse`
    : "";

  return (
    <NestPay
      target={target}
      getHashParts={(hashContent) => {
        return sdk.storePaymentMethods.getHashParts(
          storePaymentsId,
          hashContent,
          PaymentMethodNames.CREDIT_CARD
        );
      }}
      data={{
        clientId: cardPaymentInfo.clientId ?? "",
        orderId: order._id,
        orderTotal: orderTotal.total,
        currencyCode: currencyIds[order.currency as keyof typeof currencyIds],
        transactionType: TRANSACTION_TYPE,
        language: i18n.language,
        // We have to make the request to a sameorigin URL, otherwise it won't display it in the iframe.
        okUrl: paymentCallback,
        failUrl: paymentCallback,
      }}
    />
  );
};
