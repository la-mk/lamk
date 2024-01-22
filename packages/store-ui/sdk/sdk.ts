import { sdk as sdkBase, setupSdk as setup } from "@la-mk/la-sdk";
import { FindResult, SetupSdkOptions } from "@la-mk/la-sdk/dist/setup";
import { User } from "../domain/user";
import isObject from "lodash/isObject";
import {
  Attributes,
  Product,
  areAttributesEquivalent,
} from "../domain/product";
import {
  Cart,
  CartItem,
  CartItemWithProduct,
  CartWithProducts,
} from "../domain/cart";
import { Order } from "../domain/order";
import Medusa from "@medusajs/medusa-js";
import { Order as MedusaOrder } from "@medusajs/medusa/dist/models/order";
import {
  fromMedusaAddress,
  fromMedusaCart,
  fromMedusaCustomer,
  fromMedusaOrder,
  fromMedusaPaymentProvider,
  fromMedusaProduct,
  fromMedusaShippingOption,
  toMedusaAddress,
  toCreateMedusaCustomer,
  toUpdateMedusaCustomer,
  toMedusaLineItem,
  toMedusaLogin,
} from "./mapper";
import { Delivery } from "../domain/delivery";
import { Address } from "../domain/address";
import { StorePaymentMethods } from "../domain/payment";

// const isMokudoStore = (storeId: string) =>
//   storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2";

