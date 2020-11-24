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
  List,
  Image,
  Text,
  Divider,
  hooks,
  Box,
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
      width={'80%'}
      centered
      destroyOnClose
      visible={Boolean(order)}
      footer={null}
      onCancel={onClose}
      title={t('common.details')}
    >
      {order && (
        <Spinner isLoaded={!showSpinner}>
          {/* <Flex mb={3} justifyContent='flex-end'>
            <Button onClick={handleDeleteOrder} danger>
              {t('actions.delete')}
            </Button>
          </Flex> */}

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

          <Flex flexDirection={['column', 'column', 'row']}>
            {/* TODO: This is copy-pasted from Store, together with the data calculation. Unify in one component*/}
            <Card
              extra={[
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
                </InvoiceDownloadLink>,
              ]}
              title={t('finance.priceBreakdown')}
              mr={[0, 0, 2]}
              mt={[3, 3, 0]}
              width={['100%', '100%', '50%']}
            >
              <Flex flexDirection='row' justifyContent='space-between'>
                <Text strong>{t('finance.subtotal')}</Text>
                <Text strong>{prices.productsTotal} ден</Text>
              </Flex>
              {prices.withCampaignsTotal !== prices.productsTotal && (
                <Flex mt={2} flexDirection='row' justifyContent='space-between'>
                  <Text strong>{t('finance.campaignDiscount')}</Text>
                  <Text strong color='danger'>
                    {(prices.withCampaignsTotal - prices.productsTotal).toFixed(
                      1,
                    )}{' '}
                    ден
                  </Text>
                </Flex>
              )}
              <Flex mt={2} flexDirection='row' justifyContent='space-between'>
                <Text strong>{t('finance.shippingCost')}</Text>
                <Text strong>{prices.deliveryTotal} ден</Text>
              </Flex>
              <Divider />
              <Flex flexDirection='row' justifyContent='space-between'>
                <Text strong>{t('finance.total')}</Text>
                <Text strong>{prices.total} ден</Text>
              </Flex>
            </Card>
            <Card
              title={t('commerce.buyer')}
              ml={[0, 0, 2]}
              mt={[3, 3, 0]}
              width={['100%', '100%', '50%']}
            >
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
          <Card title={t('commerce.product_plural')} mt={3}>
            {Boolean(order?.ordered) && (
              <List>
                {order.ordered.map(orderItem => (
                  <List.Item key={orderItem.product._id}>
                    <Flex
                      width={'100%'}
                      justifyContent='space-between'
                      alignItems={['flex-start', 'center', 'center']}
                      flexDirection={['column', 'row', 'row']}
                    >
                      <Flex alignItems='center'>
                        <Flex
                          minWidth={'120px'}
                          maxWidth={'120px'}
                          height={60}
                          justifyContent='center'
                          alignItems='center'
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
                        <Flex flexDirection='column'>
                          <Text mx={2}>{orderItem.product.name}</Text>

                          <Flex alignItems='center'>
                            {orderItem.product.sku && (
                              <Text strong mx={2}>
                                {`${t('product.sku')}: ${
                                  orderItem.product.sku
                                }`}
                              </Text>
                            )}
                            {orderItem.product.attributes && (
                              <>
                                <Flex alignItems='center' ml={2}>
                                  <Text strong>{`${t(
                                    'product.variant',
                                  )}: `}</Text>
                                  <Box ml={1}>
                                    <VariantName
                                      t={t}
                                      attributes={orderItem.product.attributes}
                                    />
                                  </Box>
                                </Flex>
                              </>
                            )}
                          </Flex>
                        </Flex>
                      </Flex>
                      <Flex mt={[3, 0, 0]} mx={2} flexDirection='column'>
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
                  </List.Item>
                ))}
              </List>
            )}
          </Card>
        </Spinner>
      )}
    </Modal>
  );
};
