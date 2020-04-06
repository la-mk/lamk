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
import { TFunction } from 'next-i18next';

const getProductSummary = (product: ProductType, t: TFunction) => {
  const partialDescription = product.description?.slice(0, 100);
  return `${product.name}
  ${t('common.price')}: ${product.calculatedPrice}
  ${partialDescription ?? ''}...`;
};

const ProductPage = ({
  product,
  store,
}: {
  product: ProductType;
  store: Store | undefined;
}) => {
  const { t } = useTranslation();

  if (!product) {
    return (
      <>
        <Head
          storeName={store?.name}
          title={t('results.pageNotFound')}
          description={t('results.productNotFound')}
        />
        <Empty mt={6} description={t('results.productNotFound')} />
      </>
    );
  }

  return (
    <>
      <Head
        storeName={store?.name}
        title={product.name}
        description={getProductSummary(product, t)}
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
