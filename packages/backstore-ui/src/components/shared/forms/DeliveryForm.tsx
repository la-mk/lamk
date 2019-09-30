import React from 'react';
import {
  FormItem,
  formInput,
  Form,
  Flex,
  Button,
  Select,
  Option,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { Delivery } from 'la-sdk/dist/models/delivery';

interface DeliveryFormProps {
  delivery: Delivery | null;
  onDone: (delivery: Delivery) => void;
}

export const DeliveryForm = ({ delivery, onDone }: DeliveryFormProps) => {
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout='horizontal'
      colon={false}
      onFormCompleted={onDone}
      externalState={delivery || {}}
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
      <FormItem
        extra='This can be the average delivery cost.'
        selector='price'
        label='Delivery cost'
      >
        {formInput({ placeholder: 'Price', addonBefore: 'Ден' })}
      </FormItem>

      <FormItem
        extra='Over what price do you want to offer free shipping?'
        selector='freeDeliveryOver'
        label='Free delivery'
      >
        {formInput({ placeholder: 'Over price', addonBefore: 'Ден' })}
      </FormItem>

      <Flex justifyContent='center' alignItems='center'>
        <Button mr={2} type='primary' htmlType='submit' size='large'>
          {delivery ? 'Update delivery' : 'Save delivery'}
        </Button>
      </Flex>
    </Form>
  );
};
