import React from 'react';
import {
  FormItem,
  formInput,
  Form,
  UploadDragger,
  message,
  UploadContent,
  Flex,
  Button,
  hooks,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import {
  getImageUploader,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../utils/artifacts';
import { UploadChangeParam } from 'antd/lib/upload';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { useTranslation } from 'react-i18next';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { ColorPicker } from '../components/ColorPicker';

interface StoreFormProps {
  store: Store | null;
  userId: User['_id'] | undefined;
  onDone: (store: Store) => void;
}

export const StoreForm = ({ store, userId, onDone }: StoreFormProps) => {
  const { t } = useTranslation();
  const [externalState] = hooks.useFormState<Partial<Store>>(
    store,
    { ownedBy: userId, isPublished: false, color: '#7859d1' },
    [store],
  );

  return (
    <Form
      labelCol={{
        xs: { span: 24 },
        md: { span: 6 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        md: { span: 12 },
      }}
      layout='horizontal'
      colon={false}
      validate={data => sdk.store.validate(data, Boolean(store))}
      validateSingle={sdk.store.validateSingle}
      getErrorMessage={(errorName, context) =>
        t(`errors.${errorName}`, context)
      }
      externalState={externalState}
      onFormCompleted={onDone}
    >
      <FormItem selector='name' label={t('store.storeName')}>
        {formInput()}
      </FormItem>

      <FormItem selector='slug' label={t('store.storeUrl')}>
        {formInput({ addonAfter: '.la.mk' })}
      </FormItem>

      <FormItem selector='slogan' label={t('store.slogan')}>
        {formInput({ placeholder: t('store.sloganExample') })}
      </FormItem>

      <FormItem selector='color' label={t('store.brandColor')}>
        {(val, _onChange, onComplete) => (
          <ColorPicker value={val} onChange={onComplete} />
        )}
      </FormItem>

      <FormItem selector='logo' label={t('store.storeLogo')}>
        {(val, _onChange, onComplete) => (
          <UploadDragger
            customRequest={getImageUploader({ maxHeight: 480, maxWidth: 480 })}
            accept='.png, .jpg, .jpeg'
            onChange={(info: UploadChangeParam) =>
              handleArtifactUploadStatus(
                info,
                val,
                true,
                onComplete,
                message.error,
              )
            }
            defaultFileList={getDefaultFileList(
              store?.logo ?? [],
              store ? store._id : '',
              { h: 80 },
            )}
            listType='picture'
            name='company-logo'
          >
            <UploadContent
              text={t('actions.addLogo')}
              hint={t('uploads.hint')}
            />
          </UploadDragger>
        )}
      </FormItem>

      <Flex justifyContent='center' alignItems='center'>
        <Button mr={2} type='primary' htmlType='submit' size='large'>
          {store ? t('actions.update') : t('actions.create')}
        </Button>
      </Flex>
    </Form>
  );
};
