import { Head } from '../../src/common/pageComponents/Head';
import { Orders } from '../../src/components/orders/Orders';
import { useTranslation } from '../../src/common/i18n';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';

function OrdersPage({ store }: { store: Store | undefined }) {
  const { t } = useTranslation();

  return (
    <>
      <Head
        siteName={store?.name}
        title={t('pages.order_plural')}
        description={`${t('pages.order_plural')}, ${store?.name}`}
      />
      <Orders />
    </>
  );
}

OrdersPage.getInitialProps = async function (
  ctx: NextPageContext & { store: any },
) {
  const state = ctx.store.getState();
  const store = getStore(state);
  return { store };
};

export default OrdersPage;
