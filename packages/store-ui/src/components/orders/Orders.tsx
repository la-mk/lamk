import React, { useState, useMemo, useCallback } from 'react';
import {
  Flex,
  Button,
  List,
  Text,
  Card,
  Row,
  Col,
  Empty,
  Spin,
  hooks,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';
import { formatDistanceToNow } from 'date-fns';
import { Page } from '../shared/Page';
import { useSelector } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';
import { OrderProductCard } from './OrderProductCard';
import { getStore } from '../../state/modules/store/store.selector';

export const Orders = () => {
  const [orders, setOrders] = useState(null);
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const { t } = useTranslation();

  const fetcher = useMemo(
    () =>
      user ? (params: any) => sdk.order.findForUser(user._id, params) : null,
    [user],
  );

  const resultHandler = useCallback((res: FindResult<Order>) => {
    return setOrders(res.data);
  }, []);

  const [handlePageChange, pagination, showSpinner] = hooks.useAdvancedCall(
    fetcher,
    resultHandler,
  );

  if (!orders) {
    return <Empty mt={6} description={t('order.orderNotFound_plural')}></Empty>;
  }

  return (
    <Page title={t('pages.order_plural')}>
      <List<Order>
        style={{ width: '100%' }}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) =>
            handlePageChange({ ...pagination, current: page, pageSize }),
        }}
        loading={showSpinner}
        dataSource={orders}
        renderItem={order => (
          <Card
            headStyle={{ fontWeight: 'normal', fontSize: 14 }}
            title={
              <Flex
                mr={3}
                justifyContent='center'
                flexDirection='column'
                height={32}
              >
                <Text strong>{t(`orderStatus.${order.status}`)}</Text>
                <Text>
                  {t('order.ordered')}{' '}
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                  })}
                </Text>
              </Flex>
            }
            extra={
              <Link passHref href='/orders/[pid]' as={`/orders/${order._id}`}>
                <Button type='link'>{t('common.details')}</Button>
              </Link>
            }
            mb={5}
            key={order._id}
          >
            <Row
              type='flex'
              align='top'
              justify='start'
              gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
            >
              {order.ordered.map(orderItem => {
                return (
                  <Col
                    width={['100%', '330px', '330px', '330px']}
                    key={orderItem.product._id}
                    mb={4}
                  >
                    <OrderProductCard
                      orderItem={orderItem}
                      storeId={store._id}
                    />
                  </Col>
                );
              })}
            </Row>
          </Card>
        )}
      ></List>
    </Page>
  );
};
