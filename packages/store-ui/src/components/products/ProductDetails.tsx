import React, { useState } from 'react';
import { Tabs, Text } from '@la-mk/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { Product } from '@la-mk/la-sdk/dist/models/product';
import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';

export const ProductDetails = ({
  product,
  delivery,
}: {
  product: Product;
  delivery: Delivery;
}) => {
  const store = useSelector(getStore);
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
                  {`${deliveryPrice} ${t(
                    `currencies.${store.preferences.currency ?? 'mkd'}`,
                  )}`}
                </Text>
              )}
              <Text as='p' whiteSpace='pre-wrap'>
                {t('delivery.productFreeDeliveryExplanation', {
                  freeDeliveryPrice: `${freeDeliveryPrice} ${t(
                    `currencies.${store.preferences.currency ?? 'mkd'}`,
                  )}`,
                })}
              </Text>
            </>
          ),
        },
      ]}
    />
  );
};
