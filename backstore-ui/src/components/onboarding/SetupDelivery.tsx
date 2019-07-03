import * as React from 'react';
import { Input } from '../../component-lib/basic/Input';
import { Col } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { Select, Option, OptionGroup } from '../../component-lib/basic/Select';

export const SetupDelivery = ({ onDone }: any) => {
  return (
    <Col>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        onSubmit={onDone}
      >
        <FormItem label='Delivery methods'>
          <Select showSearch mode='multiple'>
            <OptionGroup label='Self-service'>
              <Option value='Pick up'>Pickup</Option>
            </OptionGroup>
            <OptionGroup label='Cargo service'>
              <Option value='Kargo Express'>Kargo Express</Option>
              <Option value='Globko'>Globko</Option>
            </OptionGroup>
          </Select>
        </FormItem>
        <FormItem label='Delivery cost'>
          <Input placeholder='Price' addonAfter='Ден' />
          <span> This can be the average delivery cost</span>
        </FormItem>
        <FormItem label='Free delivery'>
          <Input placeholder='Over price' addonAfter='Ден' />
          <span>Over what price do you want to offer free shipping</span>
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type='primary' size='large' htmlType='submit'>
            Finish
          </Button>
        </FormItem>
      </Form>
    </Col>
  );
};
