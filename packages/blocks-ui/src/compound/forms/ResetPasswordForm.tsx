import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Button } from '../../basic/Button';
import { Title, Text } from '../../basic/Typography';
import { formInput, formPassword } from '../FormHelpers';
import { Form, FormHandlers, FormItem } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';

export interface ResetPasswordFormProps extends FormHandlers {
  onLoginInstead: () => void;
}

export const ResetPasswordForm = ({
  onLoginInstead,
  ...props
}: ResetPasswordFormProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      <Title level={2} mb={3} fontSize={6}>
        {localization.resetPassword || 'Reset password'}
      </Title>
      <Text color="mutedText.dark" textAlign="center" fontSize={1}>
        {localization.resetPasswordExplanation ||
          'Set your email and new password in the form below'}
      </Text>

      <Form
        mt={3}
        width="100%"
        labelCol={{ xs: { span: 24 } }}
        wrapperCol={{ xs: { span: 24 } }}
        layout="vertical"
        colon={false}
        {...props}
      >
        <FormItem
          selector="email"
          label={localization.email || 'Email address'}
        >
          {formInput({
            size: 'large',
          })}
        </FormItem>

        <FormItem
          selector="password"
          label={localization.newPassword || 'New password'}
        >
          {formPassword({
            size: 'large',
            placeholder: '********',
          })}
        </FormItem>

        <Flex mt={4} justifyContent="center" alignItems="center">
          <Button width="100%" type="primary" htmlType="submit" size="large">
            {localization.resetPassword || 'Reset password'}
          </Button>
        </Flex>
      </Form>

      <Button mt={3} type="link" onClick={onLoginInstead}>
        {localization.loginInstead || 'Log in instead'}
      </Button>
    </BaseSection>
  );
};
