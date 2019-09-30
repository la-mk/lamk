import React, { useEffect } from 'react';
import { message, Spin, Col } from 'blocks-ui';
import { Delivery } from 'la-sdk/dist/models/delivery';
import { sdk } from 'la-sdk';
import { getDelivery } from '../../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { setDelivery } from '../../../state/modules/delivery/delivery.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { DeliveryForm } from '../../shared/forms/DeliveryForm';

export const DeliveryPreferences = () => {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowSpinner(true);
    if (store) {
      sdk.delivery
        .findForStore(store._id)
        .then(deliveries => {
          if (deliveries.total > 0) {
            dispatch(setDelivery(deliveries.data[0]));
          }
        })
        .catch(err => message.error(err.message))
        .finally(() => setShowSpinner(false));
    }
  }, [store, dispatch]);

  const handleSetupDeliveryDone = (newDelivery?: Delivery) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return;
    }

    setShowSpinner(true);

    sdk.delivery
      .patch(newDelivery._id, newDelivery)
      .then(delivery => {
        dispatch(setDelivery(delivery));
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip='Updating delivery...'>
        <DeliveryForm delivery={delivery} onDone={handleSetupDeliveryDone} />
      </Spin>
    </Col>
  );
};
