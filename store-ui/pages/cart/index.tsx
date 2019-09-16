import { sdk } from 'la-sdk';
import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Cart } from '../../src/components/cart/Cart';
import { setCartWithProducts } from '../../src/state/modules/cart/cart.module';
import { getStore } from '../../src/state/modules/store/store.selector';

function CartPage({ cart, delivery }) {
  return (
    <>
      <Head title='Cart' />
      <Cart delivery={delivery} />
    </>
  );
}

CartPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = getStore(ctx.store.getState());
  try {
    const [cartWithProducts, deliveryResult] = await Promise.all([
      sdk.cart.getCartWithProductsForUser(store._id),
      sdk.delivery.findForStore(store._id),
    ]);

    ctx.store.dispatch(setCartWithProducts(cartWithProducts));

    return { delivery: deliveryResult.data[0] };
  } catch (err) {
    console.log(err);
    return {};
  }
};

export default CartPage;
