import { Delivery } from 'la-sdk/dist/models/delivery';

const initialState = { delivery: {} };

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
