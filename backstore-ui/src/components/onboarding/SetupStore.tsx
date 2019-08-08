import * as React from 'react';
import { UploadChangeParam } from 'antd/es/upload';

import { Col } from 'blocks-ui/dist/basic/Grid';
import { Button } from 'blocks-ui/dist/basic/Button';
import { Form, FormItem } from 'blocks-ui/dist/basic/Form';
import { UploadDragger } from 'blocks-ui/dist/basic/Upload';
import { UploadContent } from 'blocks-ui/dist/compound/UploadContent';

import { sdk } from 'la-sdk';
import { Store } from 'la-sdk/dist/models/store';
import { message } from 'blocks-ui/dist/static/message';
import { Flex } from 'blocks-ui/dist/basic/Flex';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../shared/utils/artifacts';
import { formInput } from 'blocks-ui/dist/compound/FormHelpers';

interface SetupStoreProps {
  onDone: (newStore?: Store) => void;
  store: Store;
}

export const SetupStore = ({ onDone, store }: SetupStoreProps) => {
  return (
    <Col>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        validate={sdk.store.validate}
        validateSingle={sdk.store.validateSingle}
        externalState={store}
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
                handleArtifactUploadStatus(info, val, onComplete, message.error)
              }
              defaultFileList={getDefaultFileList(store.logo)}
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
            {store && store._id ? 'Update and continue' : 'Continue'}
          </Button>
          {store._id && (
            <Button ml={2} type='ghost' size='large' onClick={() => onDone()}>
              Continue
            </Button>
          )}
        </Flex>
      </Form>
    </Col>
  );
};
