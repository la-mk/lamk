import React from 'react';
import { Card } from 'blocks-ui/dist/basic/Card';
import { Text, Title, Paragraph } from 'blocks-ui/dist/basic/Typography';
import { Product } from 'la-sdk/dist/models/product';
import { Flex } from 'blocks-ui/dist/basic/Flex';
import { Button } from 'blocks-ui/dist/basic/Button';
import { sdk } from 'la-sdk';

export const CARD_WIDTH = 280;

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card
      width={CARD_WIDTH}
      cover={
        <Flex justifyContent='center' alignItems='center'>
          <img
            style={{
              maxWidth: `${CARD_WIDTH}px`,
              width: 'auto',
              height: 140,
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
        <Paragraph mt={3} ellipsis>
          {product.description}
        </Paragraph>
        <Button mt={3} icon='shopping-cart'>
          Add to Cart
        </Button>
      </Flex>
    </Card>
  );
};
