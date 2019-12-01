import { NextPageContext } from 'next';
import { Head } from '../../src/common/pageComponents/Head';
import { Cart } from '../../src/components/cart/Cart';
import { setDeliveryIfNone } from '../../src/common/initialProps/setDeliveryIfNone';
import { useTranslation } from '../../src/common/i18n';

function CartPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head title={t('pages.cart')} />
      <Cart />
    </>
  );
}

CartPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  try {
    await setDeliveryIfNone(ctx);
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default CartPage;
