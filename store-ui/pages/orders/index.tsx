import { sdk } from 'la-sdk';
import { Order } from 'la-sdk/dist/models/order';
import { Head } from '../common/Head';
import { Orders } from '../../src/components/orders/Orders';
import { NextPageContext } from 'next';
import { getUser } from '../../src/state/modules/user/user.selector';

function OrdersPage({ orders }: { orders: Order[] }) {
  return (
    <>
      <Head title='Orders' />
      <Orders orders={orders} />
    </>
  );
}

OrdersPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const state = ctx.store.getState();
  const user = getUser(state);

  if (user) {
    try {
      const orders = await sdk.order.findForUser(user._id);
      return { orders: orders.data };
    } catch (err) {
      console.log(err);
    }
  }

  return { orders: [] };
};

export default OrdersPage;
