import uniqBy from "lodash/uniqBy";
import React, { useState, useEffect } from "react";
import { Flex, Result, Spinner, toast } from "@la-mk/blocks-ui";
import { Success } from "./Success";
import { SelectAddress } from "./SelectAddress";
import { SelectPaymentMethod } from "./SelectPaymentMethod";
import { AnalyticsEvents } from "@la-mk/analytics";
import { useTranslation } from "next-i18next";
import { useCart } from "../../hooks/useCart";
import { Store } from "../../domain/store";
import { User } from "../../domain/user";
import { PaymentMethodNames } from "../../domain/payment";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import {
  calculatePrices,
  DeliveryStatus,
  getBestCampaign,
  Order,
  OrderStatus,
} from "../../domain/order";
import { useAnalytics } from "../../hooks/useAnalytics";
import { Page } from "../../layout/Page";
import { Summary } from "../account/orders/Summary";
import { Address } from "../../domain/address";
import { useQuery } from "../../sdk/useQuery";
import { Campaign } from "../../domain/campaign";
import { useMutation } from "../../sdk/useMutation";
import { useRouter } from "next/router";

export const Checkout = ({ store, user }: { store: Store; user: User }) => {
  const { t } = useTranslation();
  const [cart, , , , clearCart] = useCart(store, user, t);
  const { trackEvent } = useAnalytics(store._id);
  const router = useRouter();

  const [trackedEvent, setTrackedEvent] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const [deliverTo, setDeliverTo] = useState<Address | undefined>();
  const [paymentMethod, setPaymentMethod] = useState(
    PaymentMethodNames.PAY_ON_DELIVERY
  );

  useBreadcrumbs([
    { url: "/", title: t("pages.home") },
    { url: "/checkout", title: t("pages.checkout") },
  ]);

  const [campaigns, isLoadingCampaigns] = useQuery(
    "campaign",
    "findActiveForStore",
    [store._id]
  );
  const [deliveries, isLoadingDeliveries] = useQuery(
    "delivery",
    "findForStore",
    [store._id]
  );
  const [addresses, isLoadingAddresses] = useQuery("address", "findForUser", [
    user._id,
  ]);
  const [storePaymentMethods, isLoadingStorePaymentMethods] = useQuery(
    "storePaymentMethods",
    "findForStore",
    [store._id]
  );

  const [createOrder, isCreatingOrder] = useMutation("order", "create");

  const delivery = deliveries?.data?.[0];

  useEffect(() => {
    if (!cart || !delivery || !campaigns || trackedEvent) {
      return;
    }

    const prices = calculatePrices(cart.items, delivery, campaigns.data);

    trackEvent(AnalyticsEvents.checkout, {
      numberOfProducts: cart.items.length,
      totalPrice: prices.total,
      discount: prices.productsTotal - prices.withCampaignsTotal,
    });

    setTrackedEvent(true);
  }, [cart, delivery, campaigns, trackedEvent, trackEvent]);

  useEffect(() => {
    if (!deliverTo && (addresses?.data?.length ?? 0) > 0) {
      setDeliverTo(addresses?.data[0]);
    }
  }, [addresses, deliverTo]);

  useEffect(() => {
    if (
      !paymentMethod &&
      (storePaymentMethods?.data?.[0]?.methods?.length ?? 0) > 0
    ) {
      setPaymentMethod(storePaymentMethods?.data[0].methods[0].name!);
    }
  }, [storePaymentMethods, paymentMethod]);

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

  const handleOrder = async (options?: { buyerNote?: string }) => {
    if (!delivery || !deliverTo) {
      return;
    }

    const ordered = cart.items
      .filter((item) => item.fromStore === store._id)
      .map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

    const applicableCampaigns = uniqBy(
      ordered.map((item) => getBestCampaign(campaigns?.data ?? [], item)),
      (campaign: Campaign | undefined) => campaign?._id
    )
      .filter((x) => !!x)
      // This is not returned by the API, but is required for validation.
      .map((campaign) => ({ ...campaign, isActive: true })) as Campaign[];
    try {
      const createdOrder = await createOrder([
        {
          orderedFrom: store._id,
          orderedBy: user._id,
          status: OrderStatus.PENDING_SHIPMENT,
          campaigns: applicableCampaigns,
          delivery,
          deliverTo,
          paymentMethod,
          ordered,
          deliveryEvents: [],
          deliveryStatus: DeliveryStatus.UNKNOWN,
          ...options,
          // This is just to make the typings happy, as it will be calculated server-side.
          calculatedTotal: 0,
          createdAt: "",
          _id: "",
          currency: store.preferences?.currency ?? "mkd",
        },
      ]);

      setOrder(order);
      const prices = calculatePrices(
        createdOrder.ordered,
        createdOrder.delivery,
        createdOrder.campaigns
      );

      trackEvent(AnalyticsEvents.order, {
        numberOfProducts: createdOrder.ordered.length,
        paymentMethod: createdOrder.paymentMethod,
        totalPrice: createdOrder.calculatedTotal,
        discount: prices.productsTotal - prices.withCampaignsTotal,
      });

      clearCart();
      if (createdOrder.paymentMethod === PaymentMethodNames.CREDIT_CARD) {
        router.replace(`/account/orders/${createdOrder._id}/pay`);
      }
    } catch (err) {
      toast.error(t("results.genericError"));
    }
  };

  return (
    <Page>
      <Spinner
        isLoaded={
          !isCreatingOrder &&
          !isLoadingAddresses &&
          !isLoadingCampaigns &&
          !isLoadingDeliveries &&
          !isLoadingStorePaymentMethods
        }
      >
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
              storePaymentMethods={storePaymentMethods?.data[0]}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <SelectAddress
              storeId={store._id}
              deliverTo={deliverTo}
              setDeliverTo={setDeliverTo}
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
              campaigns={campaigns?.data ?? []}
              disabled={!deliverTo}
              buttonTitle={
                paymentMethod === PaymentMethodNames.CREDIT_CARD
                  ? t("actions.toPayment")
                  : t("actions.orderNow")
              }
              onCheckout={handleOrder}
            />
          </Flex>
        </Flex>
      </Spinner>
    </Page>
  );
};
