import React from 'react';
import { Flex, Text, Card, Image } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../common/i18n';
import { Price } from '../shared/product/Price';

export const OrderProductCard = ({
  orderItem,
  storeId,
}: {
  orderItem: any;
  storeId: string;
}) => {
  const { t } = useTranslation();

  return (
    <Card width={'100%'} type='inner' title={orderItem.product.name}>
      <Flex width={'100%'}>
        <Flex justifyContent='center' alignItems='center'>
          <Image
            maxHeight='90px'
            maxWidth='90px'
            alt={orderItem.product.name}
            src={sdk.artifact.getUrlForArtifact(
              orderItem.product.images[0],
              storeId,
            )}
          />
        </Flex>
        <Flex ml={4} width='100%' flexDirection='row'>
          <Flex flexDirection='column'>
            <Price
              calculatedPrice={orderItem.product.calculatedPrice}
              basePrice={orderItem.product.price}
              currency='ден'
            />
            <Text mt={2}>
              {orderItem.quantity} {t('common.items')}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
