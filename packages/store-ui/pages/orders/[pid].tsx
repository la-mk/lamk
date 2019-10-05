import React from 'react';
import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Order } from '../../src/components/orders/Order';

const OrderPage = ({ orderId }: { orderId: string }) => {
  return (
    <>
      <Head title={'Order'} />
      <Order orderId={orderId} />
    </>
  );
};

// This is a route that requires a registered user, so there is no data we can pre-fetch on the server.
OrderPage.getInitialProps = async function(
  ctx: NextPageContext & { store: any },
) {
  return { orderId: ctx.query.pid };
};

export default OrderPage;
