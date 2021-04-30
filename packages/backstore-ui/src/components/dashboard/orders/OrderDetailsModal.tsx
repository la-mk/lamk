import React, { useState } from 'react';
import {
  Modal,
  Spinner,
  Flex,
  Select,
  Card,
  Text,
  Divider,
  hooks,
  Box,
  Heading,
  Input,
} from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import format from 'date-fns/format';
import { setOrder } from '../../../state/modules/orders/orders.module';
import { useSelector } from 'react-redux';
import { getOrder } from '../../../state/modules/orders/orders.selector';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';
import { InvoiceDownloadLink } from '../pdfs/invoice/InvoiceDownloadLink';
import { ProductsList } from './ProductsList';
import isEqual from 'lodash/isEqual';

interface OrderDetailsModalProps {
  orderId?: string;
  onClose: () => void;
}

const DescriptionItem = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <Flex my={2} direction='row' justify='space-between' align='center'>
      <Box mr={2} width='100%'>
        <Text whiteSpace='nowrap' as='strong'>
          {label}
        </Text>
        {description && (
          <Text as='p' color='mutedText.dark' size='xs'>
            {description}
          </Text>
        )}
      </Box>
      <Text align='right' as='span' ml={2} width='100%'>
        {children}
      </Text>
    </Flex>
  );
};

