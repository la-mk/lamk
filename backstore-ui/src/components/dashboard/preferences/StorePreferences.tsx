import React, { useEffect } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import { Col } from '../../../component-lib/basic/Grid';
import { Button } from '../../../component-lib/basic/Button';
import { Form, FormItem } from '../../../component-lib/basic/Form';
import { UploadDragger } from '../../../component-lib/basic/Upload';
import { UploadContent } from '../../../component-lib/compound/UploadContent';

import { sdk } from '../../../sdk';
import { Store } from '../../../sdk/models/store';
import { message } from '../../../component-lib/static/message';
import { Flex } from '../../../component-lib/basic/Flex';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../../shared/utils/artifacts';
import { formInput } from '../../../component-lib/compound/FormHelpers';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import isEqual from 'lodash/isEqual';
import { setStore } from '../../../state/modules/store/store.module';
import { Spin } from '../../../component-lib/basic/Spin';

export const StorePreferences = () => {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const store = useSelector(getStore);
  const dispatch = useDispatch();

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return;
    }

    setShowSpinner(true);

    sdk.store
      .patch(newStore._id, newStore)
      .then(store => {
        dispatch(setStore(store));
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip='Updating store...'>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout='horizontal'
          colon={false}
          validate={sdk.store.validate}
          validateSingle={sdk.store.validateSingle}
          externalState={store}
          onFormCompleted={handleSetupStoreDone}
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
                    onComplete,
                    message.error,
                  )
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
              Update store
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Col>
  );
};
