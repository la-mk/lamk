import React from "react";
import { Order } from "../../domain/order";
import { PaymentMethod } from "../../domain/payment";
import { FrameMessageExchange } from "../FrameMessageExchange";
import { PaymentForm } from "./PaymentForm";
import { PaymentResponse } from "../../domain/payment";

interface ManagePaymentProps {
  order: Order;
  cardPaymentInfo: PaymentMethod | undefined;
  paymentMethodId: string | undefined;
  paymentResponse: PaymentResponse | undefined;
  setIsLoadingPayment: (isLoading: boolean) => void;
  setPaymentResponse: (resp: PaymentResponse) => void;
}

export const ManagePayment = ({
  setIsLoadingPayment,
  setPaymentResponse,
  paymentResponse,
  paymentMethodId,
  order,
  cardPaymentInfo,
}: ManagePaymentProps) => {
  const frameName = "paymentFrame";

  if (!order || !paymentMethodId || paymentResponse) {
    return null;
  }

  return (
    <>
      <PaymentForm
        target={frameName}
        storePaymentsId={paymentMethodId}
        cardPaymentInfo={cardPaymentInfo!}
        order={order}
      />
      {/* Can hide a spinner after the iframe is loaded */}
      <FrameMessageExchange
        frameName={frameName}
        onLoad={() => setIsLoadingPayment(false)}
        onResponse={setPaymentResponse}
      />
    </>
  );
};
