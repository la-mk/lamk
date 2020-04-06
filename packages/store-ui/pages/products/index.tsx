import { sdk } from '@sradevski/la-sdk';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { utils } from '@sradevski/blocks-ui';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Head } from '../../src/common/pageComponents/Head';
import { Products } from '../../src/components/products/Products';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';
import { useTranslation } from '../../src/common/i18n';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { setCategoriesIfNone } from '../../src/common/initialProps/setCategoriesIfNone';
import { Store } from '@sradevski/la-sdk/dist/models/store';

function ProductsPage({
  products,
  filters,
  store,
}: {
  products: FindResult<Product>;
  filters: FilterObject;
  store: Store | undefined;
}) {
  const { t } = useTranslation();

  return (
    <>
      <Head
        storeName={store?.name}
        title={t('pages.product_plural')}
        description={t('seoDescriptions.product_plural')}
      />
      <Products initialProducts={products} initialFilters={filters} />
    </>
  );
}

ProductsPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const store = getStore(ctx.store.getState());
  const parsedFilters = utils.filter.parseFiltersUrl(ctx.asPath);
  const query = utils.filter.filtersAsQuery(parsedFilters);
  try {
    const res = await Promise.all([
      sdk.product.findForStore(store._id, query),
      setCategoriesIfNone(ctx),
    ]);

    return { store, products: res[0], filters: parsedFilters };
  } catch (err) {
    console.log(err);
  }

  return { store, products: { data: [] }, filters: parsedFilters };
};

export default ProductsPage;
