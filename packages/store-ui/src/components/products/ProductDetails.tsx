import React, { useState } from 'react';
import { TabPane, Paragraph, Label } from '@sradevski/blocks-ui';
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

  const deliveryPrice = delivery?.price;
  const freeDeliveryPrice = delivery?.freeDeliveryOver;

  return (
    <BorderlessTabs animated={false} activeKey={tab} onChange={setTab}>
      <TabPane
        pt={2}
        tab={
          <Label color={tab === 'description' ? 'primary' : 'contentPrimary'}>
            {t('common.description')}
          </Label>
        }
        key='description'
      >
        <Paragraph $style={{ whiteSpace: 'pre-wrap' }}>
          {product.description?.trim()}
        </Paragraph>
      </TabPane>
      <TabPane
        pt={2}
        tab={
          <Label color={tab === 'delivery' ? 'primary' : 'contentPrimary'}>
            {t('commerce.delivery')}
          </Label>
        }
        key='delivery'
      >
        {!!delivery?.method && (
          <Paragraph $style={{ whiteSpace: 'pre-wrap' }}>
            {t(`deliveryMethods.${delivery.method}`)}: {`${deliveryPrice} ден`}
          </Paragraph>
        )}
        <Paragraph $style={{ whiteSpace: 'pre-wrap' }}>
          {t('delivery.productFreeDeliveryExplanation', {
            freeDeliveryPrice: `${freeDeliveryPrice} ден`,
          })}
        </Paragraph>
      </TabPane>
    </BorderlessTabs>
  );
};
