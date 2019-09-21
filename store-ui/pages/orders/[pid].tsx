import React, { useState, useEffect } from 'react';
import { NextPageContext } from 'next';
import { sdk } from 'la-sdk';
import { Head } from '../common/Head';
import { Order } from '../../src/components/orders/Order';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';

const OrderPage = ({ orderId }: { orderId: string }) => {
  const [order, setOrder] = useState(null);
  const user = useSelector(getUser);

  useEffect(() => {
    if (orderId && user) {
      sdk.order
        .get(orderId)
        .then(order => {
          setOrder(order);
        })
        .catch(err => console.log(err));
    }
  }, [user, orderId]);

  return (
    <>
      <Head title={'Order'} />
      <Order order={order} />
    </>
  );
};

// This is a route that requires a registered user, so there is no data we can pre-fetch on the server.
OrderPage.getInitialProps = async function(ctx: NextPageContext) {
  return { orderId: ctx.query.pid };
};

export default OrderPage;
