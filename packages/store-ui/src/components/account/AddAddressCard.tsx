import * as React from 'react';
import {
  Card,
  Form,
  FormItem,
  Button,
  formInput,
  formTextArea,
  Select,
  Option,
  hooks,
} from '@sradevski/blocks-ui';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { sdk } from '@sradevski/la-sdk';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { useTranslation } from '../../common/i18n';

interface AddAddressCardProps {
  userId: string;
  resetAddressForm: boolean;
  address?: Address;
  onAddAddress: (address: Address) => void;
  onPatchAddress: (address: Address) => void;
  onRemoveAddress: (id: string) => void;
}

export const AddAddressCard = ({
  userId,
  address,
  // TODO: A hacky way to reset the address form after successful submission. Find a better way to do it;
  resetAddressForm,
  onAddAddress,
  onPatchAddress,
  onRemoveAddress,
}: AddAddressCardProps) => {
  const { t } = useTranslation();
  const [externalState] = hooks.useFormState<Address>(
    address,
    { addressFor: userId },
    [address, resetAddressForm, userId],
  );

  return (
    <Form
      labelCol={{
        xs: { span: 24 },
        md: { span: 10 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        md: { span: 14 },
      }}
      layout='horizontal'
      colon={false}
      validate={data => {
        console.log(sdk.address.validate(data, Boolean(address)));
        return sdk.address.validate(data, Boolean(address));
      }}
      validateSingle={sdk.address.validateSingle}
      externalState={externalState}
      onFormCompleted={address ? onPatchAddress : onAddAddress}
      getErrorMessage={(errorName, context) =>
        t(`errors.${errorName}`, context)
      }
    >
      <Card
        title={
          <FormItem label={t('common.name')} mb={0} selector='name'>
            {formInput({ placeholder: t('common.addressExample') })}
          </FormItem>
        }
        width={['100%', '400px', '400px']}
        actions={[
          ...(address
            ? [
                <Button
                  onClick={() => onRemoveAddress(address._id)}
                  type='link'
                  icon={<DeleteOutlined />}
                >
                  {t('actions.delete')}
                </Button>,
              ]
            : []),

          <Button htmlType='submit' type='link' icon={<CheckOutlined />}>
            {address ? t('actions.update') : t('actions.create')}
          </Button>,
        ]}
      >
        <FormItem selector='country' label={t('common.country')}>
          {(val, _onChange, onComplete) => (
            <Select value={val} onChange={onComplete}>
              <Option key={'MK'} value={'MK'}>
                {t('countries.mk')}
              </Option>
            </Select>
          )}
        </FormItem>

        <FormItem selector='city' label={t('common.city')}>
          {formInput()}
        </FormItem>

        <FormItem selector='zip' label={t('common.zipcode')}>
          {formInput()}
        </FormItem>

        <FormItem selector='street' label={t('common.street')}>
          {formTextArea({
            placeholder: t('common.streetExample'),
            rows: 2,
          })}
        </FormItem>

        <FormItem selector='person' label={t('common.addressee')}>
          {formInput()}
        </FormItem>

        <FormItem mb={0} selector='phoneNumber' label={t('common.phoneNumber')}>
          {formInput()}
        </FormItem>
      </Card>
    </Form>
  );
};
