import React, { useEffect } from 'react';
import { Spin, Col } from '@lamk/blocks-ui';
import { Delivery } from '@lamk/la-sdk/dist/models/delivery';
import { sdk } from '@lamk/la-sdk';
import { getDelivery } from '../../../state/modules/delivery/delivery.selector';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { setDelivery } from '../../../state/modules/delivery/delivery.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { DeliveryForm } from '../../shared/forms/DeliveryForm';
import { useCall } from '../../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';

export const DeliveryPreferences = () => {
  const [caller, showSpinner] = useCall();
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const {t} = useTranslation();

  useEffect(() => {
    if (store) {
      caller(
        sdk.delivery.findForStore(store._id),
        (deliveries: FindResult<Delivery>) => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        },
      );
    }
  }, [caller, store]);

  const handleSetupDeliveryDone = (newDelivery?: Delivery) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return;
    }

    caller(sdk.delivery.patch(newDelivery._id, newDelivery), setDelivery);
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip={t('delivery.updatingDeliveryTip')}>
        <DeliveryForm storeId={store ? store._id : undefined} delivery={delivery} onDone={handleSetupDeliveryDone} />
      </Spin>
    </Col>
  );
};
