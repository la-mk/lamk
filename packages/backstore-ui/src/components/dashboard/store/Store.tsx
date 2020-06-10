import React from 'react';
import { Spin, hooks, message } from '@sradevski/blocks-ui';

import { sdk } from '@sradevski/la-sdk';
import { Store as StoreType } from '@sradevski/la-sdk/dist/models/store';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import isEqual from 'lodash/isEqual';
import { setStore } from '../../../state/modules/store/store.module';
import { StoreForm } from '../../shared/forms/StoreForm';
import { useTranslation } from 'react-i18next';
import { getUser } from '../../../state/modules/user/user.selector';

export const Store = () => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const userId = user ? user._id : undefined;
  const { t } = useTranslation();

  const handleSetupStoreDone = (newStore?: StoreType) => {
    if (!newStore || isEqual(store, newStore)) {
      return;
    }

    caller<StoreType>(sdk.store.patch(newStore._id, newStore), res => {
      message.success(t('common.success'));
      return setStore(res);
    });
  };

  return (
    <Spin spinning={showSpinner} tip={t('store.updatingStoreTip')}>
      <StoreForm store={store} userId={userId} onDone={handleSetupStoreDone} />
    </Spin>
  );
};
