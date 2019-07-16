import { Order } from '../../../sdk/models/order';

const initialState = { orders: [] };

const SET_ORDERS = 'orders/SET_ORDERS';

export default function orders(state = initialState, action: any) {
  switch (action.type) {
    case SET_ORDERS: {
      return { orders: action.orders };
    }
    default:
      return state;
  }
}

export function setOrders(orders: Order[]) {
  return {
    type: SET_ORDERS,
    orders,
  };
}
