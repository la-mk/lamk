import React from 'react';
import { Grid } from '@la-mk/blocks-ui';
import { CartItemWithProduct } from '@la-mk/la-sdk/dist/models/cart';
import { ProductImageWithTitle } from './product/ProductImageWithTitle';
import { OrderItem } from '@la-mk/la-sdk/dist/models/order';

export const SummaryProductList = ({
  items,
  storeId,
}: {
  items: (CartItemWithProduct | OrderItem)[];
  storeId: string;
}) => {
  return (
    <Grid spacing={5}>
      {items.map(cartItem => {
        return (
          <ProductImageWithTitle
            product={cartItem.product}
            quantity={cartItem.quantity}
            storeId={storeId}
          />
        );
      })}
    </Grid>
  );
};
