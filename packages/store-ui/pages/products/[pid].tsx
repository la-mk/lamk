import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from '@lamk/la-sdk';
import { Head } from '../common/Head';
import { Product as ProductType } from '@lamk/la-sdk/dist/models/product';
import { Product } from '../../src/components/products/Product';
import { Empty } from '@lamk/blocks-ui';
import { useTranslation } from '../../src/common/i18n';

const ProductPage = ({ product }: { product: ProductType }) => {
  const { t } = useTranslation();

  if (!product) {
    return <Empty mt={5} description={t('results.productNotFound')}></Empty>;
  }

  return (
    <>
      <Head title={product.name} />
      <Product product={product} />
    </>
  );
};

ProductPage.getInitialProps = async function(ctx: NextPageContext) {
  if (ctx.query.pid) {
    const product = await sdk.product
      .get(ctx.query.pid as string)
      .catch(err => console.log(err));

    return { product };
  }

  return { product: null };
};

export default ProductPage;
