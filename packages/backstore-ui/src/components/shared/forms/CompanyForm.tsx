import React from 'react';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { hooks, Button, NewForm } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from 'react-i18next';

export const CompanyForm = ({
  store,
  onDone,
}: {
  store: Partial<Store>;
  onDone: ({ formData }: { formData: Partial<Store> }) => void;
}) => {
  const { t } = useTranslation();
  const [storeFormData, setStoreFormData] = hooks.useFormState<Partial<Store>>(
    store,
    {},
    [store],
  );

  if (!store) {
    return null;
  }

  return (
    <NewForm
      customFormats={{ hexColor: /^#[0-9A-F]{6}$/i }}
      schema={
        sdk.utils.schema.pick(sdk.store.schema, ['company', 'contact']) as any
      }
      uiSchema={{
        company: {
          'ui:options': {
            label: false,
          },
          companyName: {
            'ui:title': t('store.companyName'),
          },
          companyAddress: {
            'ui:title': t('store.companyAddress'),
          },
          registryNumber: {
            'ui:title': t('store.registryNumber'),
          },
          taxNumber: {
            'ui:title': t('store.taxNumber'),
          },
        },
        contact: {
          'ui:options': {
            label: false,
          },
          email: {
            'ui:title': t('common.email'),
            'ui:options': {
              mt: 3,
            },
          },
          phoneNumber: {
            'ui:title': t('common.phoneNumber'),
          },
          alternativePhoneNumber: {
            'ui:title': t('common.alternatePhoneNumber'),
          },
        },
      }}
      onSubmit={onDone}
      onChange={({ formData }) => setStoreFormData(formData)}
      formData={storeFormData as Store}
      getErrorMessage={(errorName, context) =>
        t(`errors.${errorName}`, context)
      }
    >
      <Button type='submit'>{t('actions.update')}</Button>
    </NewForm>
  );
};
