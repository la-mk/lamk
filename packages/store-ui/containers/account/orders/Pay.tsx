import { Payment as StandardPay } from "../../../templates/Standard/account/orders/Payment";
import { Payment as ElegantPay } from "../../../templates/Elegant/account/orders/Payment";
import { Store } from "../../../domain/store";
import { Templates } from "../..";
import { Order } from "../../../domain/order";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { useEffect, useState } from "react";
import { useQuery } from "../../../sdk/useQuery";
import {
  PaymentMethod,
  PaymentMethodNames,
  StorePaymentMethods,
  TransactionStatus,
} from "../../../domain/payment";
import { AnalyticsEvents } from "@la-mk/analytics";
import { useProtectedRoute } from "../../../hooks/useProtectedRoute";

export interface PayProps {
  order: Order;
  isLoadingOrder: boolean;
  isLoadingPaymentMethods: boolean;
  isLoadingPayment: boolean;
  setIsLoadingPayment: (isLoading: boolean) => void;

  cardPaymentInfo: PaymentMethod | undefined;
  transactionStatus: TransactionStatus;
  transactionMessage?: string;
  paymentError?: string;

  setPaymentResponse: (resp: PaymentResponse | null) => void;
  paymentResponse: PaymentResponse;
  shouldRetry: boolean;
  paymentMethod: StorePaymentMethods | undefined;
}

type PaymentResponse = {
  error?: any;
  data?: any;
} | null;

export const Pay = ({
  template,
  store,
  order,
  isLoadingOrder,
}: {
  template: Templates;
  store: Store;
  order: Order;
  isLoadingOrder: boolean;
}) => {
  useProtectedRoute();
  const { trackEvent } = useAnalytics(store._id);
  const [trackedEvent, setTrackedEvent] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse>(null);
  const [paymentMethods, isLoadingPaymentMethods] = useQuery(
    "storePaymentMethods",
    "findForStore",
    [store._id]
  );

  const transaction = paymentResponse?.data?.transactions?.[0];
  const transactionStatus = transaction?.status;

  const shouldRetry =
    !!paymentResponse?.error ||
    transactionStatus === TransactionStatus.DECLINED ||
    transactionStatus === TransactionStatus.ERROR;

  const cardPaymentInfo = paymentMethods?.data?.[0]?.methods?.find(
    (method) => method.name === PaymentMethodNames.CREDIT_CARD
  );

  useEffect(() => {
    if (!order || !transactionStatus || !cardPaymentInfo || trackedEvent) {
      return;
    }

    trackEvent(AnalyticsEvents.pay, {
      orderId: order._id,
      totalPrice: order.calculatedTotal,
      status: transactionStatus,
      processor: cardPaymentInfo.processor,
    });

    setTrackedEvent(true);
  }, [trackEvent, order, transactionStatus, cardPaymentInfo, trackedEvent]);

  const props = {
    order,
    isLoadingOrder,
    isLoadingPayment,
    setIsLoadingPayment,
    isLoadingPaymentMethods,
    transactionStatus,
    transactionMessage: transaction.message,
    cardPaymentInfo,
    paymentResponse,
    setPaymentResponse,
    shouldRetry,
    paymentMethod: paymentMethods?.data?.[0],
  };

  switch (template) {
    case "standard":
      return <StandardPay {...props} />;
    case "elegant":
      return <ElegantPay {...props} />;
  }
};
