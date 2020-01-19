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
  hooks,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import {
  getOrderStatusColor,
  possibleOrderStatuses,
} from '../../shared/utils/statuses';
import {
  setOrder,
  removeOrder,
} from '../../../state/modules/orders/orders.module';
import { useSelector } from 'react-redux';
import { getOrder } from '../../../state/modules/orders/orders.selector';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';

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
            <Descriptions size='middle' width={1} bordered>
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
                {order.createdAt}
              </DescriptionItem>
            </Descriptions>
          </Flex>

          <Flex flexDirection={['column', 'column', 'row']}>
            <Card
              title={t('commerce.product_plural')}
              width={[1, 1, 2 / 3]}
              mr={[0, 0, 2]}
            >
              {Boolean(products) && (
                <List>
                  {products!.map(product => (
                    <List.Item key={product._id}>
                      <Flex
                        width={1}
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
                              src={sdk.artifact.getUrlForArtifact(
                                product.images[0],
                                store._id,
                              )}
                            />
                          </Flex>
                          <Text mx={2}>{product.name}</Text>
                        </Flex>
                        <Text mx={2}>
                          {t('commerce.quantity')}:{' '}
                          {getQuantityForProduct(order, product) ||
                            t('common.unknown')}
                        </Text>
                      </Flex>
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
            <Card
              title={t('commerce.buyer')}
              ml={[0, 0, 2]}
              mt={[2, 2, 0]}
              width={[1, 1, 1 / 3]}
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
          <Flex />
        </Spin>
      )}
    </Modal>
  );
};
