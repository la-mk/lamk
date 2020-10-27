import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';
import { Box, Flex, hooks, message, Spin } from '@sradevski/blocks-ui';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { setStore } from '../../../state/modules/store/store.module';
import { sdk } from '@sradevski/la-sdk';
import { CompanyForm } from '../../shared/forms/CompanyForm';

export const Company = () => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const { t } = useTranslation();

  const handleSetupCompanyDone = ({
    formData,
  }: {
    formData: Partial<Store>;
  }) => {
    if (!formData) {
      return;
    }

    caller<Store>(sdk.store.patch(store._id, formData), res => {
      message.success(t('common.success'));
      return setStore(res);
    });
  };

  return (
    <Spin spinning={showSpinner} tip={t('store.updatingStoreTip')}>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        width={'100%'}
        maxWidth={800}
        minWidth={300}
        mx='auto'
      >
        <Box width='100%'>
          <CompanyForm store={store} onDone={handleSetupCompanyDone} />
        </Box>
      </Flex>
    </Spin>
  );
};
