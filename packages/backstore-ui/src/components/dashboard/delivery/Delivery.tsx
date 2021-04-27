import React, { useEffect } from 'react';
import { Spinner, Flex, toast, hooks, Box } from '@la-mk/blocks-ui';
import { Delivery as DeliveryType } from '@la-mk/la-sdk/dist/models/delivery';
import { sdk } from '@la-mk/la-sdk';
import { getDelivery } from '../../../state/modules/delivery/delivery.selector';
import { useSelector } from 'react-redux';
import { setDelivery } from '../../../state/modules/delivery/delivery.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { DeliveryForm } from '../../shared/forms/DeliveryForm';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';

export const Delivery = () => {
  const [caller, showSpinner] = hooks.useCall();
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const { t } = useTranslation();

  useEffect(() => {
    if (storeId) {
      caller<FindResult<DeliveryType>>(
        sdk.delivery.findForStore(storeId),
        deliveries => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        },
      );
    }
  }, [caller, storeId]);

  const handleSetupDeliveryDone = ({
    formData,
  }: {
    formData: DeliveryType;
  }) => {
    if (!formData) {
      return;
    }

    const handler = !!delivery?._id
      ? sdk.delivery.patch(delivery._id, formData)
      : sdk.delivery.create(formData);

    caller<DeliveryType>(handler, updatedDelivery => {
      toast.success(t('common.success'));
      return setDelivery(updatedDelivery);
    });
  };

  return (
    <Flex direction='column' px={[3, 4, 5]} py={5}>
      <Box my={3}>
        <Spinner
          isLoaded={!showSpinner}
          label={t('delivery.updatingDeliveryTip')}
        >
          <DeliveryForm
            delivery={delivery}
            onSubmit={handleSetupDeliveryDone}
          />
        </Spinner>
      </Box>
    </Flex>
  );
};
