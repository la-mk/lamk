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
        <FormItem selector='deliveryMethods' label='Delivery methods'>
          {(val, onChange, onComplete) => (
            <Select
              showSearch
              mode='multiple'
              value={val}
              onChange={onChange}
              onBlur={onComplete}
            >
              <OptionGroup label='Self-service'>
                <Option value='Pick up'>Pickup</Option>
              </OptionGroup>
              <OptionGroup label='Cargo service'>
                <Option value='Kargo Express'>Kargo Express</Option>
                <Option value='Globko'>Globko</Option>
              </OptionGroup>
            </Select>
          )}
        </FormItem>
        <FormItem selector='deliveryCost' label='Delivery cost'>
          {(val, onChange, onComplete) => (
            <>
              <Input
                placeholder='Price'
                addonAfter='Ден'
                value={val}
                onChange={onChange}
                onBlur={onComplete}
              />
              <span> This can be the average delivery cost</span>
            </>
          )}
        </FormItem>
        <FormItem selector='freeDeliveryOver' label='Free delivery'>
          {(val, onChange, onComplete) => (
            <>
              <Input
                placeholder='Over price'
                addonAfter='Ден'
                value={val}
                onChange={onChange}
                onBlur={onComplete}
              />
              <span>Over what price do you want to offer free shipping</span>
            </>
          )}
        </FormItem>

        <Button type='primary' size='large' htmlType='submit'>
          Finish
        </Button>
      </Form>
    </Col>
  );
};
