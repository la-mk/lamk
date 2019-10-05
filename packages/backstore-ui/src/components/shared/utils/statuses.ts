import { Order } from '@lamk/la-sdk/dist/models/order';

export const possibleOrderStatuses = [
  'cancelled',
  'pending',
  'shipped',
  'completed',
] as Order['status'][];

export const getOrderStatusColor = (orderStatus: Order['status']) => {
  switch (orderStatus) {
    case 'cancelled': {
      return 'red';
    }
    case 'pending': {
      return 'yellow';
    }
    case 'shipped': {
      return 'orange';
    }
    case 'completed': {
      return 'green';
    }
    default: {
      return 'blue';
    }
  }
};
