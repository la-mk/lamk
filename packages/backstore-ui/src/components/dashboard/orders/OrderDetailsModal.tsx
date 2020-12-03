import React from 'react';
import {
  Modal,
  Spinner,
  Flex,
  Descriptions,
  DescriptionItem,
  Select,
  Option,
  Tag,
  Card,
  Image,
  Text,
  Divider,
  hooks,
  Box,
  Title,
  DataGrid,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import format from 'date-fns/format';
import { setOrder } from '../../../state/modules/orders/orders.module';
import { useSelector } from 'react-redux';
import { getOrder } from '../../../state/modules/orders/orders.selector';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';
import { InvoiceDownloadLink } from '../pdfs/invoice/InvoiceDownloadLink';
import { VariantName } from '../../shared/components/VariantName';
import isEmpty from 'lodash/isEmpty';

interface OrderDetailsModalProps {
  orderId?: string;
  onClose: () => void;
}

export const OrderDetailsModal = ({
  orderId,
  onClose,
}: OrderDetailsModalProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const order = useSelector<any, Order>(getOrder(orderId));
  const { t } = useTranslation();

  const handleStatusChanged = (status: Order['status']) => {
    if (order) {
      caller<Order>(sdk.order.setStatus(order._id, status), setOrder);
    }
  };

  const prices = sdk.utils.pricing.calculatePrices(
    order?.ordered ?? [],
    order?.delivery,
    order?.campaigns ?? [],
  );

  return (
    <Modal
      maxWidth={['96%', '88%', '82%']}
      isOpen={Boolean(order)}
      onClose={onClose}
      header={t('common.details')}
    >
      {order && (
        <Spinner isLoaded={!showSpinner}>
          <Flex mb={3}>
            <Descriptions size='middle' width={'100%'} bordered>
              <DescriptionItem label={t('order.orderId')}>
                {sdk.utils.getShortId(order)}
              </DescriptionItem>
              <DescriptionItem label={t('common.status')}>
                <Select
                  bordered={false}
                  showArrow
                  onChange={handleStatusChanged as any}
                  value={order.status}
                >
                  {Object.values(sdk.order.OrderStatus).map(status => {
                    return (
                      <Option key={status} value={status}>
                        {/* TODO: Add missing props to blocks-ui */}
                        <Tag
                          // @ts-ignore
                          style={{ verticalAlign: 'middle' }}
                          size='sm'
                          // @ts-ignore
                          bgColor={sdk.order.orderStatusColor[status]}
                        >
                          {t(`orderStatus.${status}`)}
                        </Tag>
                      </Option>
                    );
                  })}
                </Select>
              </DescriptionItem>
              <DescriptionItem label={t('order.orderDate')}>
                {format(new Date(order.createdAt), 'MM/dd/yyyy')}
              </DescriptionItem>
              <DescriptionItem label={t('payment.paymentMethod')}>
                {t(`paymentMethodNames.${order.paymentMethod}`)}
              </DescriptionItem>
            </Descriptions>
          </Flex>

          <Flex direction={['column', 'column', 'row']}>
            {/* TODO: This is copy-pasted from Store, together with the data calculation. Unify in one component*/}
            <Card mr={[0, 0, 2]} mt={[3, 3, 0]} width={['100%', '100%', '50%']}>
              <Flex justify='space-between'>
                <Title level={4}>{t('finance.priceBreakdown')}</Title>
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
                    store?.logo,
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
              <Flex direction='row' justify='space-between'>
                <Text strong>{t('finance.subtotal')}</Text>
                <Text strong>{prices.productsTotal} ден</Text>
              </Flex>
              {prices.withCampaignsTotal !== prices.productsTotal && (
                <Flex mt={2} direction='row' justify='space-between'>
                  <Text strong>{t('finance.campaignDiscount')}</Text>
                  <Text strong color='danger'>
                    {(prices.withCampaignsTotal - prices.productsTotal).toFixed(
                      1,
                    )}{' '}
                    ден
                  </Text>
                </Flex>
              )}
              <Flex mt={2} direction='row' justify='space-between'>
                <Text strong>{t('finance.shippingCost')}</Text>
                <Text strong>{prices.deliveryTotal} ден</Text>
              </Flex>
              <Divider my={4} />
              <Flex direction='row' justify='space-between'>
                <Text strong>{t('finance.total')}</Text>
                <Text strong>{prices.total} ден</Text>
              </Flex>
            </Card>
            <Card ml={[0, 0, 2]} mt={[3, 3, 0]} width={['100%', '100%', '50%']}>
              <Flex>
                <Title level={4}>{t('commerce.buyer')}</Title>
              </Flex>
              <Divider my={3} />
              {order.deliverTo && (
                <Descriptions size='small' column={1}>
                  <DescriptionItem label={t('common.name')}>
                    {order.deliverTo.person}
                  </DescriptionItem>
                  <DescriptionItem label={t('common.address')}>
                    {order.deliverTo.street}
                  </DescriptionItem>
                  <DescriptionItem label={t('common.city')}>
                    {order.deliverTo.city} {order.deliverTo.zip}
                  </DescriptionItem>
                  <DescriptionItem label={t('common.country')}>
                    {order.deliverTo.country}
                  </DescriptionItem>
                  <DescriptionItem label={t('common.phoneNumber')}>
                    {order.deliverTo.phoneNumber}
                  </DescriptionItem>
                </Descriptions>
              )}
            </Card>
          </Flex>
          <Card mt={3}>
            <Flex>
              <Title level={4}>{t('commerce.product_plural')}</Title>
            </Flex>
            <Divider my={3} />
            {Boolean(order?.ordered) && (
              <DataGrid
                isFullWidth
                isLoaded
                spacing={6}
                // @ts-ignore
                rowKey='product._id'
                items={order.ordered}
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
                              orderItem.product.images[0],
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
                            <Text strong mx={2}>
                              {`${t('product.sku')}: ${orderItem.product.sku}`}
                            </Text>
                          )}
                          {!isEmpty(orderItem.product.attributes) && (
                            <>
                              <Flex align='center' ml={2}>
                                <Text strong>{`${t(
                                  'product.variant',
                                )}: `}</Text>
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
                      <Text strong>
                        {t('finance.total')}:{' '}
                        {`${
                          orderItem.quantity *
                          (orderItem.product.calculatedPrice ?? 0)
                        } ден` || t('common.unknown')}
                      </Text>
                    </Flex>
                  </Flex>
                )}
              />
            )}
          </Card>
        </Spinner>
      )}
    </Modal>
  );
};
