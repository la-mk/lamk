import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';

export const getOrderStatusColor = (orderStatus: Order['status']) => {
  switch (orderStatus) {
    case sdk.order.OrderStatus.CANCELLED: {
      return 'red';
    }
    case sdk.order.OrderStatus.PENDING: {
      return 'yellow';
    }
    case sdk.order.OrderStatus.SHIPPED: {
      return 'orange';
    }
    case sdk.order.OrderStatus.COMPLETED: {
      return 'green';
    }
    default: {
      return 'blue';
    }
  }
};