export let sdk: ReturnType<typeof setupSdk>;
export const setupSdk = (config: SetupSdkOptions) => {
  setup(config);
  const medusa = new Medusa({
    baseUrl: "https://lamk-medusa.fly.dev/",
    maxRetries: 3,
  });

  const mappedSdk = {
    user: {
      schema: sdkBase.user.schema,
      patch: async (
        userId: string | null,
        data: Partial<User>,
        params?: any
      ) => {
        if (userId === null) {
          if (params?.query?.resetToken?.startsWith("tkn")) {
            await medusa.customers.resetPassword({
              email: params.query.email,
              token: params.query.resetToken,
              password: data.password ?? "",
            });

            const session = await medusa.auth.getSession();
            return fromMedusaCustomer(session.customer);
          } else {
            return sdkBase.user.patch(userId, data, params);
          }
        }

        if (userId.startsWith("cus")) {
          const resp = await medusa.customers.update(
            toUpdateMedusaCustomer(data)
          );

          return fromMedusaCustomer(resp.customer);
        } else {
          return sdkBase.user.patch(userId, data, params);
        }
      },
    },

    address: {
      schema: sdkBase.address.schema,
      findForUser: async (userId: string) => {
        if (userId.startsWith("cus")) {
          const session = await medusa.auth.getSession();
          if (!session) {
            return {
              total: 0,
              limit: 0,
              skip: 0,
              data: [],
            };
          }

          const res = {
            total: session.customer.shipping_addresses.length,
            limit: session.customer.shipping_addresses.length,
            skip: 0,
            data: session.customer.shipping_addresses.map(fromMedusaAddress),
          } as FindResult<Address>;

          return res;
        } else {
          return sdkBase.address.findForUser(userId);
        }
      },
      create: async (address: Address) => {
        if (address.addressFor.startsWith("cus")) {
          const resp = await medusa.customers.addresses.addAddress({
            address: toMedusaAddress(address),
          });

          // TODO: Assuming the new address gets added at the end
          return fromMedusaAddress(
            resp.customer.shipping_addresses[
              resp.customer.shipping_addresses.length - 1
            ]
          );
        } else {
          return sdkBase.address.create(address);
        }
      },

      patch: async (id: string, address: Partial<Address>) => {
        if (id.startsWith("addr")) {
          const resp = await medusa.customers.addresses.updateAddress(
            id,
            toMedusaAddress(address)
          );

          return fromMedusaAddress(
            resp.customer.shipping_addresses.find((a) => a.id === id)!
          );
        } else {
          return sdkBase.address.patch(id, address);
        }
      },

      remove: async (id: string) => {
        if (id.startsWith("addr")) {
          const resp = await medusa.customers.addresses.deleteAddress(id);
          return { _id: id };
        } else {
          return sdkBase.address.remove(id);
        }
      },
    },

    auth: {
      login: async (storeId: string, credentials: User, strategy: string) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          await medusa.auth.authenticate(toMedusaLogin(credentials));

          return {};
        } else {
          return sdkBase.authentication.authenticate({
            ...credentials,
            strategy,
          });
        }
      },
      signup: async (storeId: string, credentials: User, strategy: string) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          const resp = await medusa.customers.create(
            toCreateMedusaCustomer(credentials)
          );

          return;
        } else {
          await sdkBase.user.create(credentials);
          return sdkBase.authentication.authenticate({
            ...credentials,
            strategy,
          });
        }
      },
      logout: async (storeId: string) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          return medusa.auth.deleteSession();
        } else {
          return sdkBase.authentication.logout();
        }
      },

      // TODO: Make this work
      resetPassword: (email: string, storeId: string) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          return medusa.customers.generatePasswordToken({ email });
        } else {
          return sdkBase.authManagement.resetPassword(email, storeId);
        }
      },

      getCustomer: async () => {
        const customer = await medusa.auth.getSession();
        return fromMedusaCustomer(customer.customer);
      },

      // TODO: The ones below need to be removed instead
      getAuthentication: sdkBase.authentication.getAuthentication,
      getAccessToken: sdkBase.authentication.getAccessToken,
      removeAccessToken: sdkBase.authentication.removeAccessToken,
      reauthenticate: sdkBase.authentication.reAuthenticate,
    },

    storePaymentMethods: {
      findForStore: async (storeId: string) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          const regions = await medusa.regions.list();
          const currentRegion = regions.regions[0];
          if (currentRegion) {
            const res = {
              total: currentRegion.payment_providers.length,
              limit: currentRegion.payment_providers.length,
              skip: 0,
              data: [
                {
                  forStore: storeId,
                  methods: currentRegion.payment_providers.map(
                    fromMedusaPaymentProvider
                  ),
                },
              ],
            } as FindResult<StorePaymentMethods>;

            return res;
          }
        } else {
          return sdkBase.storePaymentMethods.findForStore(storeId);
        }
      },

      // TODO: This doesn't have a good alternative, it has to be custom implementation
      getHashParts: sdkBase.storePaymentMethods.getHashParts,
    },

    order: {
      // TODO: The notes part isn't working, find a solution
      create: async (newOrder: Order, cartId?: string) => {
        if (newOrder.orderedBy.startsWith("cus")) {
          if (!cartId) {
            throw new Error("Cart id is required for medusa orders");
          }

          await medusa.carts.update(cartId, {
            shipping_address: toMedusaAddress(newOrder.deliverTo),
          });

          const shippingOptions = await medusa.shippingOptions.listCartOptions(
            cartId
          );

          await medusa.carts.addShippingMethod(cartId, {
            option_id: shippingOptions.shipping_options[0].id ?? "",
          });

          const updatedCart = await medusa.carts.createPaymentSessions(cartId);

          await medusa.carts.setPaymentSession(cartId, {
            provider_id: updatedCart.cart.payment_sessions[0].provider_id,
          });

          const { data } = await medusa.carts.complete(cartId);

          return fromMedusaOrder(data as MedusaOrder, newOrder.orderedFrom);
        } else {
          return sdkBase.order.create(newOrder as any);
        }
      },
      // TODO: Add pagination and filtering
      findForUserFromStore: async (userId: string, storeId: string) => {
        if (userId.startsWith("cus")) {
          const resp = await medusa.customers.listOrders();
          const res = {
            total: resp.count,
            limit: resp.limit,
            skip: resp.offset,
            data: resp.orders.map((o) => fromMedusaOrder(o, storeId)),
          } as FindResult<Order>;

          return res;
        } else {
          return sdkBase.order.findForUserFromStore(userId, storeId);
        }
      },
      get: async (id: string, storeId: string) => {
        if (id.startsWith("ord")) {
          const resp = await medusa.orders.retrieve(id);
          return fromMedusaOrder(resp.order, storeId);
        } else {
          return sdkBase.order.get(id);
        }
      },
      statusColor: sdkBase.order.orderStatusColor,
    },

    // TODO: Change to handling payments through medusa
    orderPayments: {
      create: sdkBase.orderPayments.create,
    },

    product: {
      // TODO: Add pagination and filtering
      findForStore: async (storeId: string, query: { query: any }) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          try {
            const products = await medusa.products.list();
            const res = {
              total: products.count,
              limit: products.limit,
              skip: products.offset,
              data: products.products.map((p) => fromMedusaProduct(storeId, p)),
            } as FindResult<Product>;

            return res;
          } catch (err) {
            console.error(err);
            // Noop, let it fallback to the lamk SDK
          }
        } else {
          return sdkBase.product.findForStore(storeId, query) as Promise<
            FindResult<Product>
          >;
        }
      },

      get: async (storeId: string, id: string) => {
        if (id.startsWith("prod")) {
          try {
            const product = await medusa.products.retrieve(id);
            return fromMedusaProduct(storeId, product.product);
          } catch (err) {
            console.error(err);
            // Noop, let it fallback to the lamk SDK
          }
        } else {
          return sdkBase.product.get(id);
        }
      },
      convertToOrderProduct: (
        product: Product,
        attributes: Attributes | undefined
      ) => {
        if (product._id.startsWith("prod")) {
          return {
            ...sdkBase.product.convertToOrderProduct(product, attributes),
            _id: product._id,
            variant_id: product._id,
          };
        } else {
          return sdkBase.product.convertToOrderProduct(product, attributes);
        }
      },

      // TODO: Replace with something else
      getProductSetsForStore: sdkBase.product.getProductSetsForStore,
    },

    cart: {
      get: async (
        userId: string | undefined,
        storeId: string,
        cartId?: string
      ) => {
        if (!userId) {
          return { _id: "", items: [] };
        }

        if (userId?.startsWith("cus")) {
          if (!!cartId) {
            const resp = await medusa.carts.retrieve(cartId);
            return fromMedusaCart(storeId, resp.cart);
          } else {
            const resp = await medusa.carts.create({});
            await medusa.carts.update(resp.cart.id, {
              customer_id: userId,
            });
            return fromMedusaCart(storeId, resp.cart);
          }
        } else {
          return sdkBase.cart.getCartWithProductsForUser(userId, storeId);
        }
      },
      // This happens when we finish an order, but medusa works differently so we don't need to remove items
      patch: async (
        cartId: string,
        updatedData: Partial<CartWithProducts>,
        serverData: Partial<CartWithProducts>
      ) => {
        if (cartId.startsWith("cart")) {
          const toUpdate =
            serverData.items
              ?.map((item) => {
                const newData = updatedData.items?.find(
                  (localItem) =>
                    localItem.product._id === item.product._id &&
                    areAttributesEquivalent(
                      localItem.product.attributes,
                      item.product.attributes
                    ) &&
                    localItem.quantity !== item.quantity
                );

                if (newData) {
                  return {
                    ...newData,
                    product: {
                      ...newData.product,
                      item_id: item.product.item_id ?? item.product._id,
                      variant_id: item.product.variant_id ?? item.product._id,
                    },
                  };
                } else {
                  return null;
                }
              })
              .filter((item) => !!item) ?? [];

          const toRemove =
            serverData.items?.filter(
              (serverItem) =>
                !updatedData.items?.some(
                  (item) =>
                    item.product._id === serverItem.product._id &&
                    areAttributesEquivalent(
                      item.product.attributes,
                      serverItem.product.attributes
                    )
                )
            ) ?? [];

          const toAdd =
            updatedData.items?.filter(
              (serverItem) =>
                !serverData.items?.some(
                  (item) =>
                    item.product._id === serverItem.product._id &&
                    areAttributesEquivalent(
                      item.product.attributes,
                      serverItem.product.attributes
                    )
                )
            ) ?? [];

          const promises = [
            ...toRemove.map((item) =>
              medusa.carts.lineItems.delete(
                cartId,
                item.product.item_id ?? item.product._id
              )
            ),
            ...toUpdate.map((item) =>
              medusa.carts.lineItems.update(
                cartId,
                item!.product.item_id ?? item!.product._id,
                { quantity: item!.quantity }
              )
            ),
            ...toAdd.map((item) =>
              medusa.carts.lineItems.create(cartId, {
                variant_id: item.product.variant_id ?? "",
                quantity: item.quantity,
              })
            ),
          ];

          return Promise.all(promises);
        } else {
          const update =
            updatedData.items?.map((item: CartItemWithProduct) => ({
              ...item,
              product: {
                id: item.product._id,
                attributes: item.product.attributes,
              },
            })) ?? [];
          return sdkBase.cart.patch(cartId, update);
        }
      },
      addItemToCart: (
        product: Product | null | undefined,
        attributes: Attributes,
        quantity: number,
        storeId: string,
        userId: string | undefined,
        cartId: string | undefined
      ) => {
        if (!product) {
          return Promise.resolve(undefined);
        }

        let action: Promise<Cart | any | void> = Promise.resolve();
        const orderProduct = sdkBase.product.convertToOrderProduct(
          product,
          attributes
        );
        if (!orderProduct) {
          return Promise.resolve(undefined);
        }

        const cartItem: CartItem = {
          product: { id: product._id, attributes: attributes },
          fromStore: storeId,
          quantity,
        };

        if (userId && cartId) {
          if (userId.startsWith("cus")) {
            action = medusa.carts.lineItems
              .create(cartId, toMedusaLineItem(product, attributes, quantity))
              .then((resp) => fromMedusaCart(storeId, resp.cart));
          } else {
            action = sdkBase.cart.addItemToCart(userId, cartItem);
          }
        }

        return action.then((cart: CartWithProducts) => {
          let additionalFields: any = { variant_id: orderProduct._id };
          if (cart?._id?.startsWith("cart")) {
            additionalFields = {
              item_id: cart.items.find(
                (item) => item.product.variant_id === orderProduct._id
              )?.product.item_id,
            };
          }
          return {
            ...orderProduct,
            _id: product._id,
            ...additionalFields,
          };
        });
      },
      removeItemFromCart: async (cartId: string, item: CartItemWithProduct) => {
        if (cartId.startsWith("cart")) {
          await medusa.carts.lineItems.delete(
            cartId,
            item.product.item_id ?? item.product._id
          );

          return;
        } else {
          return sdkBase.cart.removeItemFromCart(cartId, item);
        }
      },
      changeQuantityInCart: async (
        cartId: string,
        item: CartItemWithProduct,
        quantity: number
      ) => {
        if (cartId.startsWith("cart")) {
          await medusa.carts.lineItems.update(
            cartId,
            item.product.item_id ?? item.product._id,
            {
              quantity,
            }
          );

          return;
        } else {
          return sdkBase.cart.changeQuantityForCartItem(cartId, item, quantity);
        }
      },
    },

    delivery: {
      findForStore: async (storeId: string) => {
        if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
          const deliveryOptions = await medusa.shippingOptions.list();
          const res = {
            total: deliveryOptions.shipping_options.length,
            limit: deliveryOptions.shipping_options.length,
            skip: 0,
            data: deliveryOptions.shipping_options.map((s) =>
              fromMedusaShippingOption(storeId, s)
            ),
          } as FindResult<Delivery>;

          return res;
        } else {
          return sdkBase.delivery.findForStore(storeId);
        }
      },
    },

    // TODO: Find an alternative here
    store: {
      getBySlug: sdkBase.store.getBySlug,
      getByDomain: async (domain: string) => {
        const res = await sdkBase.store.find({
          query: { customDomain: domain },
        });
        if (res.total === 0) {
          throw new Error("Store not found");
        }

        if (res.total > 1) {
          console.error(`Multiple stores with the domain ${domain} found`);
          throw new Error("Found multiple stores with the same domain.");
        }

        return res.data[0];
      },
    },

    // TODO: Find an alternative
    campaign: {
      findActiveForStore: sdkBase.campaign.findActiveForStore,
    },

    // TODO: Find an alternative
    storeCategory: {
      findForStore: sdkBase.storeCategory.findForStore,
    },

    // TODO: Find an alternative
    storeContents: {
      getLandingContentForStore:
        sdkBase.storeContents.getLandingContentForStore,
      getAboutUsForStore: sdkBase.storeContents.getAboutUsForStore,
    },

    // TODO: Find an alternative
    storeIntegrations: {
      findForStore: sdkBase.storeIntegrations.findForStore,
    },

    utils: {
      schema: {
        pick: sdkBase.utils.schema.pick,
      },
      getShortId,
    },
  };

  sdk = mappedSdk;
  return mappedSdk;
};

export const getShortId = (
  idOrItem: string | { _id: string; [key: string]: any }
): string => {
  let id = idOrItem;
  if (isObject(idOrItem)) {
    id = idOrItem._id;
  }

  return id.substring(0, 8);
};
