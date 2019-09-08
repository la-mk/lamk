import React, { useState, useEffect } from 'react';
import { Flex, SizedImage, Text, Title, Button, Input } from 'blocks-ui';
import { Product as ProductType } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import { Price } from '../shared/Price';
import { ProductSet } from '../sets/ProductSet';

interface ProductProps {
  product: ProductType;
}

export const Product = ({ product }: ProductProps) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    sdk.product
      .findForStore('bc8ae691-459d-41fe-bf3e-d86abbf3677c')
      .then(products => setRelatedProducts(products.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Flex mx={[2, 2, 4]} mt={4} flexDirection='column'>
        <Flex flexDirection={['column', 'column', 'row']}>
          <Flex
            width={['100%', '100%', '50%']}
            alignItems='center'
            justifyContent='flex-start'
            flexDirection='column'
          >
            <SizedImage
              height='350px'
              src={sdk.artifact.getUrlForArtifact(product.images[0])}
            />
          </Flex>
          <Flex
            width={['100%', '100%', '50%']}
            alignItems={['center', 'center', 'flex-start']}
            justifyContent='flex-start'
            flexDirection='column'
          >
            <Title level={2} ellipsis>
              {product.name}
            </Title>
            <Price price={product.price} currency={'ден'} />
            <Text mt={4}>{product.description}</Text>
            <Flex mt={5} flexDirection='row' alignItems='center'>
              <Text>Quantity:</Text>
              <Input width='60px' size='large' value={100} mx={2} />
              <Button ml={2} size='large' type='primary'>
                Add to Cart
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex mt={5}>
          <ProductSet title='Related Products' products={relatedProducts} />
        </Flex>
      </Flex>
    </>
  );
};
