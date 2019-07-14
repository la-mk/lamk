import * as React from 'react';
import { Input } from '../../component-lib/basic/Input';
import { Col } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { Select, Option } from '../../component-lib/basic/Select';
import { Delivery } from '../../sdk/models/delivery';
import { sdk } from '../../sdk';
import { Flex } from '../../component-lib/basic/Flex';

interface SetupDeliveryProps {
  onDone: any;
  delivery: Delivery;
}

export const SetupDelivery = ({ onDone, delivery }: SetupDeliveryProps) => {
  return (
    <Col>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout='horizontal'
        colon={false}
        onFormCompleted={onDone}
        externalState={delivery}
        validate={sdk.delivery.validate}
        validateSingle={sdk.delivery.validateSingle}
      >
        <FormItem selector='method' label='Delivery method'>
          {(val, _onChange, onComplete) => (
            <Select value={val} onChange={onComplete}>
              <Option value='none'>No delivery</Option>
              <Option value='cargo-pickup'>Pickup from Cargo</Option>
              <Option value='door-to-door'>Door to Door</Option>
            </Select>
          )}
        </FormItem>
        <FormItem selector='price' label='Delivery cost'>
          {(val, onChange, onComplete) => (
            <>
              <Input
                placeholder='Price'
                addonBefore='Ден'
                value={val}
                onChange={onChange}
                onBlur={onComplete}
              />
              <span> This can be the average delivery cost.</span>
            </>
          )}
        </FormItem>
        <FormItem selector='freeDeliveryOver' label='Free delivery'>
          {(val, onChange, onComplete) => (
            <>
              <Input
                placeholder='Over price'
                addonBefore='Ден'
                value={val}
                onChange={onChange}
                onBlur={onComplete}
              />
              <span>Over what price do you want to offer free shipping?</span>
            </>
          )}
        </FormItem>

        <Flex justifyContent='center' alignItems='center'>
          <Button mr={2} type='primary' htmlType='submit' size='large'>
            {delivery && delivery._id ? 'Update and finish' : 'Finish'}
          </Button>
          {delivery._id && (
            <Button ml={2} type='ghost' size='large' onClick={() => onDone()}>
              Finish
            </Button>
          )}
        </Flex>
      </Form>
    </Col>
  );
};
