import { orders } from '../../services/orders/orders';
//@ts-ignore
import * as memory from 'feathers-memory';

export const registerServices = (app: any) => {
  app.use('orders', orders);
  // This provides the same API as the custom implementation of the orders, but without writing any custom code and directly managing the DB (in-memory in this case)
  app.use(
    'products',
    memory({
      paginate: {
        default: 10,
        max: 25,
      },
    }),
  );
};
