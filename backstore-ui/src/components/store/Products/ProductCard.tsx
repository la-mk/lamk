import React from 'react';
import { Card } from '../../../component-lib/basic/Card';
import {
  Text,
  Title,
  Paragraph,
} from '../../../component-lib/basic/Typography';
import { Product } from '../../../sdk/models/product';
import { Flex } from '../../../component-lib/basic/Flex';
import { Button } from '../../../component-lib/basic/Button';
import { sdk } from '../../../sdk';

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card
      width={280}
      cover={
        <Flex justifyContent='center' alignItems='center'>
          <img
            style={{
              maxWidth: '280px',
              width: 'auto',
              height: 180,
            }}
            alt={`${product.name}`}
            src={sdk.artifact.getUrlForArtifact(product.images[0])}
          />
        </Flex>
      }
    >
      <Flex flexDirection='column'>
        <Title level={3}>{product.name}</Title>
        <Text strong>{product.price} ден</Text>
        <Paragraph mt={4} ellipsis>
          {product.description}
        </Paragraph>
        <Button mt={3} icon='shopping-cart'>
          Add to Cart
        </Button>
      </Flex>
    </Card>
  );
};
