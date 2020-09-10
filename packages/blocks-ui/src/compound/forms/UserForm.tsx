import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Button } from '../../basic/Button';
import { formInput, formPassword } from '../FormHelpers';
import { Form, FormItem, FormHandlers } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

export interface UserFormProps extends FormHandlers {
  size?: SizeType;
}

export const UserForm = ({ size, ...props }: any) => {
  const localization = useContext(LocalizationContext);

  return (
    <Form
      width='100%'
      labelCol={{
        xs: { span: 24 },
      }}
      wrapperCol={{
        xs: { span: 24 },
      }}
      layout='vertical'
      colon={false}
      {...props}
    >
      <FormItem selector='firstName' label={localization.firstName || 'First name'}>
        {formInput({ size })}
      </FormItem>

      <FormItem selector='lastName' label={localization.lastName || 'Last name'}>
        {formInput({ size })}
      </FormItem>

      <FormItem selector='phoneNumber' label={localization.phoneNumber || 'Phone number'}>
        {formInput({ size })}
      </FormItem>

      <FormItem selector='password' label={localization.password || 'Password'}>
        {formPassword({ size, placeholder: localization.newPassword || 'New password' })}
      </FormItem>

      <Flex mt={4} justifyContent='center' alignItems='center'>
        <Button width='100%' type='primary' htmlType='submit' size='large'>
          {localization.update || 'Update'}
        </Button>
      </Flex>
    </Form>
  );
};