export const OrderDetailsModal = ({
  orderId,
  onClose,
}: OrderDetailsModalProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const order = useSelector<any, Order>(getOrder(orderId));
  const [deliveryTracking, setDeliveryTracking] = useState<
    Order['deliveryTracking']
  >({ courierSlug: 'unknown', trackingId: '' });
  const { t } = useTranslation();

  const handleStatusChanged = (status: Order['status']) => {
    if (order) {
      caller<Order>(sdk.order.setStatus(order._id, status), setOrder);
    }
  };

  const handleTrackingChanged = (tracking?: Order['deliveryTracking']) => {
    if (!order) {
      return;
    }

    if (!isEqual(order.deliveryTracking, tracking)) {
      caller<Order>(
        sdk.order.setDeliveryTracking(order._id, tracking),
        setOrder,
      );
    }
  };

  const prices = sdk.utils.pricing.calculatePrices(
    order?.ordered ?? [],
    order?.delivery,
    order?.campaigns ?? [],
  );

  return (
    <Modal
      maxWidth={['98%', '88%', '80%']}
      isOpen={Boolean(order)}
      onClose={onClose}
      header={t('common.details')}
    >
      {order && (
        <Spinner isLoaded={!showSpinner}>
          <Card mb={3} width='100%'>
            <Flex>
              <Heading size='sm' as='h2'>
                {t('common.summary')}
              </Heading>
            </Flex>
            <Divider mt={3} mb={4} />

            <Flex
              direction={['column', 'column', 'row']}
              justify='space-between'
            >
              <Box mr={[0, 0, 5]} flex={1}>
                <DescriptionItem label={t('order.orderId')}>
                  {sdk.utils.getShortId(order)}
                </DescriptionItem>
                <DescriptionItem label={t('order.orderDate')}>
                  {format(new Date(order.createdAt), 'MM/dd/yyyy')}
                </DescriptionItem>
                <DescriptionItem label={t('payment.paymentMethod')}>
                  {t(`paymentMethodNames.${order.paymentMethod}`)}
                </DescriptionItem>
              </Box>

              <Box ml={[0, 0, 5]} flex={1}>
                <DescriptionItem label={t('common.status')}>
                  <Select
                    ml='auto'
                    width={'14rem'}
                    onChange={e => handleStatusChanged(e.target.value as any)}
                    value={order.status}
                    options={Object.values(sdk.order.OrderStatus).map(
                      status => ({
                        label: t(`orderStatus.${status}`),
                        value: status,
                      }),
                    )}
                  />
                </DescriptionItem>
                <DescriptionItem
                  label={t('delivery.trackingId')}
                  description={t('delivery.trackingIdExplanation')}
                >
                  <Box ml='auto' width='14rem'>
                    <Input
                      // leftAddon={
                      //   <Select
                      //     width={'4rem'}
                      //     variant='flushed'
                      //     onChange={e =>
                      //       setDeliveryTracking({
                      //         trackingId: '',
                      //         ...deliveryTracking,
                      //         courierSlug: e.target.value,
                      //       })
                      //     }
                      //     value={deliveryTracking?.courierSlug}
                      //     options={[
                      //       {
                      //         label: 'Unknown',
                      //         value: 'unknown',
                      //       },
                      //     ]}
                      //   />
                      // }
                      onChange={e =>
                        setDeliveryTracking({
                          courierSlug: 'unknown',
                          ...deliveryTracking,
                          trackingId: e.target.value,
                        })
                      }
                      onBlur={() => handleTrackingChanged(deliveryTracking)}
                      placeholder='TRK123456789'
                      value={deliveryTracking?.trackingId}
                    />
                  </Box>
                </DescriptionItem>
              </Box>
            </Flex>
          </Card>

          <Flex direction={['column', 'column', 'row']}>
            {/* TODO: This is copy-pasted from Store, together with the data calculation. Unify in one component*/}
            <Card mr={[0, 0, 2]} mt={[3, 3, 0]} width={['100%', '100%', '50%']}>
              <Flex justify='space-between'>
                <Heading size='sm' as='h2'>
                  {t('finance.priceBreakdown')}
                </Heading>
                {/* TODO: Improve how this looks like */}
                <InvoiceDownloadLink
                  order={order}
                  store={store}
                  pricesSummary={sdk.utils.pricing.calculatePrices(
                    order.ordered,
                    order.delivery,
                    order.campaigns,
                  )}
                  logoUrl={sdk.artifact.getUrlForImage(
                    store?.logo?._id,
                    store?._id,
                    {
                      h: 64,
                      dpr: 2,
                    },
                  )}
                >
                  {t('actions.downloadInvoice')}
                </InvoiceDownloadLink>
              </Flex>
              <Divider mt={3} mb={4} />
              <DescriptionItem label={t('finance.subtotal')}>
                <Text as='strong'>
                  {prices.productsTotal} {t(`currencies.${order.currency}`)}
                </Text>
              </DescriptionItem>

              {prices.withCampaignsTotal !== prices.productsTotal && (
                <DescriptionItem label={t('finance.campaignDiscount')}>
                  <Text as='strong' color='danger'>
                    {(prices.withCampaignsTotal - prices.productsTotal).toFixed(
                      1,
                    )}{' '}
                    {t(`currencies.${order.currency}`)}
                  </Text>
                </DescriptionItem>
              )}
              <DescriptionItem label={t('finance.shippingCost')}>
                <Text as='strong'>
                  {prices.deliveryTotal} {t(`currencies.${order.currency}`)}
                </Text>
              </DescriptionItem>
              <Divider my={4} />
              <DescriptionItem label={t('finance.total')}>
                <Text as='strong'>
                  {prices.total} {t(`currencies.${order.currency}`)}
                </Text>
              </DescriptionItem>
            </Card>

            <Card ml={[0, 0, 2]} mt={[3, 3, 0]} width={['100%', '100%', '50%']}>
              <Flex>
                <Heading size='sm' as='h2'>
                  {t('commerce.buyer')}
                </Heading>
              </Flex>
              <Divider mt={3} mb={4} />
              {order.deliverTo && (
                <>
                  <Box my={1}>
                    <Text as='strong'>{t('common.name')}:</Text>
                    <Text ml={2} as='span'>
                      {order.deliverTo.person}
                    </Text>
                  </Box>
                  <Box my={1}>
                    <Text as='strong'>{t('common.address')}:</Text>
                    <Text ml={2} as='span'>
                      {order.deliverTo.street}
                    </Text>
                  </Box>
                  <Box my={1}>
                    <Text as='strong'>{t('common.city')}:</Text>
                    <Text ml={2} as='span'>
                      {order.deliverTo.city} {order.deliverTo.zip}
                    </Text>
                  </Box>
                  <Box my={1}>
                    <Text as='strong'>{t('common.country')}:</Text>
                    <Text ml={2} as='span'>
                      {order.deliverTo.country}
                    </Text>
                  </Box>
                  <Box my={1}>
                    <Text as='strong'>{t('common.phoneNumber')}:</Text>
                    <Text ml={2} as='span'>
                      {order.deliverTo.phoneNumber}
                    </Text>
                  </Box>
                </>
              )}
            </Card>
          </Flex>

          {order.buyerNote && (
            <Card my={3} width={'100%'}>
              <Flex justify='space-between'>
                <Heading size='sm' as='h2'>
                  {t('order.note')}
                </Heading>
              </Flex>
              <Divider mt={3} mb={4} />
              {order.buyerNote}
            </Card>
          )}

          <Card mt={3}>
            <Flex>
              <Heading size='sm' as='h2'>
                {t('commerce.product_plural')}
              </Heading>
            </Flex>
            <Divider mt={3} mb={4} />
            {Boolean(order?.ordered) && (
              <ProductsList
                currency={order?.currency}
                orderedProducts={order?.ordered}
                store={store}
                t={t}
              />
            )}
          </Card>
        </Spinner>
      )}
    </Modal>
  );
};
