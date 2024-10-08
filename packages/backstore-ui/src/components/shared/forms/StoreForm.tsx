import React from 'react';
import { Button, hooks, NewForm } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { getImageUploader } from '../utils/artifacts';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { useTranslation } from 'react-i18next';
import { User } from '@la-mk/la-sdk/dist/models/user';

interface StoreFormProps {
  store: Store | null;
  userId: User['_id'] | undefined;
  onDone: ({ formData }: { formData: Store }) => void;
}

export const StoreForm = ({ store, userId, onDone }: StoreFormProps) => {
  const { t } = useTranslation();
  const [storeFormData, setStoreFormData] = hooks.useFormState<Partial<Store>>(
    store,
    {
      ownedBy: userId,
      isPublished: false,
      color: '#7859d1',
      preferences: { currency: 'mkd' },
    },
    [store, userId],
  );

  return (
    <NewForm<Store>
      imageUpload={{
        getImageUrl: imageId =>
          // TODO: Since the ID of the user and store are the same, and the store doesn't exist yet when the logo is first uploaded, we rely on the user ID here.
          sdk.artifact.getUrlForImage(imageId, store?._id ?? userId ?? '', {
            h: 80,
          }) ?? '',
        uploadImage: getImageUploader({ maxHeight: 800, maxWidth: 800 }),
        removeImage: imageId => sdk.artifact.remove(imageId as any) as any,
      }}
      customFormats={{ hexColor: /^#[0-9A-F]{6}$/i }}
      schema={
        sdk.utils.schema.pick(sdk.store.schema, [
          'name',
          'slug',
          'color',
          'slogan',
          'logo',
        ]) as any
      }
      uiSchema={{
        'ui:order': ['name', 'slug', 'slogan', 'color', 'logo', '*'],
        name: {
          'ui:title': t('store.storeName'),
        },
        slug: {
          'ui:title': t('store.storeUrl'),
          'ui:options': {
            prefix: 'https://',
            suffix: '.la.mk',
          },
        },
        color: {
          'ui:title': t('store.brandColor'),
          'ui:widget': 'color',
        },
        slogan: {
          'ui:title': t('store.slogan'),
          'ui:placeholder': t('store.sloganExample'),
        },
        logo: {
          'ui:title': t('store.storeLogo'),
          'ui:widget': 'file',
          'ui:options': {
            name: 'company-logo',
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
      <Button type='submit'>
        {store ? t('actions.update') : t('actions.create')}
      </Button>
    </NewForm>
  );
};
