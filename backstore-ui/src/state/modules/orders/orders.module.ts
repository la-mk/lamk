import { Order } from '../../../sdk/models/order';

const initialState: { orders: Order[] } = { orders: [] };

const SET_ORDERS = 'orders/SET_ORDERS';
const SET_ORDER = 'orders/SET_ORDER';
const REMOVE_ORDER = 'orders/REMOVE_ORDER';

export default function orders(state = initialState, action: any) {
  switch (action.type) {
    case SET_ORDERS: {
      return { orders: action.orders };
    }
    case SET_ORDER: {
      return {
        orders: [
          ...state.orders.filter(order => order._id !== action.order._id),
          action.order,
        ],
      };
    }
    case REMOVE_ORDER: {
      return {
        orders: state.orders.filter(order => order._id !== action.orderId),
      };
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

export function setOrder(order: Order) {
  return {
    type: SET_ORDER,
    order,
  };
}

export function removeOrder(orderId: string) {
  return {
    type: REMOVE_ORDER,
    orderId,
  };
}
