import { sdk } from 'la-sdk';
import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Cart } from '../../src/components/cart/Cart';

function CartPage({ cartItems, delivery }) {
  return (
    <>
      <Head title='Cart' />
      <Cart cartItems={cartItems} delivery={delivery} />
    </>
  );
}

CartPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = ctx.store.getState().store;
  let res;
  try {
    res = await Promise.all([
      sdk.product.findForStore(store._id),
      sdk.delivery.findForStore(store._id),
    ]);
  } catch (err) {
    console.log(err);
  }

  return {
    cartItems: [
      {
        quantity: 3,
        product: res[0].data[0],
      },
      {
        quantity: 2,
        product: res[0].data[1],
      },
    ],
    delivery: res[1].data[0],
  };
};

export default CartPage;
