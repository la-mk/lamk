import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { Head } from '../../../../src/components/layout/Head';
import { useTranslation } from '../../../../src/common/i18n';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { getStore } from '../../../../src/state/modules/store/store.selector';
import { Payment } from '../../../../src/components/account/orders/Payment';
import { Order } from '../../../../src/domain/order';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../src/state/modules/user/user.selector';
import { hooks } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';

const OrderPayPage = ({
  store,
  orderId,
}: {
  store: Store | undefined;
  orderId: string;
}) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [order, setOrder] = useState<Order>(null);
  const user = useSelector(getUser);

  useEffect(() => {
    if (orderId && user) {
      caller(sdk.order.get(orderId), res => {
        setOrder({
          ...res,
          ordered: res.ordered.map(x => ({
            product: { ...x.product, quantity: x.quantity },
            quantity: x.quantity,
          })),
        });
      });
    }
  }, [caller, user, orderId]);

  return (
    <>
      <Head
        url={`/orders/${orderId}/pay`}
        store={store}
        title={t('pages.payment')}
        description={`${t('pages.payment')}, ${t('pages.order')} ${orderId}`}
      />
      <Payment
        isLoadingOrder={showSpinner}
        store={store}
        user={user}
        order={order}
      />
    </>
  );
};

// This is a route that requires a registered user, so there is no data we can pre-fetch on the server.
OrderPayPage.getInitialProps = async function (
  ctx: NextPageContext & { store: any },
) {
  const state = ctx.store.getState();
  const store = getStore(state);
  return { store, orderId: ctx.query.oid };
};

export default OrderPayPage;
