import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Box } from '../../basic/Box';
import { Button } from '../../basic/Button';
import { Heading, Paragraph } from '../../basic/Typography';
import { Result } from '../../basic/Result';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';
import { FormProps, NewForm } from '../../basic/NewForm/NewForm';

export interface ForgotPasswordFormProps<T> extends FormProps<T> {
  onLoginInstead: () => void;
  hasSubmitted?: boolean;
}

export const ForgotPasswordForm = <T extends any>({
  onLoginInstead,
  hasSubmitted,
  ...props
}: ForgotPasswordFormProps<T>) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      {!hasSubmitted && (
        <>
          <Heading textAlign="center" size="large" as="h1" mb={3}>
            {localization.forgotPassword || 'Forgot your password?'}
          </Heading>
          <Paragraph color="mutedText.dark" textAlign="center" size="small">
            {localization.forgotPasswordExplanation ||
              'We will send you a email with a link to reset your password'}
          </Paragraph>

          <Box mt={3} width="100%">
            <NewForm<T>
              {...props}
              uiSchema={{
                email: {
                  'ui:title': localization.email || 'Email address',
                  'ui:options': {
                    emphasized: true,
                  },
                },
              }}
            >
              <Button width="100%" type="submit">
                {localization.sendPasswordResetLink ||
                  'Send password reset link'}
              </Button>
            </NewForm>
          </Box>

          <Button mt={3} kind="minimal" onClick={onLoginInstead}>
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
