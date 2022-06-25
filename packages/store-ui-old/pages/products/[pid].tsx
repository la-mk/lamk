import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from '@la-mk/la-sdk';
import { Head } from '../../src/common/pageComponents/Head';
import { Product as ProductType } from '@la-mk/la-sdk/dist/models/product';
import { Product } from '../../src/components/products/Product';
import { Result } from '@la-mk/blocks-ui';
import { useTranslation } from '../../src/common/i18n';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { transliterate } from '@la-mk/nlp';
import { TFunction } from 'next-i18next';

//TODO: Un-hardcode transliteration language and either detect it or store it in DB.
const getProductSummary = (
  product: ProductType,
  store: Store,
  t: TFunction,
) => {
  const partialDescription = product.description?.slice(0, 130);
  const transliteratedName = transliterate(product.name, 'mk', 'en').replace(
    '\n',
    ' ',
  );

  return `${partialDescription ?? ''}, ${t('common.price')}: ${
    product.minCalculatedPrice
  } ${t(
    `currencies.${store.preferences.currency ?? 'mkd'}`,
  )}. ${transliteratedName}`;
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
          url={`/products`}
          store={store}
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
        url={`/products/${product._id}`}
        store={store}
        title={product.name}
        description={getProductSummary(product, store, t)}
        images={product.media.map(mediaFile => ({
          url: sdk.artifact.getUrlForImage(mediaFile._id, store._id, {
            h: 300,
          }),
          height: mediaFile.height,
          width: mediaFile.width,
        }))}
        product={{
          productName: product.name,
          description: product.description,
          aggregateOffer: {
            priceCurrency: (store.preferences.currency ?? 'mkd').toUpperCase(),
            lowPrice: product.minCalculatedPrice.toFixed(2),
            highPrice: product.maxCalculatedPrice.toFixed(2),
            offerCount: product.variants.length.toString(),
          },
        }}
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
