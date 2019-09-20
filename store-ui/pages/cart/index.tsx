import { sdk } from 'la-sdk';
import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Cart } from '../../src/components/cart/Cart';
import { setCartWithProducts } from '../../src/state/modules/cart/cart.module';
import { getStore } from '../../src/state/modules/store/store.selector';
import { getUser } from '../../src/state/modules/user/user.selector';
import { CartWithProducts } from 'la-sdk/dist/models/cart';

function CartPage({ cart, delivery }) {
  return (
    <>
      <Head title='Cart' />
      <Cart delivery={delivery} />
    </>
  );
}

CartPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const state = ctx.store.getState();
  const store = getStore(state);
  const user = getUser(state);
  const cartAction: Promise<CartWithProducts | void> = user
    ? sdk.cart.getCartWithProductsForUser(user._id)
    : Promise.resolve();

  try {
    const [cartWithProducts, deliveryResult] = await Promise.all([
      cartAction,
      sdk.delivery.findForStore(store._id),
    ]);

    if (cartWithProducts) {
      ctx.store.dispatch(setCartWithProducts(cartWithProducts));
    }

    return { delivery: deliveryResult.data[0] };
  } catch (err) {
    console.log(err);
    return {};
  }
};

export default CartPage;
