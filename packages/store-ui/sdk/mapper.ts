import {
  PricedProduct,
  PricedShippingOption,
} from "@medusajs/medusa/dist/types/pricing";
import { AddressCreatePayload } from "@medusajs/medusa/dist/types/common";
import { Address as MedusaAddress } from "@medusajs/medusa/dist/models/address";
import { StorePostCustomersReq } from "@medusajs/medusa/dist/api/routes/store/customers/create-customer";
import { StorePostCustomersCustomerReq } from "@medusajs/medusa/dist/api/routes/store/customers/update-customer";
import { Customer } from "@medusajs/medusa/dist/models/customer";
import { PaymentProvider } from "@medusajs/medusa/dist/models/payment-provider";
import { Order as MedusaOrder } from "@medusajs/medusa/dist/models/order";
import { LineItem as MedusaLineItem } from "@medusajs/medusa/dist/models/line-item";
import { StorePostAuthReq } from "@medusajs/medusa/dist/api/routes/store/auth";
import { StorePostCartsCartLineItemsReq } from "@medusajs/medusa/dist/api/routes/store/carts/create-line-item";
import { Cart as MedusaCart } from "@medusajs/medusa/dist/models/cart";
import { Image as MedusaImage } from "@medusajs/medusa/dist/models/image";

import { Attributes, Product, ProductUnit } from "../domain/product";
import { Delivery, DeliveryMethods } from "../domain/delivery";
import { Address } from "../domain/address";
import { User } from "../domain/user";
import {
  PaymentMethod,
  PaymentMethodNames,
  PaymentProcessors,
} from "../domain/payment";
import { CartItemWithProduct, CartWithProducts } from "../domain/cart";
import { Media } from "../domain/media";
import { DeliveryStatus, Order, OrderStatus } from "../domain/order";

const normalizeCurrency = (amount: number) => {
  return amount / 100;
};

const fromMedusaImages = (i: MedusaImage): Media => {
  if (!i.metadata) {
    i.metadata = {};
  }

  return {
    _id: i.url,
    height: (i.metadata.height as number) ?? 1600,
    width: (i.metadata.width as number) ?? 1600,
    size: (i.metadata.size as number) ?? 1600,
    mimeType: (i.metadata.mimeType as "image/jpeg") ?? "image/jpeg",
  };
};

export const fromMedusaProduct = (
  storeId: string,
  p: PricedProduct
): Product => {
  if (!p.metadata) {
    p.metadata = {};
  }

  const initialRes = {
    _id: p.id as string,
    old_id: (p.metadata.lamk_id as string) ?? "12345",
    soldBy: storeId,
    modifiedAt: p.updated_at as any,
    createdAt: p.created_at as any,
    category: (p.metadata.lamk_category as string) ?? "12345",
    name: p.title ?? "Product",
    description: p.description ?? "",
    groups: p.tags?.map((t) => t.value) ?? [],
    unit: "item" as ProductUnit,
    media: p.images?.map(fromMedusaImages) ?? [],
    variants: p.variants.map((v) => {
      if (!v.metadata) {
        v.metadata = {};
      }

      let attributes = { size: null, color: null } as unknown as Attributes;
      v.options?.forEach((o) => {
        if (o.value.includes("#")) {
          attributes.color = o.value;
        } else [(attributes.size = o.value)];
      });

      const mkdPrices = v.prices
        .filter((p) => p.currency_code.toUpperCase() === "MKD")
        .map((p) => normalizeCurrency(p.amount))
        .sort();
      const price = mkdPrices[mkdPrices.length - 1];
      const calculatedPrice = mkdPrices[0];
      const discount = price - calculatedPrice;

      return {
        _id: v.id ?? "",
        price,
        calculatedPrice,
        discount,
        sku: v.sku || "",
        stock: v.inventory_quantity,
        attributes,
      };
    }),
  };

  return {
    ...initialRes,
    totalStock: initialRes.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0),
    minPrice: initialRes.variants.map((v) => v.price).sort()[0],
    maxPrice: initialRes.variants.map((v) => v.price).sort()[
      initialRes.variants.length - 1
    ],
    minDiscount: initialRes.variants.map((v) => v.discount).sort()[0],
    maxDiscount: initialRes.variants.map((v) => v.discount).sort()[
      initialRes.variants.length - 1
    ],
    minCalculatedPrice: initialRes.variants
      .map((v) => v.calculatedPrice)
      .sort()[0],
    maxCalculatedPrice: initialRes.variants
      .map((v) => v.calculatedPrice)
      .sort()[initialRes.variants.length - 1],
  };
};

