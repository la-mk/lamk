import { Head } from '../../src/common/pageComponents/Head';
import { Orders } from '../../src/components/orders/Orders';
import { useTranslation } from '../../src/common/i18n';
function OrdersPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('pages.order_plural')} />
      <Orders />
    </>
  );
}

export default OrdersPage;
