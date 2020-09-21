import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Button } from '../../basic/Button';
import { Title, Text } from '../../basic/Typography';
import { Result } from '../../basic/Result';
import { formInput } from '../FormHelpers';
import { Form, FormHandlers, FormItem } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';

export interface ForgotPasswordFormProps extends FormHandlers {
  onLoginInstead: () => void;
  hasSubmitted?: boolean;
}

export const ForgotPasswordForm = ({
  onLoginInstead,
  hasSubmitted,
  ...props
}: ForgotPasswordFormProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      {!hasSubmitted && (
        <>
          <Title textAlign="center" level={2} mb={3} fontSize={6}>
            {localization.forgotPassword || 'Forgot your password?'}
          </Title>
          <Text color="mutedText.dark" textAlign="center" fontSize={1}>
            {localization.forgotPasswordExplanation ||
              'We will send you a email with a link to reset your password'}
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
              {formInput({ size: 'large' })}
            </FormItem>

            <Flex mt={4} justifyContent="center" alignItems="center">
              <Button
                width="100%"
                type="primary"
                htmlType="submit"
                size="large"
              >
                {localization.sendPasswordResetLink ||
                  'Send password reset link'}
              </Button>
            </Flex>
          </Form>

          <Button mt={3} type="link" onClick={onLoginInstead}>
            {localization.loginInstead || 'Log in instead'}
          </Button>
        </>
      )}

      {hasSubmitted && (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Result
            status="success"
            title={localization.forgotPasswordSuccess || 'Reset link sent'}
            subTitle={
              localization.forgotPasswordSuccessExplanation ||
              'If the email you entered is registered in our system, you will get an email with a reset link'
            }
          />
        </Flex>
      )}
    </BaseSection>
  );
};
