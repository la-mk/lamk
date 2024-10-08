import React, { useEffect, useState } from 'react';
import { Flex, Button, Spinner, toast, hooks, NewForm } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';
import { sdk } from '@la-mk/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { StoreContents } from '@la-mk/la-sdk/dist/models/storeContents';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { useCall } from '../../shared/hooks/useCall';

export const AboutUs = () => {
  const { t } = useTranslation();
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const [storeContents, setStoreContents] = useState<StoreContents>();
  const [
    storeContentsFormData,
    setStoreContentsFormData,
  ] = hooks.useFormState<StoreContents>(
    storeContents,
    { forStore: store?._id, landing: { sets: [] } },
    [storeContents, store?._id],
  );

  useEffect(() => {
    if (!store) {
      return;
    }

    caller<FindResult<StoreContents>>(
      sdk.storeContents.findForStore(store?._id),
      res => (res.total > 0 ? setStoreContents(res.data[0]) : undefined),
    );
  }, [caller, store]);

  const handlePatchAboutUs = ({
    formData,
  }: {
    formData: Partial<StoreContents>;
  }) => {
    if (!storeContents) {
      return;
    }

    caller<StoreContents>(
      sdk.storeContents.patch(storeContents._id, { aboutUs: formData.aboutUs }),
      () => {
        toast.success(t('common.success'));
      },
    );
  };

  return (
    <Flex mt={3} direction='column'>
      <Spinner isLoaded={!showSpinner}>
        <NewForm
          schema={
            sdk.utils.schema.pick(sdk.storeContents.schema, ['aboutUs']) as any
          }
          uiSchema={{
            aboutUs: {
              'ui:options': {
                label: false,
              },
              description: {
                'ui:widget': 'textarea',
                'ui:title': t('store.aboutUs'),
                'ui:placeholder': t('store.aboutUsExample'),
                'ui:options': {
                  rows: 14,
                },
              },
            },
          }}
          onSubmit={handlePatchAboutUs}
          onChange={({ formData }) => setStoreContentsFormData(formData)}
          formData={storeContentsFormData as StoreContents}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        >
          <Button type='submit'>{t('actions.update')}</Button>
        </NewForm>
      </Spinner>
    </Flex>
  );
};
