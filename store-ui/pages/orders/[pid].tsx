import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from 'la-sdk';
import { Head } from '../common/Head';
import { Order as OrderType } from 'la-sdk/dist/models/order';
import { Order } from '../../src/components/orders/Order';

const OrderPage = ({ order }: { order: OrderType }) => {
  if (!order) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Head title={'Order'} />
      <Order order={order} />
    </>
  );
};

OrderPage.getInitialProps = async function(ctx: NextPageContext) {
  if (ctx.query.pid) {
    const order = await sdk.order
      .get(ctx.query.pid as string)
      .catch(err => console.log(err));

    return { order };
  }

  return { order: null };
};

export default OrderPage;
