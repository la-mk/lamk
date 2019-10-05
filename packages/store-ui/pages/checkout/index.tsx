import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Checkout } from '../../src/components/cart/Checkout';
import { setDeliveryIfNone } from '../common/initialProps/setDeliveryIfNone';

function CheckoutPage() {
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
