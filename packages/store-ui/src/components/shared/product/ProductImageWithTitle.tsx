import React from 'react';
import { OrderProduct } from '@sradevski/la-sdk/dist/models/product';
import { Box, Flex, Image, Label } from '@sradevski/blocks-ui';
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
        <Label
          mb={0}
          as='h2'
          size={['small', 'medium', 'medium']}
          // ellipsis={{ rows: 2 }}
        >
          {product.name}
          <Box my={2}>
            <VariantName t={t} attributes={product.attributes} />
          </Box>
        </Label>

        {!!quantity && (
          <Flex>
            <Label size='small'>{quantity}</Label>
            <Label size='small' mx={2}>
              x
            </Label>
            <Label size='small' color='primary'>
              {product.calculatedPrice} ден
            </Label>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
