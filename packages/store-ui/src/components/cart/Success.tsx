import React from 'react';
import { Result, Button, Flex } from '@sradevski/blocks-ui';
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
        <Flex
          flexDirection='row'
          flexWrap='wrap'
          justifyContent='center'
          alignItems='center'
        >
          <Link
            passHref
            replace
            href='/orders/[pid]'
            as={`/orders/${order._id}`}
          >
            <Button mt={2} mx={2} type='primary' key='console'>
              {t('order.seeOrder')}
            </Button>
          </Link>
          <Link passHref replace href='/products'>
            <Button mt={2} mx={2} key='buy'>
              {t('product.seeOtherProducts')}
            </Button>
          </Link>
        </Flex>,
      ]}
    />
  );
};
