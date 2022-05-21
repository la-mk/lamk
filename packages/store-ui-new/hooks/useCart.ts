import { toast } from "@la-mk/blocks-ui";
import { TFunction } from "next-i18next";
import React from "react";
import { CartItemWithProduct, CartWithProducts } from "../domain/cart";
import {
  areAttributesEquivalent,
  Attributes,
  OrderedProduct,
  Product,
} from "../domain/product";
import { Store } from "../domain/store";
import { User } from "../domain/user";
import { sdk } from "../sdk/sdk";
import { useMutation } from "../sdk/useMutation";
import { useQuery } from "../sdk/useQuery";
import { useLocalStorage } from "./useLocalStorage";
import { unionWith } from "lodash";

type AddToCartFunc = (
  product: Product,
  attributes: Attributes,
  quantity: number
) => Promise<OrderedProduct | undefined>;

export const useCart = (
  store: Store,
  user: User | undefined,
  t: TFunction
): [CartWithProducts, AddToCartFunc] => {
  const [localCart, setLocalCart] = useLocalStorage<CartWithProducts>("cart");
  const [addToCart] = useMutation("cart", "addItemToCart");
  useQuery("cart", "get", [user?._id ?? "", store._id], {
    enabled: !!user,
    onSuccess: async (res) => {
      const cartItems = unionWith(
        localCart?.items ?? [],
        res?.items ?? [],
        (a, b) =>
          a.product._id === b.product._id &&
          areAttributesEquivalent(a.product.attributes, b.product.attributes)
      );

      const updatedCartItems = await updateCartItems(cartItems);
      await updateServerCart(store._id, res._id, updatedCartItems);
      setLocalCart({ items: updatedCartItems });
    },
  });

  const handleAddToCart = React.useCallback(
    async (product: Product, attributes: Attributes, quantity: number) => {
      try {
        const orderProduct = await addToCart([
          product,
          attributes,
          quantity,
          store._id,
          user?._id,
        ]);

        setLocalCart((cart) => ({
          ...cart,
          items: [
            ...(cart?.items ?? []),
            {
              product: orderProduct,
              quantity,
              fromStore: store._id,
            } as CartItemWithProduct,
          ],
        }));

        toast.info(t("cart.addedToCart"));
        return orderProduct;
      } catch (err) {
        toast.error("results.genericError");
      }
    },
    [user, store, setLocalCart, addToCart, t]
  );

  return [localCart ?? ({ items: [] } as CartWithProducts), handleAddToCart];
};

const updateCartItems = async (
  items: CartItemWithProduct[]
): Promise<CartItemWithProduct[]> => {
  if (items.length === 0) {
    return items;
  }

  try {
    const updatedItemsPromise = items.map(async (item) => {
      const product = await sdk.product.get(item.product._id);
      if (!product) {
        return null;
      }

      const orderProduct = sdk.product.convertToOrderProduct(
        product,
        item.product.attributes
      );

      if (!orderProduct) {
        return null;
      }

      return {
        ...item,
        product: orderProduct,
      };
    });

    const updatedItems = await Promise.all(updatedItemsPromise);
    return updatedItems.filter((x) => !!x) as CartItemWithProduct[];
  } catch (err) {
    console.log(err);
    return [];
  }
};

const updateServerCart = (
  storeId: string,
  serverCartId: string,
  items: CartItemWithProduct[]
) => {
  sdk.cart.patch(serverCartId, {
    items: items
      .filter((item) => item.fromStore === storeId)
      .map((item: CartItemWithProduct) => ({
        ...item,
        product: {
          id: item.product._id,
          attributes: item.product.attributes,
        },
      })),
  });
};
