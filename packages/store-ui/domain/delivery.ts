export enum DeliveryMethods {
  PICKUP = 'pickup',
  CARGO_PICKUP = 'cargo-pickup',
  DOOR_TO_DOOR = 'door-to-door',
}

export interface Delivery {
  forStore: string;
  method: DeliveryMethods;
  price: number;
  freeDeliveryOver: number;
}
