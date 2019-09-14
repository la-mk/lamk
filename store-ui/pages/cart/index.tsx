import { sdk } from 'la-sdk';
import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Cart } from '../../src/components/cart/Cart';

function CartPage({ cart, delivery }) {
  return (
    <>
      <Head title='Cart' />
      <Cart cart={cart} delivery={delivery} />
    </>
  );
}

CartPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = ctx.store.getState().store;
  try {
    const [cart, deliveryResult] = await Promise.all([
      sdk.cart.getCartWithProductsForUser(store._id),
      sdk.delivery.findForStore(store._id),
    ]);

    return { cart, delivery: deliveryResult.data[0] };
  } catch (err) {
    console.log(err);
    return {};
  }
};

export default CartPage;
