import React from 'react';
import { Button, hooks, NewForm, Flex, Box } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';

interface DeliveryFormProps {
  delivery: Delivery | null;
  onSubmit: (formData: { formData: Delivery }) => void;
}

export const DeliveryForm = ({ delivery, onSubmit }: DeliveryFormProps) => {
  const store = useSelector(getStore);
  const { t } = useTranslation();
  const [deliveryFormData, setDeliveryFormData] = hooks.useFormState<Delivery>(
    delivery,
    {
      forStore: store?._id,
    },
    [delivery, store?._id],
  );

  return (
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
        <NewForm<Delivery>
          schema={
            sdk.utils.schema.pick(sdk.delivery.schema, [
              'method',
              'price',
              'freeDeliveryOver',
            ]) as any
          }
          uiSchema={{
            method: {
              'ui:title': t('delivery.deliveryMethod'),
              'ui:widget': 'select',
              'ui:options': {
                customEnumOptions: Object.values(
                  sdk.delivery.DeliveryMethods,
                ).map(method => ({
                  value: method,
                  label: t(`deliveryMethods.${method}`),
                })),
              },
            },
            price: {
              'ui:title': t('common.price'),
              'ui:description': t('delivery.priceExplanation'),
              'ui:options': {
                prefix: t(`currencies.${store.preferences.currency ?? 'mkd'}`),
              },
            },
            freeDeliveryOver: {
              'ui:title': t('delivery.freeDelivery'),
              'ui:description': t('delivery.freeDeliveryExplanation'),
              'ui:options': {
                prefix: t(`currencies.${store.preferences.currency ?? 'mkd'}`),
              },
            },
          }}
          onSubmit={onSubmit}
          onChange={({ formData }) => setDeliveryFormData(formData)}
          formData={deliveryFormData as Delivery}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        >
          <Button type='submit'>
            {delivery ? t('actions.update') : t('actions.save')}
          </Button>
        </NewForm>
      </Box>
    </Flex>
  );
};
