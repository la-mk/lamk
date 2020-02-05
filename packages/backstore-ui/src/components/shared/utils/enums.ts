import { Order } from '@sradevski/la-sdk/dist/models/order';
import { Product } from '@sradevski/la-sdk/dist/models/product';

// TODO: export these to the SDK
export const possibleOrderStatuses = [
  'cancelled',
  'pending',
  'shipped',
  'completed',
] as Order['status'][];

export const possibleUnits = [
  'item',
  'pack',
  'm2',
  'm',
  'cm',
  'mm',
  'kg',
  'g',
] as Product['unit'][];

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
