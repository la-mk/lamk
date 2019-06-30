import * as React from 'react';
import { Input } from '../../component-lib/basic/Input';
import { Col } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { UploadDragger } from '../../component-lib/basic/Upload';

export const SetupStore = ({ onDone }: any) => {
  return (
    <Col>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        onSubmit={onDone}
      >
        <FormItem label='Shop Name'>
          <Input />
        </FormItem>
        <FormItem label='Shop Link'>
          <Input />
        </FormItem>

        <FormItem label='Shop Logo'>
          <UploadDragger
            accept='.png, .jpg, .jpeg'
            action='/fake-upload-url'
            listType='picture'
            name='company-logo'
          >
            Add your logo
          </UploadDragger>
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type='primary' size='large' htmlType='submit'>
            Next
          </Button>
        </FormItem>
      </Form>
    </Col>
  );
};
