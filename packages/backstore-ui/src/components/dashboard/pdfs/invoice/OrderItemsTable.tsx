import React from 'react';
import { Table } from './Table';
import { Order } from '@sradevski/la-sdk/dist/models/order';

export const OrderItemsTable = ({
  orderedItems,
  translations,
}: {
  orderedItems: Order['ordered'];
  translations: {
    product: string;
    quantity: string;
    price: string;
    discount: string;
    tax: string;
    amountWithTax: string;
    index: string;
    id: string;
  };
}) => {
  return (
    <Table
      cellWidths={[30, 100, 400, 100, 100, 100, 80, 100]}
      rows={[
        [
          { text: translations.index },
          { text: translations.id },
          { text: translations.product },
          { text: translations.quantity },
          { text: translations.price },
          { text: translations.discount },
          { text: translations.tax },
          { text: translations.amountWithTax },
        ],
        ...orderedItems.map((item, index) => {
          return [
            { text: (index + 1).toString() },
            { text: item.product.sku ?? '' },
            { text: item.product.name },
            { text: item.quantity.toFixed(2) },
            {
              text: (
                item.product.calculatedPrice -
                item.product.calculatedPrice * 0.18
              ).toFixed(2),
            },
            {
              text: item.product.discount
                ? `${(
                    item.product.calculatedPrice / item.product.price
                  ).toFixed(2)}%`
                : '',
            },
            { text: '18%' },
            { text: (item.quantity * item.product.calculatedPrice).toFixed(2) },
          ];
        }),
      ]}
    />
  );
};
