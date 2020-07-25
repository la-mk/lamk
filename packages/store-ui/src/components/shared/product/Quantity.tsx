import React from 'react';
import { InputNumber } from '@sradevski/blocks-ui';
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
} & React.ComponentProps<typeof InputNumber>) => {
  return (
    <InputNumber
      width='80px'
      min={1}
      max={cartItem.product.stock || 999}
      value={cartItem.quantity}
      onChange={value => handleChangeItemQuantity(cartItem, value)}
      {...props}
    />
  );
};
