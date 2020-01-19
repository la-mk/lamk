import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from '@sradevski/la-sdk';
import { Head } from '../../src/common/pageComponents/Head';
import { Product as ProductType } from '@sradevski/la-sdk/dist/models/product';
import { Product } from '../../src/components/products/Product';
import { Empty } from '@sradevski/blocks-ui';
import { useTranslation } from '../../src/common/i18n';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';

const ProductPage = ({
  product,
  store,
}: {
  product: ProductType;
  store: Store;
}) => {
  const { t } = useTranslation();

  if (!product) {
    return <Empty mt={6} description={t('results.productNotFound')}></Empty>;
  }

  return (
    <>
      <Head
        title={product.name}
        previewImages={product.images.map(imageId =>
          sdk.artifact.getUrlForArtifact(imageId, store._id),
        )}
      />
      <Product product={product} />
    </>
  );
};

ProductPage.getInitialProps = async function(
  ctx: NextPageContext & { store: any },
) {
  const store = getStore(ctx.store.getState());
  if (ctx.query.pid) {
    const product = await sdk.product
      .get(ctx.query.pid as string)
      .catch(err => console.log(err));

    return { product, store };
  }

  return { product: null, store };
};

export default ProductPage;
