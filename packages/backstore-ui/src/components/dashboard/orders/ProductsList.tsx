import React from 'react';
import { Box, DataGrid, Flex, Image, Text } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { VariantName } from '../../shared/components/VariantName';
import isEmpty from 'lodash/isEmpty';
import { TFunction } from 'i18next';

export const ProductsList = ({
  t,
  store,
  orderedProducts,
}: {
  t: TFunction;
  store: Store;
  orderedProducts: Order['ordered'];
}) => {
  return (
    <DataGrid
      isFullWidth
      isLoaded
      spacing={6}
      // @ts-ignore
      rowKey='product._id'
      items={orderedProducts}
      renderItem={orderItem => (
        <Flex
          width={'100%'}
          minWidth='100%'
          justify='space-between'
          align={['flex-start', 'center', 'center']}
          direction={['column', 'row', 'row']}
        >
          <Flex align='center'>
            <Flex
              minWidth={'120px'}
              maxWidth={'120px'}
              height={'60px'}
              justify='center'
              align='center'
            >
              <Image
                height={60}
                alt={orderItem.product.name}
                getSrc={params =>
                  sdk.artifact.getUrlForImage(
                    orderItem.product.media[0]?._id,
                    store?._id,
                    params,
                  )
                }
              />
            </Flex>
            <Flex direction='column'>
              <Text mx={2}>{orderItem.product.name}</Text>

              <Flex align='center'>
                {orderItem.product.sku && (
                  <Text as='strong' mx={2}>
                    {`${t('product.sku')}: ${orderItem.product.sku}`}
                  </Text>
                )}
                {!isEmpty(orderItem.product.attributes) && (
                  <>
                    <Flex align='center' ml={2}>
                      <Text as='strong'>{`${t('product.variant')}: `}</Text>
                      <Box ml={1}>
                        <VariantName
                          t={t}
                          attributes={orderItem.product.attributes}
                          shouldShowAttributes
                        />
                      </Box>
                    </Flex>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex mt={[3, 0, 0]} mx={2} direction='column'>
            <Text>
              {t('commerce.quantity')}:{' '}
              {orderItem.quantity || t('common.unknown')}
              {' / '}
              <Text color='mutedText.dark'>
                {t(`units.${orderItem.product.unit}`)}
              </Text>
            </Text>
            <Text as='strong'>
              {t('finance.total')}:{' '}
              {`${
                orderItem.quantity * (orderItem.product.calculatedPrice ?? 0)
              } ${t(`currencies.${store.preferences.currency ?? 'mkd'}`)}` ||
                t('common.unknown')}
            </Text>
          </Flex>
        </Flex>
      )}
    />
  );
};
