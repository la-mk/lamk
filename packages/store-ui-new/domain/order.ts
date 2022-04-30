import { sdk } from "@la-mk/la-sdk";
import { PaymentMethodNames } from "@la-mk/la-sdk/dist/models/storePaymentMethods";
import { Address } from "./address";
import { Campaign } from "./campaign";
import { Delivery } from "./delivery";
import { OrderedProduct } from "./product";

export enum OrderStatus {
  INVALID = "invalid",
  CANCELLED = "cancelled",
  PENDING_PAYMENT = "pendingPayment",
  PENDING_SHIPMENT = "pendingShipment",
  SHIPPED = "shipped",
  COMPLETED = "completed",
}
export enum DeliveryStatus {
  REQUESTED = "requested",
  IN_TRANSIT = "transit",
  DELIVERED = "delivered",
  UNKNOWN = "unknown",
}

export interface OrderItem {
  product: OrderedProduct;
  quantity: number;
}

export interface DeliveryEvent {
  timestamp: string;
  rawStatus?: string;
  rawDescription?: string;
}

export interface Order {
  _id: string;
  createdAt: string;
  orderedFrom: string;
  orderedBy: string;
  ordered: OrderItem[];
  status: OrderStatus;
  campaigns: Campaign[];
  delivery: Delivery;
  deliveryTracking?: {
    trackingId: string;
    courierSlug: string;
  };
  deliveredOn?: string;
  deliveryStatus: DeliveryStatus;
  deliveryEvents: DeliveryEvent[];
  deliverTo: Address;
  paymentMethod: PaymentMethodNames;
  currency: string;
  buyerNote?: string;
  calculatedTotal: number;
}

export const calculatePrices = (
  items: OrderItem[],
  delivery: Delivery,
  campaigns: Campaign[]
) => {
  return sdk.utils.pricing.calculatePrices(items, delivery, campaigns);
};
