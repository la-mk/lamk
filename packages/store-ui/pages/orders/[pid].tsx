import React from 'react';
import { NextPageContext } from 'next';
import { Head } from '../common/Head';
import { Order } from '../../src/components/orders/Order';
import { useTranslation } from '../../src/common/i18n';

const OrderPage = ({ orderId }: { orderId: string }) => {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('pages.order')} />
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
