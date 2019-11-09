import React from 'react';
import { Col, Spin } from '@lamk/blocks-ui';

import { sdk } from '@lamk/la-sdk';
import { Store } from '@lamk/la-sdk/dist/models/store';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import isEqual from 'lodash/isEqual';
import { setStore } from '../../../state/modules/store/store.module';
import { StoreForm } from '../../shared/forms/StoreForm';
import { useCall } from '../../shared/hooks/useCall';
import { useTranslation } from 'react-i18next';

export const StorePreferences = () => {
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const {t} = useTranslation();

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return;
    }

    caller(sdk.store.patch(newStore._id, newStore), setStore);
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip={t('store.updatingStoreTip')}>
        <StoreForm store={store} onDone={handleSetupStoreDone} />
      </Spin>
    </Col>
  );
};
