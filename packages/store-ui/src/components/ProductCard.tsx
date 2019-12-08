import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Card, Title, Paragraph, Flex } from '@sradevski/blocks-ui';
import Link from 'next/link';
import styled from 'styled-components';
import { Price } from './shared/Price';

const CARD_WIDTH = 320;

const ProductImage = styled.img`
  max-width: calc(${CARD_WIDTH}px - 2px);
  width: 'auto';
  height: 240px;
  margin-top: 16px;
`;

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href='/products/[pid]' as={`/products/${product._id}`}>
      <a style={{ textDecoration: 'none' }}>
        <Card
          hoverable
          width={CARD_WIDTH}
          cover={
            <Flex justifyContent='center' alignItems='center'>
              <ProductImage
                alt={`${product.name}`}
                src={sdk.artifact.getUrlForArtifact(product.images[0])}
              />
            </Flex>
          }
        >
          <Flex flexDirection='column'>
            <Title mt={2} mb={0} level={4} ellipsis>
              {product.name}
            </Title>
            <Price price={product.price} currency={'ден'} />
            <Paragraph mt={3} mb={0} ellipsis>
              {product.description}
            </Paragraph>
          </Flex>
        </Card>
      </a>
    </Link>
  );
};
