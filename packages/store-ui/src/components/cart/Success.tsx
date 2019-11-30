import React from 'react';
import { Result, Button } from '@lamk/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../../common/i18n';

export const Success = ({ order }: any) => {
  const { t } = useTranslation();

  return (
    <Result
      status='success'
      title={t('cart.orderSuccess')}
      subTitle={t('cart.orderNumber', { orderId: order._id })}
      extra={[
        <Link passHref replace href='/orders/[pid]' as={`/orders/${order._id}`}>
          <Button type='primary' key='console'>
            {t('order.seeOrder')}
          </Button>
        </Link>,
        <Link passHref replace href='/products'>
          <Button key='buy'>{t('product.seeOtherProducts')}</Button>
        </Link>,
      ]}
    />
  );
};
