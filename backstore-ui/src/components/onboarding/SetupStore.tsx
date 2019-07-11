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

  const handleLogoUpload = (
    info: UploadChangeParam,
    onComplete: (val: any) => void,
  ) => {
    if (info.file.status === 'removed') {
      onComplete({ target: { value: null } });
    }

    if (info.file.status === 'uploading') {
      console.log(`Uploading ${info.file.name}`);
    }

    if (info.file.status === 'done') {
      onComplete({ target: { value: info.file.response.id } });
      console.log(`${info.file.name} file uploaded successfully`);
    }

    if (info.file.status === 'error') {
      console.error(`${info.file.name} file upload failed.`);
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
          {(_val, _onChange, onComplete) => (
            <UploadDragger
              customRequest={uploadLogo}
              accept='.png, .jpg, .jpeg'
              onChange={(info: UploadChangeParam) =>
                handleLogoUpload(info, onComplete)
              }
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
