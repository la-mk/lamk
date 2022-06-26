import React, { useState, useEffect } from "react";
import {
  Flex,
  Spinner,
  Alert,
  Heading,
  Button,
  Text,
  Result,
} from "@la-mk/blocks-ui";
import Link from "next/link";
import { AnalyticsEvents } from "@la-mk/analytics";
import { Store } from "../../../domain/store";
import { Order, OrderStatus } from "../../../domain/order";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../../hooks/useBreadcrumbs";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { PaymentMethodNames, TransactionStatus } from "../../../domain/payment";
import { useQuery } from "../../../sdk/useQuery";
import { Success } from "./Success";
import { Page } from "../../../layout/Page";
import { FrameMessageExchange } from "./FrameMessageExchange";
import { PaymentForm } from "./payments/PaymentForm";
import { urls } from "../../../tooling/url";

interface PaymentProps {
  store: Store;
  order: Order;
  isLoadingOrder: boolean;
}

export const Payment = ({ store, order, isLoadingOrder }: PaymentProps) => {
  const { t } = useTranslation("translation");
  const { trackEvent } = useAnalytics(store._id);
  const [trackedEvent, setTrackedEvent] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [paymentResponse, setPaymentResponse] = useState<{
    error?: any;
    data?: any;
  } | null>(null);
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

  useBreadcrumbs(
    [
      { url: urls.home, title: t("pages.home") },
      { url: urls.accountOrders, title: t("pages.order_plural") },
      {
        urlPattern: `${urls.accountOrders}/[oid]`,
        url: `${urls.accountOrders}/${order?._id}`,
        title: t("pages.order"),
      },
      {
        urlPattern: `${urls.accountOrders}/[oid]/pay`,
        url: `${urls.accountOrders}/${order?._id}/pay`,
        title: t("pages.payment"),
      },
    ],
    [order._id]
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

  if (!cardPaymentInfo && !isLoadingPaymentMethods) {
    return (
      <Result
        mt={8}
        status="warning"
        title={t("payment.paymentDisabled")}
        description={t("payment.storeNoCardSupport")}
      />
    );
  }

  if (!order && !isLoadingOrder) {
    return (
      <Result
        mt={8}
        status="warning"
        title={t("order.orderNotFound")}
        description={t("order.orderNotFoundTip")}
      />
    );
  }

  if (order && order.status !== OrderStatus.PENDING_PAYMENT) {
    return (
      <Flex
        mx="auto"
        maxWidth={"24rem"}
        mt={8}
        direction="column"
        justify="center"
      >
        <Result
          status="warning"
          title={t("payment.paymentDisabled")}
          description={t("order.orderAlreadyPaid")}
        />
        <Link
          passHref
          replace
          href={`${urls.accountOrders}/[pid]`}
          as={`${urls.accountOrders}/${order._id}`}
        >
          <Button mt={5} as="a" mx={2} key="console">
            {t("order.seeOrder")}
          </Button>
        </Link>
      </Flex>
    );
  }

  if (transactionStatus === TransactionStatus.APPROVED) {
    return <Success mt={[7, 8, 8]} order={order} />;
  }

  const frameName = "paymentFrame";

  return (
    <Page>
      <Spinner
        isLoaded={
          !isLoadingPaymentMethods && !isLoadingOrder && !isLoadingPayment
        }
      >
        <Flex align="center" justify="center" direction="column">
          {order && (
            <Heading as="h3" size="lg" mb={3}>
              {t("payment.payAmountTip", {
                amountWithCurrency: `${order.calculatedTotal} ${t(
                  `currencies.${order.currency}`
                )}`,
              })}
            </Heading>
          )}
          {paymentResponse?.error && (
            <Alert
              maxWidth={"40rem"}
              mt={5}
              status="error"
              message={
                paymentResponse.error?.message ?? t("results.genericError")
              }
            />
          )}

          {(transactionStatus === TransactionStatus.DECLINED ||
            transactionStatus === TransactionStatus.ERROR) && (
            <Alert
              maxWidth={"40rem"}
              mt={5}
              status="error"
              message={transaction?.message ?? t("results.genericError")}
            />
          )}

          {shouldRetry && (
            <>
              <Button
                mt={6}
                size="lg"
                onClick={() => {
                  setPaymentResponse(null);
                  setIsLoadingPayment(true);
                }}
              >
                {t("actions.retry")}
              </Button>
              <Text mt={3} color="mutedText.dark">
                {t("order.retryFromOrdersTip")}
              </Text>
            </>
          )}

          {order && paymentMethods?.data?.[0] && !paymentResponse && (
            <>
              <PaymentForm
                target={frameName}
                storePaymentsId={paymentMethods?.data?.[0]?._id}
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
          )}
        </Flex>
      </Spinner>
    </Page>
  );
};
