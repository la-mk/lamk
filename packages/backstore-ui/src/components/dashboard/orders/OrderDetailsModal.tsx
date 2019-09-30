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
  SizedImage,
  Text,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { Product } from 'la-sdk/dist/models/product';
import { Order } from 'la-sdk/dist/models/order';
import {
  getOrderStatusColor,
  possibleOrderStatuses,
} from '../../shared/utils/statuses';
import { getShortId } from '../../shared/utils/ids';
import {
  setOrder,
  removeOrder,
} from '../../../state/modules/orders/orders.module';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder } from '../../../state/modules/orders/orders.selector';

interface OrderDetailsModalProps {
  orderId?: string;
  onClose: () => void;
}

const getQuantityForProduct = (order: Order, product: Product) => {
  const orderItem = order.ordered.find(
    item => item.product._id === product._id,
  );

  return orderItem ? orderItem.quantity : 'Unknown';
};

export const OrderDetailsModal = ({
  orderId,
  onClose,
}: OrderDetailsModalProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const order = useSelector<any, Order>(getOrder(orderId));
  const [products, setProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (order) {
      setProducts(order.ordered.map(orderItem => orderItem.product));
    }
  }, [order]);

  const handleStatusChanged = (status: Order['status']) => {
    if (order) {
      setShowSpinner(true);
      sdk.order
        .setStatus(order._id, status)
        .then(updatedOrder => dispatch(setOrder(updatedOrder)))
        .catch(err => message.error(err.message))
        .finally(() => setShowSpinner(false));
    }
  };

  const handleDeleteOrder = () => {
    if (orderId) {
      sdk.order
        .remove(orderId)
        .then(() => {
          dispatch(removeOrder(orderId));
          message.success(`Order ${getShortId(orderId)} successfully deleted`);
        })
        .catch(err => message.error(err.message))
        .finally(() => onClose());
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
      title={'Order details'}
    >
      {order && (
        <Spin spinning={showSpinner}>
          <Flex mb={3} justifyContent='flex-end'>
            <Button onClick={handleDeleteOrder} type='danger'>
              Delete order
            </Button>
          </Flex>

          <Flex mb={3}>
            <Descriptions size='middle' width={1} bordered>
              <DescriptionItem label='Order ID'>
                {getShortId(order)}
              </DescriptionItem>
              <DescriptionItem label='Status'>
                <Select
                  showArrow
                  onChange={handleStatusChanged as any}
                  value={order.status}
                >
                  {possibleOrderStatuses.map(status => {
                    return (
                      <Option key={status} value={status}>
                        <Tag color={getOrderStatusColor(status)}>{status}</Tag>
                      </Option>
                    );
                  })}
                </Select>
              </DescriptionItem>
              <DescriptionItem label='Order date'>
                {order.createdAt}
              </DescriptionItem>
            </Descriptions>
          </Flex>

          <Flex flexDirection={['column', 'column', 'row']}>
            <Card title={'Products'} width={[1, 1, 2 / 3]} mr={[0, 0, 2]}>
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
                          <Flex width={'120px'} alignItems='center'>
                            <SizedImage
                              height='60px'
                              width='120px'
                              alt={product.name}
                              src={sdk.artifact.getUrlForArtifact(
                                product.images[0],
                              )}
                            />
                          </Flex>
                          <Text mx={2}>{product.name}</Text>
                        </Flex>
                        <Text mx={2}>
                          Quantity: {getQuantityForProduct(order, product)}
                        </Text>
                      </Flex>
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
            <Card
              title={'Buyer'}
              ml={[0, 0, 2]}
              mt={[2, 2, 0]}
              width={[1, 1, 1 / 3]}
            >
              {order.deliverTo && (
                <Descriptions size='small' column={1}>
                  <DescriptionItem label='Name'>
                    {order.deliverTo.person}
                  </DescriptionItem>
                  <DescriptionItem label='Address'>
                    {order.deliverTo.street}
                  </DescriptionItem>
                  <DescriptionItem label='City'>
                    {order.deliverTo.city} {order.deliverTo.zip}
                  </DescriptionItem>
                  <DescriptionItem label='Country'>
                    {order.deliverTo.country}
                  </DescriptionItem>
                  <DescriptionItem label='Phone Number'>
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
