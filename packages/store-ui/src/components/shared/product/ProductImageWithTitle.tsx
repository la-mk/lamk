import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Flex, Title, Text, Box, Image } from '@sradevski/blocks-ui';
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
      <Flex maxHeight={90} maxWidth={60} minWidth={60}>
        <Image
          height={90}
          getSrc={params =>
            sdk.artifact.getUrlForImage(product.images[0], storeId, params)
          }
          alt={product.name}
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
