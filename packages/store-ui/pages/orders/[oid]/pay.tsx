import React from 'react';
import { NextPageContext } from 'next';
import { Head } from '../../../src/common/pageComponents/Head';
import { useTranslation } from '../../../src/common/i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { getStore } from '../../../src/state/modules/store/store.selector';
import { Payment } from '../../../src/components/orders/Payment';

const OrderPayPage = ({
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
        storeName={store?.name}
        title={t('pages.payment')}
        description={`${t('pages.payment')}, ${t('pages.order')} ${orderId}`}
      />
      <Payment orderId={orderId} />
    </>
  );
};

// This is a route that requires a registered user, so there is no data we can pre-fetch on the server.
OrderPayPage.getInitialProps = async function(
  ctx: NextPageContext & { store: any },
) {
  const state = ctx.store.getState();
  const store = getStore(state);
  return { store, orderId: ctx.query.oid };
};

export default OrderPayPage;
