import React, { useState } from 'react';
import { TabPane, Paragraph, Text } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { BorderlessTabs } from '../shared/components/BorderlessTabs';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';

export const ProductDetails = ({
  product,
  delivery,
}: {
  product: Product;
  delivery: Delivery;
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('description');

  return (
    <BorderlessTabs animated={false} activeKey={tab} onChange={setTab}>
      <TabPane
        pt={2}
        tab={
          <Text
            fontSize={3}
            style={{ fontWeight: 400 }}
            color={tab === 'description' ? 'primary' : 'text.dark'}
          >
            {t('common.description')}
          </Text>
        }
        key='description'
      >
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
          {product.description.trim()}
        </Paragraph>
      </TabPane>
      <TabPane
        pt={2}
        tab={
          <Text
            fontSize={3}
            style={{ fontWeight: 400 }}
            color={tab === 'delivery' ? 'primary' : 'text.dark'}
          >
            {t('commerce.delivery')}{' '}
          </Text>
        }
        key='delivery'
      >
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
          {`Get it delivered to your home for ${delivery?.price} ден.
All orders over ${delivery?.freeDeliveryOver} ден are free of charge!`}
        </Paragraph>
      </TabPane>
    </BorderlessTabs>
  );
};
