import { hooks, Steps } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { TFunction } from 'next-i18next';
import React from 'react';

export interface OrderStepsProps {
  t: TFunction;
  status: Order['status'];
  isCardPayment: boolean;
}

export const OrderSteps = ({ t, status, isCardPayment }: OrderStepsProps) => {
  const orientation = hooks.useBreakpoint<'vertical' | 'horizontal'>([
    'vertical',
    'vertical',
    'horizontal',
  ]);

  // The SDK doesn't exist if this is defined outside the component
  const OrderStatus = sdk.order.OrderStatus;
  const statusWeight = {
    [OrderStatus.PENDING_PAYMENT]: 0,
    [OrderStatus.PENDING_SHIPMENT]: 5,
    [OrderStatus.SHIPPED]: 10,
    [OrderStatus.COMPLETED]: 15,
    [OrderStatus.CANCELLED]: 20,
    [OrderStatus.INVALID]: 25,
  };

  return (
    <Steps
      orientation={orientation}
      steps={
        [
          ...(isCardPayment
            ? [
                {
                  status:
                    statusWeight[status] <
                    statusWeight[OrderStatus.PENDING_PAYMENT]
                      ? 'pending'
                      : 'success',
                  title: t('orderStatus.pendingPayment'),
                  description: t('orderStatus.pendingPaymentDescription'),
                  key: OrderStatus.PENDING_PAYMENT,
                },
              ]
            : []),
          {
            status:
              statusWeight[status] < statusWeight[OrderStatus.PENDING_SHIPMENT]
                ? 'pending'
                : 'success',
            title: t('orderStatus.pendingShipment'),
            description: t('orderStatus.pendingShipmentDescription'),
            key: OrderStatus.PENDING_SHIPMENT,
          },
          {
            status:
              statusWeight[status] < statusWeight[OrderStatus.SHIPPED]
                ? 'pending'
                : 'success',
            title: t('orderStatus.shipped'),
            description: t('orderStatus.shippedDescription'),
            key: OrderStatus.SHIPPED,
          },
          ...(status !== OrderStatus.CANCELLED && status !== OrderStatus.INVALID
            ? [
                {
                  status:
                    statusWeight[status] < statusWeight[OrderStatus.COMPLETED]
                      ? 'pending'
                      : 'success',
                  title: t('orderStatus.completed'),
                  description: t('orderStatus.completedDescription'),
                  key: OrderStatus.COMPLETED,
                },
              ]
            : []),

          ...(status === OrderStatus.CANCELLED
            ? [
                {
                  status:
                    statusWeight[status] < statusWeight[OrderStatus.CANCELLED]
                      ? 'pending'
                      : 'danger',
                  title: t('orderStatus.cancelled'),
                  description: t('orderStatus.cancelledDescription'),
                  key: OrderStatus.CANCELLED,
                },
              ]
            : []),

          ...(status === OrderStatus.INVALID
            ? [
                {
                  status:
                    statusWeight[status] <= statusWeight[OrderStatus.INVALID]
                      ? 'pending'
                      : 'danger',
                  title: t('orderStatus.invalid'),
                  description: t('orderStatus.invalidDescription'),
                  key: OrderStatus.INVALID,
                },
              ]
            : []),
        ] as any
      }
    />
  );
};
