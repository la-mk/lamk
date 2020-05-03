import React from 'react';
import { NextPageContext } from 'next';
import { Head } from '../../../src/common/pageComponents/Head';
import { Order } from '../../../src/components/orders/Order';
import { useTranslation } from '../../../src/common/i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { getStore } from '../../../src/state/modules/store/store.selector';

const OrderPage = ({
  store,
  orderId,
}: {
  store: Store | undefined;
  orderId: string;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Head
        siteName={store?.name}
        title={t('pages.order')}
        description={`${t('pages.order')}, ${store?.name}`}
      />
      <Order orderId={orderId} />
    </>
  );
};

// This is a route that requires a registered user, so there is no data we can pre-fetch on the server.
OrderPage.getInitialProps = async function(
  ctx: NextPageContext & { store: any },
) {
  const state = ctx.store.getState();
  const store = getStore(state);
  return { store, orderId: ctx.query.oid };
};

export default OrderPage;
