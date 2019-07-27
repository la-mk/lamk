import React, { useEffect, useState } from 'react';
import { Modal } from '../../../component-lib/basic/Modal';
import { sdk } from '../../../sdk';
import { message } from '../../../component-lib/static/message';
import { Product } from '../../../sdk/models/product';
import { Spin } from '../../../component-lib/basic/Spin';
import { Order } from '../../../sdk/models/order';
import { Flex } from '../../../component-lib/basic/Flex';
import { Button } from '../../../component-lib/basic/Button';
import { Card } from '../../../component-lib/basic/Card';
import {
  Descriptions,
  DescriptionItem,
} from '../../../component-lib/basic/DescriptionList';
import { Tag } from '../../../component-lib/basic/Tag';
import { getOrderStatusColor } from '../../shared/utils/statuses';
import { getShortId } from '../../shared/utils/ids';
import { List } from '../../../component-lib/basic/List';
import { SizedImage } from '../../../component-lib/compound/SizedImage';
import { Text } from '../../../component-lib/basic/Typography';

interface OrderDetailsModalProps {
  order?: Order;
  onClose: any;
}

const getQuantityForProduct = (order: Order, product: Product) => {
  const orderItem = order.ordered.find(item => item.product === product._id);

  return orderItem ? orderItem.quantity : 'Unknown';
};

export const OrderDetailsModal = ({
  order,
  onClose,
}: OrderDetailsModalProps) => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [products, setProducts] = useState<Product[]>();
  // const [buyer, setBuyer] = useState();

  useEffect(() => {
    if (order) {
      const getProductsForOrder = () => {
        sdk.product
          .findForStore(order.orderedFrom, {
            query: {
              _id: { $in: order.ordered.map(x => x.product) },
            },
          })
          .then(products => {
            if (products.total > 0) {
              setProducts(products.data);
            }
          })
          .catch(err => message.error(err.message));
      };

      const getBuyer = () => Promise.resolve();

      Promise.all([getProductsForOrder(), getBuyer()]).finally(() =>
        setShowSpinner(false),
      );
    }
  }, [order, setProducts]);

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
          <Flex mb={3} justifyContent='space-between'>
            <Button type='primary'>Change status</Button>
            <Button type='danger'>Delete order</Button>
          </Flex>

          <Flex mb={3}>
            <Descriptions size='middle' width={1} bordered>
              <DescriptionItem label='Order ID'>
                {getShortId(order)}
              </DescriptionItem>
              <DescriptionItem label='Status'>
                <Tag color={getOrderStatusColor(order.status)}>
                  {order.status}
                </Tag>
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
                    <List.Item>
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
              <Descriptions column={1} size='middle'>
                <DescriptionItem label='Name'>Stevche Radevski</DescriptionItem>
                <DescriptionItem label='Address'>
                  Pozarevacka 88
                </DescriptionItem>
                <DescriptionItem label='City'>Bitola</DescriptionItem>
                <DescriptionItem label='Country'>Macedonia</DescriptionItem>
                <DescriptionItem label='Phone Number'>
                  +389 75 212 495
                </DescriptionItem>
              </Descriptions>
            </Card>
          </Flex>
          <Flex />
        </Spin>
      )}
    </Modal>
  );
};
