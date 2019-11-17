import { sdk } from '@lamk/la-sdk';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { Head } from '../common/Head';
import { Products } from '../../src/components/products/Products';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';
import { useTranslation } from '../../src/common/i18n';

function ProductsPage({ products }: { products: Product[] }) {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('pages.product_plural')} />
      <Products products={products} />
    </>
  );
}

ProductsPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const store = getStore(ctx.store.getState());

  try {
    const products = await sdk.product.findForStore(store._id);
    return { products: products.data };
  } catch (err) {
    console.log(err);
  }

  return { products: [] };
};

export default ProductsPage;
