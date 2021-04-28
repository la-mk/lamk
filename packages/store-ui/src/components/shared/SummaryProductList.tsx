import React from 'react';
import { Grid } from '@la-mk/blocks-ui';
import { CartItemWithProduct } from '@la-mk/la-sdk/dist/models/cart';
import { ProductImageWithTitle } from './product/ProductImageWithTitle';
import { OrderItem } from '@la-mk/la-sdk/dist/models/order';
import { Store } from '@la-mk/la-sdk/dist/models/store';

export const SummaryProductList = ({
  items,
  storeId,
  currency,
}: {
  items: (CartItemWithProduct | OrderItem)[];
  storeId: string;
  currency: string;
}) => {
  return (
    <Grid spacing={5}>
      {items.map(cartItem => {
        return (
          <ProductImageWithTitle
            product={cartItem.product}
            quantity={cartItem.quantity}
            storeId={storeId}
            currency={currency}
          />
        );
      })}
    </Grid>
  );
};
