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
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../utils/artifacts';
import { UploadChangeParam } from 'antd/lib/upload';
import { Store } from 'la-sdk/dist/models/store';

interface StoreFormProps {
  store: Store | null;
  onDone: (store: Store) => void;
}

export const StoreForm = ({ store, onDone }: StoreFormProps) => {
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout='horizontal'
      colon={false}
      validate={sdk.store.validate}
      validateSingle={sdk.store.validateSingle}
      externalState={store || {}}
      onFormCompleted={onDone}
    >
      <FormItem selector='name' label='Shop Name'>
        {formInput()}
      </FormItem>

      <FormItem selector='slug' label='Shop Link'>
        {formInput({ addonBefore: 'la.mk/' })}
      </FormItem>

      <FormItem selector='logo' label='Shop Logo'>
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
              text='Add your logo'
              hint='Support for a single or bulk upload.'
            />
          </UploadDragger>
        )}
      </FormItem>

      <Flex justifyContent='center' alignItems='center'>
        <Button mr={2} type='primary' htmlType='submit' size='large'>
          {store ? 'Update store' : 'Create store'}
        </Button>
      </Flex>
    </Form>
  );
};
