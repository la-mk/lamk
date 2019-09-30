import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Checkout } from '../../src/components/cart/Checkout';
import { setDeliveryIfNone } from '../common/initialProps/setDeliveryIfNone';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getUser,
  getAddresses,
} from '../../src/state/modules/user/user.selector';
import { getCartWithProducts } from '../../src/state/modules/cart/cart.selector';
import { setCartWithProducts } from '../../src/state/modules/cart/cart.module';
import { sdk } from 'la-sdk';
import { setAddresses } from '../../src/state/modules/user/user.module';

function CheckoutPage() {
  const user = useSelector(getUser);
  const cart = useSelector(getCartWithProducts);
  const addresses = useSelector(getAddresses);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!cart) {
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

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!addresses) {
      sdk.address
        .findForUser(user._id)
        .then(addresses => {
          dispatch(setAddresses(addresses.data));
        })
        .catch(err => console.log(err));
    }
  }, [user, addresses]);

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
