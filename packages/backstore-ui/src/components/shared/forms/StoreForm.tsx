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
} from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../utils/artifacts';
import { UploadChangeParam } from 'antd/lib/upload';
import { Store } from '@lamk/la-sdk/dist/models/store';
import { useTranslation } from 'react-i18next';

interface StoreFormProps {
  store: Store | null;
  onDone: (store: Store) => void;
}

export const StoreForm = ({ store, onDone }: StoreFormProps) => {
  const {t} = useTranslation();

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout='horizontal'
      colon={false}
      validate={(data) => sdk.store.validate(data, Boolean(store))}
      validateSingle={sdk.store.validateSingle}
      getErrorMessage={(errorName, context) => t(`errors.${errorName}`, context)}
      externalState={store || {}}
      onFormCompleted={onDone}
    >
      <FormItem selector='name' label={t('store.storeName')}>
        {formInput()}
      </FormItem>

      <FormItem selector='slug' label={t('store.storeUrl')}>
        {formInput({ addonAfter: '.la.mk' })}
      </FormItem>

      <FormItem selector='logo' label={t('store.storeLogo')}>
        {(val, _onChange, onComplete) => (
          <UploadDragger
            customRequest={uploadImage}
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
            defaultFileList={getDefaultFileList(store ? store.logo : undefined)}
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
