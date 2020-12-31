import React from 'react';
import { Input } from '@sradevski/blocks-ui';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';

export const Quantity = ({
  cartItem,
  handleChangeItemQuantity,
  ...props
}: {
  cartItem: CartItemWithProduct;
  handleChangeItemQuantity: (
    cartItem: CartItemWithProduct,
    value: number,
  ) => void;
} & React.ComponentProps<typeof Input>) => {
  return (
    <Input
      type='number'
      width='5rem'
      min={1}
      max={cartItem.product.stock || 9999}
      value={cartItem.quantity}
      onChange={(_e, value: number) =>
        handleChangeItemQuantity(cartItem, value)
      }
      {...props}
    />
  );
};
