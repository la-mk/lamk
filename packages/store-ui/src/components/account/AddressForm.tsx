import * as React from 'react';
import {
  Form,
  FormItem,
  Button,
  formInput,
  formTextArea,
  Select,
  Option,
  hooks,
  Flex,
} from '@sradevski/blocks-ui';
import { CheckOutlined } from '@ant-design/icons';
import { sdk } from '@sradevski/la-sdk';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { useTranslation } from '../../common/i18n';

interface AddAddressCardProps {
  userId: string;
  address?: Address;
  onAddAddress: (address: Address) => void;
  onPatchAddress: (address: Address) => void;
}

export const AddressForm = ({
  userId,
  address,
  onAddAddress,
  onPatchAddress,
}: AddAddressCardProps) => {
  const { t } = useTranslation();
  const [externalState] = hooks.useFormState<Address>(
    address,
    { addressFor: userId },
    [address, userId],
  );

  return (
    <Form
      labelCol={{
        xs: { span: 24 },
        md: { span: 6 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        md: { span: 12 },
      }}
      layout='horizontal'
      colon={false}
      validate={data => {
        return sdk.address.validate(data, Boolean(address));
      }}
      validateSingle={sdk.address.validateSingle}
      externalState={externalState}
      onFormCompleted={address ? onPatchAddress : onAddAddress}
      getErrorMessage={(errorName, context) =>
        t(`errors.${errorName}`, context)
      }
    >
      <FormItem label={t('common.name')} selector='name'>
        {formInput({ placeholder: t('common.addressExample') })}
      </FormItem>
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

      <Flex mt={4} justifyContent='center' alignItems='center'>
        <Button htmlType='submit' type='primary'>
          {address ? t('actions.update') : t('actions.create')}
        </Button>
      </Flex>
    </Form>
  );
};
