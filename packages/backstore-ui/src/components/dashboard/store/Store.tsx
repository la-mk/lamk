import React from 'react';
import { Spinner, hooks, message, Flex, Box } from '@sradevski/blocks-ui';

import { sdk } from '@sradevski/la-sdk';
import { Store as StoreType } from '@sradevski/la-sdk/dist/models/store';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
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

  const handleSetupStoreDone = ({ formData }: { formData: StoreType }) => {
    if (!formData) {
      return;
    }

    caller<StoreType>(sdk.store.patch(store._id, formData), res => {
      message.success(t('common.success'));
      return setStore(res);
    });
  };

  return (
    <Spinner isLoaded={!showSpinner} label={t('store.updatingStoreTip')}>
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
          <StoreForm
            store={store}
            userId={userId}
            onDone={handleSetupStoreDone}
          />
        </Box>
      </Flex>
    </Spinner>
  );
};
