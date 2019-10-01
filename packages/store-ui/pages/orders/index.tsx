import { sdk } from 'la-sdk';
import { Head } from '../common/Head';
import { Orders } from '../../src/components/orders/Orders';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { Empty } from 'blocks-ui';

function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const user = useSelector(getUser);
  useEffect(() => {
    if (!user) {
      return;
    }

    sdk.order
      .findForUser(user._id)
      .then(orders => {
        setOrders(orders.data);
      })
      .catch(err => console.log(err));
  }, [user]);

  if (!orders) {
    return <Empty mt={5} description='Orders not found'></Empty>;
  }

  return (
    <>
      <Head title='Orders' />
      <Orders orders={orders} />
    </>
  );
}

export default OrdersPage;
