import * as React from 'react';
import { UploadChangeParam } from 'antd/es/upload';

import { Input } from '../../component-lib/basic/Input';
import { Col } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { UploadDragger } from '../../component-lib/basic/Upload';
import { UploadContent } from '../../component-lib/compound/UploadContent';

import { sdk } from '../../sdk';
import { Store } from '../../sdk/models/store';
import { UploadFile } from 'antd/lib/upload/interface';
import { message } from '../../component-lib/static/message';

interface SetupStoreProps {
  onDone: any;
  store: Store;
}

export const SetupStore = ({ onDone, store }: SetupStoreProps) => {
  const uploadLogo = async ({ file, onSuccess, onError }: any) => {
    const base64 = await new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as any);
      };
    });

    sdk.artifact
      .create({ uri: base64 })
      .then(onSuccess)
      .catch(onError);
  };

  const handleLogoUploadStatus = (
    info: UploadChangeParam,
    onComplete: (val: any) => void,
    val?: string,
  ) => {
    if (info.file.status === 'removed') {
      if (val) {
        sdk.artifact.remove(val);
      }
      onComplete({ target: { value: null } });
    }

    if (info.file.status === 'done') {
      onComplete({ target: { value: info.file.response.id } });
    }

    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const defaultFileList = store.logo
    ? ([
        {
          uid: store.logo,
          name: store.logo,
          status: 'done',
          url: sdk.artifact.getUrlForArtifact(store.logo),
        },
      ] as UploadFile[])
    : undefined;

  return (
    <Col>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        validator={sdk.store.validateSingle}
        initialState={store}
        onFormCompleted={onDone}
      >
        <FormItem selector='name' label='Shop Name'>
          {(val, onChange, onComplete) => (
            <Input value={val} onChange={onChange} onBlur={onComplete} />
          )}
        </FormItem>

        <FormItem selector='slug' label='Shop Link'>
          {(val, onChange, onComplete) => (
            <Input value={val} onChange={onChange} onBlur={onComplete} />
          )}
        </FormItem>

        <FormItem selector='logo' label='Shop Logo'>
          {(val, _onChange, onComplete) => (
            <UploadDragger
              customRequest={uploadLogo}
              accept='.png, .jpg, .jpeg'
              onChange={(info: UploadChangeParam) =>
                handleLogoUploadStatus(info, onComplete, val)
              }
              defaultFileList={defaultFileList}
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

        <Button type='primary' htmlType='submit' size='large'>
          {store && store.name ? 'Update and continue' : 'Continue'}
        </Button>
      </Form>
    </Col>
  );
};
