import React from 'react';
import { Col, message, Spin } from 'blocks-ui';

import { sdk } from 'la-sdk';
import { Store } from 'la-sdk/dist/models/store';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import isEqual from 'lodash/isEqual';
import { setStore } from '../../../state/modules/store/store.module';
import { StoreForm } from '../../shared/forms/StoreForm';
import { useCall } from '../../shared/hooks/useCall';

export const StorePreferences = () => {
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return;
    }

    caller(sdk.store.patch(newStore._id, newStore), setStore);
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip='Updating store...'>
        <StoreForm store={store} onDone={handleSetupStoreDone} />
      </Spin>
    </Col>
  );
};
