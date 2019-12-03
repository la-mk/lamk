import { sdk } from '@lamk/la-sdk';
import { Product } from '@lamk/la-sdk/dist/models/product';
import queryString from 'qs';
import { Head } from '../../src/common/pageComponents/Head';
import { Products } from '../../src/components/products/Products';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';
import { useTranslation } from '../../src/common/i18n';

const getQueryString = (path: string) => {
  if (path.includes('?')) {
    return path.slice(path.indexOf('?') + 1);
  }

  return '';
};

function ProductsPage({
  products,
  filters,
}: {
  products: Product[];
  filters: any;
}) {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('pages.product_plural')} />
      <Products initialProducts={products} initialFilters={filters} />
    </>
  );
}

ProductsPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const store = getStore(ctx.store.getState());
  const query = queryString.parse(getQueryString(ctx.asPath));
  try {
    const products = await sdk.product.findForStore(store._id, query);
    return { products: products.data };
  } catch (err) {
    console.log(err);
  }

  return { products: [], filters: query };
};

export default ProductsPage;
