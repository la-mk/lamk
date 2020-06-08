import React from 'react';
import { Line } from 'recharts';
import { TFunction } from 'i18next';
import { sdk } from '@sradevski/la-sdk';

export const statusLines = (t: TFunction) => [
  <Line
    isAnimationActive={false}
    name={t('orderStatus.cancelled') as string}
    type='monotone'
    dataKey={entry => entry.value.cancelled ?? 0}
    stroke={sdk.order.orderStatusColor[sdk.order.OrderStatus.CANCELLED]}
  />,
  <Line
    isAnimationActive={false}
    name={t('orderStatus.pendingPayment') as string}
    type='monotone'
    dataKey={entry => entry.value.pendingPayment ?? 0}
    stroke={sdk.order.orderStatusColor[sdk.order.OrderStatus.PENDING_PAYMENT]}
  />,
  <Line
    isAnimationActive={false}
    name={t('orderStatus.pendingShipment') as string}
    type='monotone'
    dataKey={entry => entry.value.pendingShipment ?? 0}
    stroke={sdk.order.orderStatusColor[sdk.order.OrderStatus.PENDING_SHIPMENT]}
  />,
  <Line
    isAnimationActive={false}
    name={t('orderStatus.shipped') as string}
    type='monotone'
    dataKey={entry => entry.value.shipped ?? 0}
    stroke={sdk.order.orderStatusColor[sdk.order.OrderStatus.SHIPPED]}
  />,
  <Line
    isAnimationActive={false}
    name={t('orderStatus.completed') as string}
    type='monotone'
    dataKey={entry => entry.value.completed ?? 0}
    stroke={sdk.order.orderStatusColor[sdk.order.OrderStatus.COMPLETED]}
  />,
];
