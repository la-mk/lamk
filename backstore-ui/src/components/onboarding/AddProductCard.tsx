import * as React from 'react';
import { Card, CardMeta } from '../../component-lib/basic/Card';
import { Icon } from '../../component-lib/basic/Icon';

export const AddProductCard = () => {
  return (
    <Card
      width='320px'
      cover={
        <img
          alt='example'
          src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
        />
      }
      actions={[
        <Icon type='setting' />,
        <Icon type='edit' />,
        <Icon type='ellipsis' />,
      ]}
    >
      <CardMeta title='Card title' description='This is the description' />
    </Card>
  );
};
