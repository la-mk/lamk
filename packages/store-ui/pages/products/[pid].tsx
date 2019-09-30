import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from 'la-sdk';
import { Head } from '../common/Head';
import { Product as ProductType } from 'la-sdk/dist/models/product';
import { Product } from '../../src/components/products/Product';

const ProductPage = ({ product }: { product: ProductType }) => {
  if (!product) {
    return <div>Not found</div>;
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
