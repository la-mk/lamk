import { stores } from '../../services/stores/stores';
import { products } from '../../services/products/products';
import { Application } from '@feathersjs/feathers';

export const registerServices = (app: Application<any>) => {
  return Promise.all([stores(app), products(app)]);
};
