import address from './address';
import user from './user';
import store from './store';
import campaign from './campaign';
import category from './category';
import product from './product';
import delivery from './delivery';
import order from './order';

const generators = {
  address: address.generator,
  user: user.generator,
  store: store.generator,
  campaign: campaign.generator,
  category: category.generator,
  product: product.generator,
  delivery: delivery.generator,
  order: order.generator,
};

export default generators;
