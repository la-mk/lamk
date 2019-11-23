import { Application } from '@feathersjs/feathers';
import { authentication } from '../../services/authentication/authentication';
import { stores } from '../../services/stores/stores';
import { products } from '../../services/products/products';
import { orders } from '../../services/orders/orders';
import { artifacts } from '../../services/artifacts/artifacts';
import { deliveries } from '../../services/deliveries/deliveries';
import { users } from '../../services/users/users';
import { carts } from '../../services/carts/carts';
import { addresses } from '../../services/addresses/addresses';
import { categories } from '../../services/categories/categories';
import { categoriesPerStore } from '../../services/categories-per-store/categoriesPerStore';
import { storeContents } from '../../services/store-contents/storeContents';

export const registerServices = (app: Application) => {
  authentication(app);
  stores(app);
  products(app);
  orders(app);
  deliveries(app);
  artifacts(app);
  users(app);
  carts(app);
  addresses(app);
  categories(app);
  categoriesPerStore(app);
  storeContents(app);
};
