import React, { useEffect } from 'react';
import { Spin, Col, Title, Flex, message, hooks } from '@sradevski/blocks-ui';
import { Delivery as DeliveryType } from '@sradevski/la-sdk/dist/models/delivery';
import { sdk } from '@sradevski/la-sdk';
import { getDelivery } from '../../../state/modules/delivery/delivery.selector';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { setDelivery } from '../../../state/modules/delivery/delivery.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { DeliveryForm } from '../../shared/forms/DeliveryForm';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';

export const Delivery = () => {
  const [caller, showSpinner] = hooks.useCall();
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const { t } = useTranslation();

  useEffect(() => {
    if (storeId) {
      caller<FindResult<DeliveryType>>(
        sdk.delivery.findForStore(storeId),
        deliveries => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        },
      );
    }
  }, [caller, storeId]);

  const handleSetupDeliveryDone = (newDelivery?: DeliveryType) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return;
    }

    const handler = !!delivery?._id
      ? sdk.delivery.patch(delivery._id, newDelivery)
      : sdk.delivery.create(newDelivery);

    caller<DeliveryType>(handler, updatedDelivery => {
      message.success(t('common.success'));
      return setDelivery(updatedDelivery);
    });
  };

  return (
    <Flex flexDirection='column' px={[3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.delivery')}
      </Title>
      <Col my={3}>
        <Spin spinning={showSpinner} tip={t('delivery.updatingDeliveryTip')}>
          <DeliveryForm
            storeId={storeId}
            delivery={delivery}
            onDone={handleSetupDeliveryDone}
          />
        </Spin>
      </Col>
    </Flex>
  );
};
