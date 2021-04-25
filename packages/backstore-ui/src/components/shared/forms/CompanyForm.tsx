import React from 'react';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { hooks, Button, NewForm } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { useTranslation } from 'react-i18next';

export const CompanyForm = ({
  store,
  onDone,
  canSkip,
}: {
  store: Partial<Store>;
  onDone: ({ formData }: { formData: Partial<Store> | null }) => void;
  canSkip?: boolean;
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
          alternatePhoneNumber: {
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
      {canSkip && (
        <Button
          mr={2}
          variant='outline'
          onClick={() => onDone({ formData: null })}
        >
          {t('actions.continue')}
        </Button>
      )}
      <Button ml={2} type='submit'>
        {t('actions.update')}
      </Button>
    </NewForm>
  );
};
