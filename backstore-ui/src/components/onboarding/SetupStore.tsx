import * as React from 'react';
import { Input } from '../../component-lib/basic/Input';
import { Col } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { UploadDragger } from '../../component-lib/basic/Upload';
import { UploadContent } from '../../component-lib/compound/UploadContent';
import { UploadChangeParam } from 'antd/es/upload';
import { sdk } from '../../sdk';

export const SetupStore = ({ onDone }: any) => {
  const uploadLogo = ({ file, onSuccess, onError }: any) => {
    sdk.store
      .uploadLogo(file)
      .then(onSuccess)
      .catch(onError);
  };

  const handleLogoUpload = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      console.log(`Uploading ${info.file.name}`);
      return;
    }

    if (info.file.status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
      return;
    }

    if (info.file.status === 'error') {
      console.error(`${info.file.name} file upload failed.`);
      return;
    }
  };

  return (
    <Col>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        validator={sdk.store.validateSingle}
        onFormCompleted={onDone}
      >
        <FormItem selector='shopName' label='Shop Name'>
          {(val, onChange, onComplete) => (
            <Input value={val} onChange={onChange} onBlur={onComplete} />
          )}
        </FormItem>
        <FormItem selector='shopLink' label='Shop Link'>
          {(val, onChange, onComplete) => (
            <Input value={val} onChange={onChange} onBlur={onComplete} />
          )}
        </FormItem>

        <FormItem selector='shopLogo' label='Shop Logo'>
          {(_val, _onChange, _onComplete) => (
            <UploadDragger
              customRequest={uploadLogo}
              accept='.png, .jpg, .jpeg'
              onChange={handleLogoUpload}
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
          Next
        </Button>
      </Form>
    </Col>
  );
};
