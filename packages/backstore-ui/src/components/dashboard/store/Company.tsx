import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getStore } from '../../../state/modules/store/store.selector';
import { Box, Flex, toast, Spinner } from '@la-mk/blocks-ui';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { setStore } from '../../../state/modules/store/store.module';
import { sdk } from '@la-mk/la-sdk';
import { CompanyForm } from '../../shared/forms/CompanyForm';
import { useCall } from '../../shared/hooks/useCall';

export const Company = () => {
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const { t } = useTranslation();

  const handleSetupCompanyDone = ({
    formData,
  }: {
    formData: Partial<Store> | null;
  }) => {
    if (!formData) {
      return;
    }

    caller<Store>(sdk.store.patch(store._id, formData), res => {
      toast.success(t('common.success'));
      return setStore(res);
    });
  };

  return (
    <Spinner isLoaded={!showSpinner} label={t('store.updatingStoreTip')}>
      <Flex
        align='center'
        justify='center'
        direction='column'
        width={'100%'}
        maxWidth={800}
        minWidth={300}
        mx='auto'
      >
        <Box width='100%'>
          <CompanyForm store={store} onDone={handleSetupCompanyDone} />
        </Box>
      </Flex>
    </Spinner>
  );
};
