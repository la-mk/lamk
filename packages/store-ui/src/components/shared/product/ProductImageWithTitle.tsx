import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Flex, Image, Title, Text, Box } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';

export const ProductImageWithTitle = ({
  product,
  storeId,
  quantity,
  ...props
}: {
  product: Product;
  storeId: string;
  quantity?: number;
} & React.ComponentProps<typeof Flex>) => {
  return (
    <Flex
      minWidth={200}
      alignItems='center'
      justifyContent='flex-start'
      {...props}
    >
      <Flex maxWidth={60} minWidth={60}>
        <Image
          width='100%'
          maxHeight={90}
          alt={product.name}
          src={
            sdk.artifact.getUrlForArtifact(product.images[0], storeId) ||
            undefined
          }
        />
      </Flex>
      <Flex ml={4} flexDirection='column'>
        <Title
          mx={0}
          my={0}
          level={2}
          fontSize={[1, 2, 2]}
          ellipsis={{ rows: 2 }}
        >
          {product.name}
        </Title>

        {!!quantity && (
          <Box>
            <Text>{quantity} x </Text>
            <Text color='primary' strong>
              {product.calculatedPrice} ден
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
