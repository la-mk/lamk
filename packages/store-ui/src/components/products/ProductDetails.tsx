import React, { useState } from 'react';
import { Tabs, Text } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';

export const ProductDetails = ({
  product,
  delivery,
}: {
  product: Product;
  delivery: Delivery;
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const deliveryPrice = delivery?.price;
  const freeDeliveryPrice = delivery?.freeDeliveryOver;

  return (
    <Tabs
      index={tab}
      onChange={setTab}
      items={[
        {
          title: t('common.description'),
          content: (
            <Text as='p' whiteSpace='pre-wrap'>
              {product.description?.trim()}
            </Text>
          ),
        },
        {
          title: t('commerce.delivery'),
          content: (
            <>
              {!!delivery?.method && (
                <Text as='p' whiteSpace='pre-wrap'>
                  {t(`deliveryMethods.${delivery.method}`)}:{' '}
                  {`${deliveryPrice} ден`}
                </Text>
              )}
              <Text as='p' whiteSpace='pre-wrap'>
                {t('delivery.productFreeDeliveryExplanation', {
                  freeDeliveryPrice: `${freeDeliveryPrice} ден`,
                })}
              </Text>
            </>
          ),
        },
      ]}
    />
  );
};
