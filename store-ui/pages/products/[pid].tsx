import styled from 'styled-components';

const Title = styled.h1`
  color: red;
`;

import React from 'react';
import { NextPageContext } from 'next';
import { sdk } from 'la-sdk';

const ProductPage = ({ product }: any) => {
  if (!product) {
    return <div>Not found</div>;
  }

  return <Title>Hi {product._id}</Title>;
};

ProductPage.getInitialProps = async function(ctx: NextPageContext) {
  if (ctx.query.pid) {
    const product = await sdk.product
      .get(ctx.query.pid)
      .catch(err => console.log(err));

    return { product };
  }

  return { product: null };
};

export default ProductPage;
