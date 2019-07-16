import { Application } from '@feathersjs/feathers';
import { stores } from '../../services/stores/stores';
import { products } from '../../services/products/products';
import { orders } from '../../services/orders/orders';
import { artifacts } from '../../services/artifacts/artifacts';
import { deliveries } from '../../services/deliveries/products';

export const registerServices = (app: Application) => {
  stores(app);
  products(app);
  orders(app);
  deliveries(app);
  artifacts(app);
};
