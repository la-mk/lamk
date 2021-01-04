import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';

const initialState = { delivery: null };

const SET_DELIVERY = 'delivery/SET_DELIVERY';

export default function delivery(state = initialState, action: any) {
  switch (action.type) {
    case SET_DELIVERY: {
      return { delivery: action.delivery };
    }
    default:
      return state;
  }
}

export function setDelivery(delivery: Delivery) {
  return {
    type: SET_DELIVERY,
    delivery,
  };
}
