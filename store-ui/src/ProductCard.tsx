import React from 'react';
import { Product } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import { Card, Text, Title, Paragraph, Button, Flex } from 'blocks-ui';

export const CARD_WIDTH = 320;

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card
      width={CARD_WIDTH}
      cover={
        <Flex justifyContent='center' alignItems='center'>
          <img
            style={{
              maxWidth: `calc(${CARD_WIDTH}px - 2px)`,
              width: 'auto',
              height: 240,
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
