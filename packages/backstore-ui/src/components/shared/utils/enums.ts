import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';

export const getOrderStatusColor = (orderStatus: Order['status']) => {
  switch (orderStatus) {
    case sdk.order.OrderStatus.CANCELLED: {
      return '#f5222d';
    }
    case sdk.order.OrderStatus.PENDING_SHIPMENT: {
      return '#1890ff';
    }
    case sdk.order.OrderStatus.SHIPPED: {
      return '#5F5449';
    }
    case sdk.order.OrderStatus.COMPLETED: {
      return '#52c41a';
    }
    default: {
      return '#13c2c2';
    }
  }
};
