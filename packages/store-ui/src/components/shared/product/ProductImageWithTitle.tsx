import React from 'react';
import { OrderProduct } from '@la-mk/la-sdk/dist/models/product';
import { Flex, Heading, Text, Box, Image } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { VariantName } from '../components/VariantName';
import { useTranslation } from '../../../common/i18n';
import { HoverableLink } from '../components/HoverableLink';

export const ProductImageWithTitle = ({
  product,
  storeId,
  currency,
  quantity,
  ...props
}: {
  product: OrderProduct;
  storeId: string;
  currency: string;
  quantity?: number;
} & React.ComponentProps<typeof Flex>) => {
  const { t } = useTranslation();
  return (
    <HoverableLink href='/products/[pid]' as={`/products/${product._id}`}>
      <Flex minWidth={'200px'} align='center' justify='flex-start' {...props}>
        <Flex maxHeight={'90px'} maxWidth={'60px'} minWidth={'60px'}>
          <Image
            height={90}
            getSrc={params =>
              sdk.artifact.getUrlForImage(
                product.media[0]?._id,
                storeId,
                params,
              )
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
              <Text as='strong'>
                {product.calculatedPrice} {t(`currencies.${currency}`)}
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </HoverableLink>
  );
};
