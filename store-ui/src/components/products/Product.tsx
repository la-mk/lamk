import toInteger from 'lodash/toInteger';
import React, { useState, useEffect } from 'react';
import {
  Flex,
  SizedImage,
  Text,
  Title,
  Button,
  InputNumber,
  Box,
} from 'blocks-ui';
import { Product as ProductType } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import { Price } from '../shared/Price';
import { ProductSet } from '../sets/ProductSet';
import { Thumbnails } from '../shared/Thumbnails';

interface ProductProps {
  product: ProductType;
}

export const Product = ({ product }: ProductProps) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(
    sdk.artifact.getUrlForArtifact(product.images[0]),
  );
  const [quantity, setQuantity] = React.useState(1);

  useEffect(() => {
    sdk.product
      .findForStore('bc8ae691-459d-41fe-bf3e-d86abbf3677c')
      .then(products => setRelatedProducts(products.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Flex mx={[2, 2, 4, 4]} mt={4} flexDirection='column'>
        <Flex flexDirection={['column', 'column', 'row', 'row']}>
          <Flex
            width={['100%', '100%', '50%', '50%']}
            alignItems='center'
            justifyContent='flex-start'
            flexDirection='column'
          >
            <SizedImage height='350px' src={selectedImage} />
            <Box mt={3} maxWidth={['100%', '80%', '100%', '80%']}>
              <Thumbnails
                images={product.images.map(imageId =>
                  sdk.artifact.getUrlForArtifact(imageId),
                )}
                selectedImage={selectedImage}
                onImageClick={setSelectedImage}
              />
            </Box>
          </Flex>
          <Flex
            width={['100%', '100%', '50%', '50%']}
            alignItems={['center', 'center', 'flex-start', 'flex-start']}
            justifyContent='flex-start'
            flexDirection='column'
          >
            <Title level={2} ellipsis>
              {product.name}
            </Title>
            <Price price={product.price} currency={'ден'} />
            <Text mt={4}>{product.description}</Text>
            <Flex mt={[4, 4, 5, 5]} flexDirection='row' alignItems='center'>
              <Text>Quantity:</Text>
              <InputNumber
                width='80px'
                size='large'
                min={1}
                max={999}
                value={quantity}
                onChange={setQuantity}
                mx={2}
              />
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
