import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Button } from '../../basic/Button';
import { formPassword } from '../FormHelpers';
import { Form, FormItem, FormHandlers } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

export interface ChangePasswordFormProps extends FormHandlers {
  size?: SizeType;
}

export const ChangePasswordForm = ({ size, ...props }: any) => {
  const localization = useContext(LocalizationContext);
  
  return (
    <Form
      width="100%"
      labelCol={{
        xs: { span: 24 },
      }}
      wrapperCol={{
        xs: { span: 24 },
      }}
      layout="vertical"
      colon={false}
      {...props}
    >
      <FormItem
        selector="currentPassword"
        label={localization.currentPassword || 'Current Password'}
      >
        {formPassword({
          size,
          placeholder: '********',
        })}
      </FormItem>

      <FormItem
        selector="password"
        label={localization.newPassword || 'New password'}
      >
        {formPassword({
          size,
          placeholder: '********',
        })}
      </FormItem>

      <Flex mt={4} justifyContent="center" alignItems="center">
        <Button width="100%" type="primary" htmlType="submit" size="large">
          {localization.update || 'Update'}
        </Button>
      </Flex>
    </Form>
  );
};
