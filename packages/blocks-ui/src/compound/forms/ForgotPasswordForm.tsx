import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Button } from '../../basic/Button';
import { formInput } from '../FormHelpers';
import { Form, FormHandlers, FormItem } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';

export const ForgotPasswordForm = (props: FormHandlers) => {
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
     <FormItem selector="email" label={localization.email || 'Email address'}>
        {formInput({ size: 'large' })}
      </FormItem>

      <Flex mt={4} justifyContent="center" alignItems="center">
        <Button width="100%" type="primary" htmlType="submit" size="large">
          {localization.sendPasswordResetLink || 'Send password reset link'}
        </Button>
      </Flex>
    </Form>
  );
};