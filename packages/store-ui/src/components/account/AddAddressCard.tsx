import * as React from 'react';
import {
  Card,
  Form,
  FormItem,
  Button,
  formInput,
  formTextArea,
} from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { Address } from '@lamk/la-sdk/dist/models/address';
import { useTranslation } from '../../common/i18n';

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
  const { t } = useTranslation();

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout='horizontal'
      colon={false}
      validate={data => sdk.address.validate(data, Boolean(address))}
      validateSingle={sdk.address.validateSingle}
      externalState={address || {}}
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
        width={390}
        actions={[
          ...(address
            ? [
                <Button
                  onClick={() => onRemoveAddress(address._id)}
                  type='link'
                  icon='delete'
                >
                  {t('actions.delete')}
                </Button>,
              ]
            : []),

          <Button htmlType='submit' type='link' icon='check'>
            {address ? t('actions.update') : t('actions.create')}
          </Button>,
        ]}
      >
        <FormItem selector='country' label={t('common.country')}>
          {formInput({ disabled: true, placeholder: t('countries.mk') })}
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
