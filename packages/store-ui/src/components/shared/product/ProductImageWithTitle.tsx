import React from 'react';
import { OrderProduct } from '@sradevski/la-sdk/dist/models/product';
import { Flex, Heading, Text, Box, Image } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { VariantName } from '../components/VariantName';
import { useTranslation } from '../../../common/i18n';

export const ProductImageWithTitle = ({
  product,
  storeId,
  quantity,
  ...props
}: {
  product: OrderProduct;
  storeId: string;
  quantity?: number;
} & React.ComponentProps<typeof Flex>) => {
  const { t } = useTranslation();
  return (
    <Flex minWidth={'200px'} align='center' justify='flex-start' {...props}>
      <Flex maxHeight={'90px'} maxWidth={'60px'} minWidth={'60px'}>
        <Image
          height={90}
          getSrc={params =>
            sdk.artifact.getUrlForImage(product.images[0], storeId, params)
          }
          alt={product.name}
        />
      </Flex>
      <Flex ml={4} direction='column'>
        <Heading mx={0} my={0} as='h2' size='sm' noOfLines={2}>
          {product.name}
          <VariantName t={t} attributes={product.attributes} />
        </Heading>

        {!!quantity && (
          <Box>
            <Text>{quantity} x </Text>
            <Text as='strong'>{product.calculatedPrice} ден</Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
