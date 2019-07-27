import { Order } from '../../../sdk/models/order';

export const getOrderStatusColor = (orderStatus: Order['status']) => {
  switch (orderStatus) {
    case 'cancelled': {
      return 'red';
    }
    case 'pending': {
      return 'orange';
    }
    case 'complete': {
      return 'green';
    }
    default: {
      return 'blue';
    }
  }
};
