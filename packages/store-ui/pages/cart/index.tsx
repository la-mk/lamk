import { NextPageContext } from 'next';
import { Head } from '../../src/common/pageComponents/Head';
import { Cart } from '../../src/components/cart/Cart';
import { setDeliveryIfNone } from '../../src/common/initialProps/setDeliveryIfNone';
import { useTranslation } from '../../src/common/i18n';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';

function CartPage({ store }: { store: Store | undefined }) {
  const { t } = useTranslation();
  return (
    <>
      <Head
        storeName={store?.name}
        title={t('pages.cart')}
        description={`${t('pages.cart')}, ${store?.name}`}
      />
      <Cart />
    </>
  );
}

CartPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  try {
    const state = ctx.store.getState();
    const store = getStore(state);
    await setDeliveryIfNone(ctx);

    return { store };
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default CartPage;
