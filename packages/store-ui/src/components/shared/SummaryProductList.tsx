import React from 'react';
import { Flex } from '@sradevski/blocks-ui';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { ProductImageWithTitle } from './ProductImageWithTitle';
import { OrderItem } from '@sradevski/la-sdk/dist/models/order';

export const SummaryProductList = ({
  items,
  storeId,
}: {
  items: (CartItemWithProduct | OrderItem)[];
  storeId: string;
}) => {
  return (
    <Flex flexDirection='column'>
      {items.map((cartItem, index) => {
        return (
          <ProductImageWithTitle
            mb={index === items.length - 1 ? 0 : 3}
            product={cartItem.product}
            quantity={cartItem.quantity}
            storeId={storeId}
          />
        );
      })}
    </Flex>
  );
};
