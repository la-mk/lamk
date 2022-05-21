import { Attributes, OrderedProduct } from "./product";

export interface CartItem {
  product: {
    id: string;
    attributes?: Attributes;
  };
  fromStore: string;
  quantity: number;
}

export interface CartItemWithProduct extends Omit<CartItem, "product"> {
  product: OrderedProduct;
}

export interface CartWithProducts {
  _id?: string;
  items: CartItemWithProduct[];
}
