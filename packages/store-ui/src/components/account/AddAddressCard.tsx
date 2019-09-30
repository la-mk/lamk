import * as React from 'react';
import {
  Card,
  Form,
  FormItem,
  Button,
  formInput,
  formTextArea,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { Address } from 'la-sdk/dist/models/address';

interface AddAddressCardProps {
  address?: Address;
  onAddAddress: (address: Address) => void;
  onPatchAddress: (address: Address) => void;
  onRemoveAddress: (id: string) => void;
}

export const AddAddressCard = ({
  address,
  onAddAddress,
  onPatchAddress,
  onRemoveAddress,
}: AddAddressCardProps) => {
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout='horizontal'
      colon={false}
      validate={sdk.address.validate}
      validateSingle={sdk.address.validateSingle}
      externalState={address || {}}
      onFormCompleted={address ? onPatchAddress : onAddAddress}
    >
      <Card
        title={
          <FormItem label='Name' mb={0} selector='name'>
            {formInput({ placeholder: 'eg. Home Address' })}
          </FormItem>
        }
        width={390}
        actions={[
          <Button type='link' icon='more'>
            More
          </Button>,
          ...(address
            ? [
                <Button
                  onClick={() => onRemoveAddress(address._id)}
                  type='link'
                  icon='delete'
                >
                  Delete
                </Button>,
              ]
            : []),

          <Button htmlType='submit' type='link' icon='check'>
            {address ? 'Update' : 'Create'}
          </Button>,
        ]}
      >
        <FormItem selector='region' label='Region'>
          {formInput()}
        </FormItem>

        <FormItem selector='city' label='City'>
          {formInput()}
        </FormItem>

        <FormItem selector='zip' label='Zipcode'>
          {formInput()}
        </FormItem>

        <FormItem selector='street' label='Street'>
          {formTextArea({
            placeholder: 'Full address',
            rows: 2,
          })}
        </FormItem>

        <FormItem mb={0} selector='person' label='Addressee'>
          {formInput()}
        </FormItem>
      </Card>
    </Form>
  );
};
