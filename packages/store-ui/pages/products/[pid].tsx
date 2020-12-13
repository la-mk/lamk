import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from '@sradevski/la-sdk';
import { Head } from '../../src/common/pageComponents/Head';
import { Product as ProductType } from '@sradevski/la-sdk/dist/models/product';
import { Product } from '../../src/components/products/Product';
import { Result } from '@sradevski/blocks-ui';
import { useTranslation } from '../../src/common/i18n';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { transliterate } from '@sradevski/nlp';
import { TFunction } from 'next-i18next';

//TODO: Un-hardcode transliteration language and either detect it or store it in DB.
const getProductSummary = (product: ProductType, t: TFunction) => {
  const partialDescription = product.description?.slice(0, 130);
  const transliteratedName = transliterate(product.name, 'mk', 'en').replace(
    '\n',
    ' ',
  );

  return `${transliteratedName}, ${t('common.price')}: ${
    product.minCalculatedPrice
  } ден. ${partialDescription ?? ''}...`;
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
          siteName={store?.name}
          title={t('results.pageNotFound')}
          description={t('results.productNotFound')}
        />
        <Result
          status='empty'
          mt={8}
          description={t('results.productNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Head
        siteName={store?.name}
        title={product.name}
        description={getProductSummary(product, t)}
        previewImages={product.images.map(imageId =>
          sdk.artifact.getUrlForImage(imageId, store._id, { h: 300 }),
        )}
      />
      <Product product={product} />
    </>
  );
};

ProductPage.getInitialProps = async function (
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
