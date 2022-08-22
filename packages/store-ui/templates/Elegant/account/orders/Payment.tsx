import React from "react";
import { useTranslation } from "next-i18next";
import { PayProps } from "../../../../containers/account/orders/Pay";
import {
  Alert,
  Button,
  Flex,
  Heading,
  Result,
  Spinner,
  Text,
} from "@la-mk/blocks-ui";
import { ManagePayment } from "../../../../components/payments/ManagePayment";
import { TransactionStatus } from "../../../../domain/payment";
import { OrderStatus } from "../../../../domain/order";
import Link from "next/link";
import { urls } from "../../../../tooling/url";
import { Success } from "../../checkout/Success";

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
    <Spinner
      isLoaded={
        !isLoadingPaymentMethods && !isLoadingOrder && !isLoadingPayment
      }
    >
      <Flex align="center" justify="center" direction="column">
        {order && (
          <Heading color={"mutedText.dark"} as="h3" size="md" mb={3}>
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

        <ManagePayment
          paymentMethodId={paymentMethod?._id}
          cardPaymentInfo={cardPaymentInfo}
          paymentResponse={paymentResponse}
          setPaymentResponse={setPaymentResponse}
          setIsLoadingPayment={setIsLoadingPayment}
          order={order}
        />
      </Flex>
    </Spinner>
  );
};
