import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from '@sradevski/la-sdk';
import { Head } from '../../src/common/pageComponents/Head';
import { Product as ProductType } from '@sradevski/la-sdk/dist/models/product';
import { Product } from '../../src/components/products/Product';
import { Empty } from '@sradevski/blocks-ui';
import { useTranslation } from '../../src/common/i18n';

const ProductPage = ({ product }: { product: ProductType }) => {
  const { t } = useTranslation();

  if (!product) {
    return <Empty mt={6} description={t('results.productNotFound')}></Empty>;
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
