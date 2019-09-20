import React from 'react';
import { Result, Button } from 'blocks-ui';
import Link from 'next/link';

export const Success = ({ order }: any) => {
  return (
    <Result
      status='success'
      title='Your order was successful!'
      subTitle={`Order number: ${order._id}.`}
      extra={[
        <Link passHref replace href='/orders/[pid]' as={`/orders/${order._id}`}>
          <Button type='primary' key='console'>
            See Order
          </Button>
        </Link>,
        <Link passHref replace href='/products'>
          <Button key='buy'>See Other Products</Button>
        </Link>,
      ]}
    />
  );
};