export const fromMedusaShippingOption = (
  storeId: string,
  shippingOption: PricedShippingOption
): Delivery => {
  return {
    // The ID doesn't seem to be used.
    // _id: shippingOption.metadata?.lamk_id as string,
    forStore: storeId,
    method: DeliveryMethods.DOOR_TO_DOOR,
    price: normalizeCurrency(shippingOption.price_incl_tax ?? 0),
    freeDeliveryOver: parseInt(
      (shippingOption.metadata?.free_delivery_over as string) ?? "0"
    ),
  };
};

export const fromMedusaAddress = (address: MedusaAddress): Address => {
  return {
    _id: address.id as string,
    addressFor: address.customer_id ?? address.customer?.id ?? "",
    name: (address.metadata?.lamk_name as any) ?? address.address_1 ?? "",
    country: address.country_code?.toUpperCase() ?? "MK",
    region: address.province || undefined,
    city: address.city ?? "",
    zip: address.postal_code ?? "",
    street: address.address_1 ?? "",
    person: address.first_name ?? "" + " " + address.last_name ?? "",
    phoneNumber: address.phone ?? "",
  };
};

export const toMedusaAddress = (
  address: Partial<Address>
): Omit<AddressCreatePayload, "metadata"> & {
  metadata: Record<string, unknown>;
} => {
  const names = address.person?.split(" ");
  return {
    first_name: names?.[0] ?? "",
    last_name: names?.[1] ?? " ",
    address_1: address.street!,
    address_2: "",
    city: address.city!,
    country_code: address.country?.toLowerCase()!,
    province: address.region ?? "",
    postal_code: address.zip!,
    phone: address.phoneNumber!,
    company: "",
    metadata: address.name ? { lamk_name: address.name } : {},
  };
};

export const toCreateMedusaCustomer = (
  credentials: Partial<User>
): StorePostCustomersReq => {
  return {
    first_name: credentials.firstName ?? "",
    last_name: credentials.lastName ?? "",
    email: credentials.email ?? "",
    password: credentials.password ?? "",
    phone: credentials.phoneNumber,
  };
};

export const toUpdateMedusaCustomer = (
  credentials: Partial<User>
): StorePostCustomersCustomerReq => {
  return {
    first_name: credentials.firstName ?? "",
    last_name: credentials.lastName ?? "",
    email: credentials.email || undefined,
    password: credentials.password || undefined,
    phone: credentials.phoneNumber,
  };
};

export const fromMedusaCustomer = (
  customer: Omit<Customer, "password_hash">
): User => {
  return {
    _id: customer.id,
    firstName: customer.first_name ?? "",
    lastName: customer.last_name ?? "",
    email: customer.email,
    phoneNumber: customer.phone,
    isEmailVerified: true,
    password: "",
  };
};

export const toMedusaLogin = (credentials: User): StorePostAuthReq => {
  return {
    email: credentials.email,
    password: credentials.password,
  };
};

export const fromMedusaPaymentProvider = (
  provider: PaymentProvider
): PaymentMethod => {
  const name =
    provider.id === "manual"
      ? PaymentMethodNames.PAY_ON_DELIVERY
      : PaymentMethodNames.CREDIT_CARD;
  return {
    name,
    processor:
      name === PaymentMethodNames.CREDIT_CARD
        ? PaymentProcessors.HALKBANK
        : undefined,

    // TODO: This is missing, we need to put it in metadata somewhere.
    clientId: "",
    clientKey: "",
    clientUsername: "",
    clientPassword: "",
  };
};

export const fromMedusaCart = (
  storeId: string,
  cart: Omit<MedusaCart, "refundable_amount" | "refunded_total">
): CartWithProducts => {
  return {
    _id: cart.id ?? "",
    items: cart.items.map((item) => fromMedusaLineItem(item, storeId)),
  };
};

