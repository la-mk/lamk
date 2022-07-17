import { Checkout as StandardCheckout } from "../../templates/Standard/checkout";
import { Checkout as ElegantCheckout } from "../../templates/Elegant/checkout";

import uniqBy from "lodash/uniqBy";
import { AnalyticsEvents } from "@la-mk/analytics";
import { toast } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Templates } from "..";
import { Address } from "../../domain/address";
import { Campaign } from "../../domain/campaign";
import {
  calculatePrices,
  DeliveryStatus,
  getBestCampaign,
  Order,
  OrderStatus,
} from "../../domain/order";
import { PaymentMethodNames, StorePaymentMethods } from "../../domain/payment";
import { Store } from "../../domain/store";
import { User } from "../../domain/user";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useCart } from "../../hooks/useCart";
import { useMutation } from "../../sdk/useMutation";
import { useQuery } from "../../sdk/useQuery";
import { urls } from "../../tooling/url";
import { CartWithProducts } from "../../domain/cart";
import { Delivery } from "../../domain/delivery";

export interface CheckoutProps {
  store: Store;
  order: Order | undefined;
  cart: CartWithProducts;
  user: User;
  campaigns: Campaign[];
  delivery: Delivery | undefined;
  paymentMethods: StorePaymentMethods | undefined;
  isLoading: boolean;
  onOrder: (options?: { buyerNote?: string }) => void;
  selectedPaymentMethod: PaymentMethodNames | undefined;
  setSelectedPaymentMethod: (method: PaymentMethodNames) => void;
  selectedDeliverTo: Address | undefined;
  setSelectedDeliverTo: (deliverTo: Address) => void;
}

export const Checkout = ({
  template,
  store,
  user,
}: {
  template: Templates;
  store: Store;
  user: User;
}) => {
  const { t } = useTranslation("translation");
  const { cart, clearCart } = useCart(store._id, user, t);
  const { trackEvent } = useAnalytics(store._id);
  const router = useRouter();

  const [trackedEvent, setTrackedEvent] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const [deliverTo, setDeliverTo] = useState<Address | undefined>();
  const [paymentMethod, setPaymentMethod] = useState(
    PaymentMethodNames.PAY_ON_DELIVERY
  );

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

      setOrder(createdOrder);
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

      clearCart(false);
      if (createdOrder.paymentMethod === PaymentMethodNames.CREDIT_CARD) {
        router.replace(`${urls.accountOrders}/${createdOrder._id}/pay`);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("results.genericError"));
    }
  };

  const isLoading =
    isCreatingOrder ||
    isLoadingAddresses ||
    isLoadingCampaigns ||
    isLoadingDeliveries ||
    isLoadingStorePaymentMethods;

  const props = {
    store,
    order,
    cart,
    user,
    campaigns: campaigns?.data ?? [],
    delivery: deliveries?.data?.[0],
    paymentMethods: storePaymentMethods?.data[0],
    isLoading,
    onOrder: handleOrder,
    selectedPaymentMethod: paymentMethod,
    setSelectedPaymentMethod: setPaymentMethod,
    selectedDeliverTo: deliverTo,
    setSelectedDeliverTo: setDeliverTo,
  };

  switch (template) {
    case "standard":
      return <StandardCheckout {...props} />;
    case "elegant":
      return <ElegantCheckout {...props} />;
  }
};
