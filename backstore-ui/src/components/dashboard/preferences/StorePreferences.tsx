import React from 'react';
import { Col, message, Spin } from 'blocks-ui';

import { sdk } from 'la-sdk';
import { Store } from 'la-sdk/dist/models/store';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import isEqual from 'lodash/isEqual';
import { setStore } from '../../../state/modules/store/store.module';
import { StoreForm } from '../../shared/forms/StoreForm';

export const StorePreferences = () => {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const store = useSelector(getStore);
  const dispatch = useDispatch();

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return;
    }
    setShowSpinner(true);

    sdk.store
      .patch(newStore._id, newStore)
      .then(store => {
        dispatch(setStore(store));
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip='Updating store...'>
        <StoreForm store={store} onDone={handleSetupStoreDone} />
      </Spin>
    </Col>
  );
};