const fromMedusaLineItem = (
  item: MedusaLineItem,
  storeId: string
): CartItemWithProduct => {
  {
    let attributes = { size: null, color: null } as unknown as Attributes;
    if (item.variant.material?.includes("#")) {
      attributes.color = item.variant.material;
    } else if (!!item.variant.material) {
      attributes.size = item.variant.material;
    }

    return {
      fromStore: storeId,
      quantity: item.quantity,
      product: {
        _id:
          item.product_id ??
          item.variant.product_id ??
          item.variant.product.id ??
          "",
        item_id: item.id ?? "",
        variant_id: item.variant_id ?? item.variant.id ?? "",
        createdAt: item.created_at as any,
        modifiedAt: item.created_at as any,
        soldBy: storeId,
        unit: "item" as ProductUnit,
        name: item.title ?? "",
        description: item.description ?? "",
        category: (item.metadata.lamk_category as string) ?? "12345",
        groups: [],
        media: [
          {
            _id: item.thumbnail ?? "",
            height: 1600,
            width: 1600,
            size: 1600,
            mimeType: "image/jpeg",
          },
        ],
        attributes: attributes,
        discount: normalizeCurrency(item.discount_total ?? 0),
        price: normalizeCurrency(item.original_total ?? 0),
        calculatedPrice: normalizeCurrency(item.total ?? 0),
      },
    };
  }
};

export const toMedusaLineItem = (
  product: Product,
  attributes: Attributes,
  quantity: number
): StorePostCartsCartLineItemsReq => {
  const variant = product.variants.find(
    (v) =>
      v.attributes?.color === attributes.color &&
      v.attributes?.size === attributes.size
  );
  return {
    variant_id: variant?._id ?? "",
    quantity,
  };
};

export const fromMedusaOrder = (order: MedusaOrder, storeId: string): Order => {
  if (!order.metadata) {
    order.metadata = {};
  }

  // TODO: It seems currently there is no way to end with order completed status if the fulfillment is manual
  let status = OrderStatus.COMPLETED;
  switch (order.status) {
    case "pending":
      status = OrderStatus.PENDING_SHIPMENT;
      break;
    case "canceled":
      status = OrderStatus.CANCELLED;
      break;
    case "archived":
      status = OrderStatus.INVALID;
  }

  // TODO: We need to map somehow for manual payments here.
  if (order.payment_status !== "captured") {
    status = OrderStatus.PENDING_PAYMENT;
  }

  let deliveryStatus = DeliveryStatus.UNKNOWN;
  switch (order.fulfillment_status) {
    case "not_fulfilled":
    case "partially_fulfilled":
    case "partially_shipped":
    case "partially_returned":
      deliveryStatus = DeliveryStatus.IN_TRANSIT;
      break;
    case "shipped":
      status = OrderStatus.SHIPPED;
      deliveryStatus = DeliveryStatus.IN_TRANSIT;
      break;
    case "fulfilled":
      deliveryStatus = DeliveryStatus.DELIVERED;
      break;
    case "canceled":
    case "returned":
      deliveryStatus = DeliveryStatus.REQUESTED;
      break;
  }

  return {
    _id: order.id,
    orderNumber: order.display_id,
    createdAt: order.created_at as any,
    orderedFrom: storeId,
    orderedBy: order.customer_id,
    ordered: order.items.map((item) => fromMedusaLineItem(item, storeId)),
    status,
    campaigns: [],
    delivery: {
      forStore: storeId,
      method: DeliveryMethods.DOOR_TO_DOOR,
      price: normalizeCurrency(order.shipping_total ?? 0),
      freeDeliveryOver: 0,
    },
    deliveryStatus: deliveryStatus,
    deliveryEvents: [],
    deliverTo: fromMedusaAddress(order.shipping_address),
    paymentMethod: PaymentMethodNames.PAY_ON_DELIVERY,
    currency: order.currency_code,
    buyerNote: order.metadata.lamk_note as any,
    calculatedTotal: normalizeCurrency(order.total ?? 0),
  };
};
