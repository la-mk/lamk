import React from "react";
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
import { OrderStatus } from "../../../../domain/order";
import { useTranslation } from "next-i18next";
import { TransactionStatus } from "../../../../domain/payment";
import { Success } from "./Success";
import { Page } from "../../Page";
import { FrameMessageExchange } from "../../../../components/FrameMessageExchange";
import { PaymentForm } from "./payments/PaymentForm";
import { urls } from "../../../../tooling/url";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { PayProps } from "../../../../containers/account/orders/Pay";

export const Payment = ({
  order,
  isLoadingOrder,
  isLoadingPayment,
  setIsLoadingPayment,
  isLoadingPaymentMethods,

  cardPaymentInfo,
  transactionStatus,
  transactionMessage,
  paymentError,
  paymentResponse,
  setPaymentResponse,

  shouldRetry,
  paymentMethod,
}: PayProps) => {
  const { t } = useTranslation("translation");
  const frameName = "paymentFrame";

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
          href={`${urls.accountOrders}/[oid]`}
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

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
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
        ]}
      />
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
            {!!paymentError && (
              <Alert
                maxWidth={"40rem"}
                mt={5}
                status="error"
                message={paymentError ?? t("results.genericError")}
              />
            )}

            {(transactionStatus === TransactionStatus.DECLINED ||
              transactionStatus === TransactionStatus.ERROR) && (
              <Alert
                maxWidth={"40rem"}
                mt={5}
                status="error"
                message={transactionMessage ?? t("results.genericError")}
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

            {order && paymentMethod && !paymentResponse && (
              <>
                <PaymentForm
                  target={frameName}
                  storePaymentsId={paymentMethod?._id}
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
    </>
  );
};
