import { stores } from '../../services/stores/stores';
import { products } from '../../services/products/products';
import { artifacts } from '../../services/artifacts/artifacts';
import { Application } from '@feathersjs/feathers';

export const registerServices = (app: Application) => {
  stores(app);
  products(app);
  artifacts(app);
};
