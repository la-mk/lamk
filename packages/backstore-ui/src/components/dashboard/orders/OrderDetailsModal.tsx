import React, { useEffect, useState } from 'react';
import {
  Modal,
  Spin,
  message,
  Flex,
  Button,
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
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import format from 'date-fns/format';
import {
  getOrderStatusColor,
  possibleOrderStatuses,
} from '../../shared/utils/enums';
import {
  setOrder,
  removeOrder,
} from '../../../state/modules/orders/orders.module';
import { useSelector } from 'react-redux';
import { getOrder } from '../../../state/modules/orders/orders.selector';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';
import sum from 'lodash/sum';

interface OrderDetailsModalProps {
  orderId?: string;
  onClose: () => void;
}

const getQuantityForProduct = (order: Order, product: Product) => {
  const orderItem = order.ordered.find(
    item => item.product._id === product._id,
  );

  return orderItem ? orderItem.quantity : null;
};

const getTotalPriceForProduct = (order: Order, product: Product) => {
  const orderItem = order.ordered.find(
    item => item.product._id === product._id,
  );

  return orderItem ? orderItem.quantity * orderItem.product.price : null;
};

export const OrderDetailsModal = ({
  orderId,
  onClose,
}: OrderDetailsModalProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const order = useSelector<any, Order>(getOrder(orderId));
  const [products, setProducts] = useState<Product[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (order) {
      setProducts(order.ordered.map(orderItem => orderItem.product));
    }
  }, [order]);

  const handleStatusChanged = (status: Order['status']) => {
    if (order) {
      caller<Order>(sdk.order.setStatus(order._id, status), setOrder);
    }
  };

  const handleDeleteOrder = () => {
    if (orderId) {
      caller<Order>(sdk.order.remove(orderId), () => {
        onClose();
        message.success(
          t('order.orderDeleted', { id: sdk.utils.getShortId(orderId) }),
        );
        return removeOrder(orderId);
      });
    }
  };

  const subtotal = order
    ? sum(order.ordered.map(item => item.quantity * item.product.price))
    : 0;
  const shippingCost = order
    ? order.delivery.freeDeliveryOver < subtotal
      ? 0
      : order.delivery.price
    : 0;
  const total = subtotal + shippingCost;

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
        <Spin spinning={showSpinner}>
          <Flex mb={3} justifyContent='flex-end'>
            <Button onClick={handleDeleteOrder} type='danger'>
              {t('actions.delete')}
            </Button>
          </Flex>

          <Flex mb={3}>
            <Descriptions size='middle' width={'100%'} bordered>
              <DescriptionItem label={t('order.orderId')}>
                {sdk.utils.getShortId(order)}
              </DescriptionItem>
              <DescriptionItem label={t('common.status')}>
                <Select
                  showArrow
                  onChange={handleStatusChanged as any}
                  value={order.status}
                >
                  {possibleOrderStatuses.map(status => {
                    return (
                      <Option key={status} value={status}>
                        <Tag color={getOrderStatusColor(status)}>
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
            </Descriptions>
          </Flex>

          <Flex flexDirection={['column', 'column', 'row']}>
            {/* TODO: This is copy-pasted from Store, together with the data calculation. Unify in one component*/}
            <Card
              title={t('finance.priceBreakdown')}
              mr={[0, 0, 2]}
              mt={[3, 3, 0]}
              width={['100%', '100%', '50%']}
            >
              <Flex flexDirection='row' justifyContent='space-between'>
                <Text strong>{t('finance.subtotal')}</Text>
                <Text strong>{subtotal} ден</Text>
              </Flex>
              <Flex mt={2} flexDirection='row' justifyContent='space-between'>
                <Text strong>{t('finance.shippingCost')}</Text>
                <Text strong>{shippingCost} ден</Text>
              </Flex>
              <Divider />
              <Flex flexDirection='row' justifyContent='space-between'>
                <Text strong>{t('finance.total')}</Text>
                <Text strong>{total} ден</Text>
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
            {Boolean(products) && (
              <List>
                {products!.map(product => (
                  <List.Item key={product._id}>
                    <Flex
                      width={'100%'}
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Flex alignItems='center'>
                        <Flex
                          width={'120px'}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <Image
                            maxHeight='60px'
                            alt={product.name}
                            src={
                              sdk.artifact.getUrlForArtifact(
                                product.images[0],
                                store._id,
                              ) || undefined
                            }
                          />
                        </Flex>
                        <Flex flexDirection='column'>
                          <Text mx={2}>{product.name}</Text>
                          {product.sku && (
                            <Text strong mx={2}>
                              {`${t('product.sku')}: ${product.sku}`}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                      <Flex mx={2} flexDirection='column'>
                        <Text>
                          {t('commerce.quantity')}:{' '}
                          {getQuantityForProduct(order, product) ||
                            t('common.unknown')}
                        </Text>
                        <Text strong>
                          {t('finance.total')}:{' '}
                          {`${getTotalPriceForProduct(order, product)} ден` ||
                            t('common.unknown')}
                        </Text>
                      </Flex>
                    </Flex>
                  </List.Item>
                ))}
              </List>
            )}
          </Card>
        </Spin>
      )}
    </Modal>
  );
};
