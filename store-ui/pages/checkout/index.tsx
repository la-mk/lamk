import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Checkout } from '../../src/components/cart/Checkout';
import { setDeliveryIfNone } from '../common/initialProps/setDeliveryIfNone';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { getCartWithProducts } from '../../src/state/modules/cart/cart.selector';
import { setCartWithProducts } from '../../src/state/modules/cart/cart.module';
import { sdk } from 'la-sdk';

function CheckoutPage() {
  const user = useSelector(getUser);
  const cart = useSelector(getCartWithProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && !cart) {
      sdk.cart
        .getCartWithProductsForUser(user._id)
        .then(cartWithProducts => {
          if (cartWithProducts) {
            dispatch(setCartWithProducts(cartWithProducts));
          }
        })
        .catch(err => console.log(err));
    }
  }, [user, cart]);

  return (
    <>
      <Head title='Checkout' />
      <Checkout />
    </>
  );
}

CheckoutPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  try {
    await setDeliveryIfNone(ctx);
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default CheckoutPage;
