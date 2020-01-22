import { sdk } from '@sradevski/la-sdk';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Head } from '../../src/common/pageComponents/Head';
import { Products } from '../../src/components/products/Products';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';
import { useTranslation } from '../../src/common/i18n';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { setCategoriesIfNone } from '../../src/common/initialProps/setCategoriesIfNone';
import { parseFiltersUrl, filtersAsQuery } from '../../src/common/filterUtils';
import { FilterObject } from '../../src/components/shared/hooks/useFilter';

function ProductsPage({
  products,
  filters,
}: {
  products: FindResult<Product>;
  filters: FilterObject;
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
  const parsedFilters = parseFiltersUrl(ctx.asPath);
  const query = filtersAsQuery(parsedFilters);
  try {
    const res = await Promise.all([
      sdk.product.findForStore(store._id, query),
      setCategoriesIfNone(ctx),
    ]);

    return { products: res[0], filters: parsedFilters };
  } catch (err) {
    console.log(err);
  }

  return { products: { data: [] }, filters: parsedFilters };
};

export default ProductsPage;
