import isEqual from 'lodash/isEqual';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';
import { hooks, message, Spin } from '@sradevski/blocks-ui';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { setStore } from '../../../state/modules/store/store.module';
import { sdk } from '@sradevski/la-sdk';
import { CompanyForm } from '../../shared/forms/CompanyForm';

export const Company = () => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const { t } = useTranslation();

  const handleSetupCompanyDone = (newStore?: Partial<Store>) => {
    if (!newStore || isEqual(store, newStore)) {
      return;
    }

    caller<Store>(sdk.store.patch(newStore._id!, newStore), res => {
      message.success(t('common.success'));
      return setStore(res);
    });
  };

  return (
    <Spin spinning={showSpinner} tip={t('store.updatingStoreTip')}>
      <CompanyForm store={store} onDone={handleSetupCompanyDone} />
    </Spin>
  );
};
