import React, { useContext } from 'react';
import { Box } from '../../basic/Box';
import { Button } from '../../basic/Button';
import { Text } from '../../basic/Text';
import { Heading } from '../../basic/Heading';
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
          <Heading align="center" as="h2" mb={3} size="lg">
            {localization.forgotPassword || 'Forgot your password?'}
          </Heading>
          <Text color="mutedText.dark" align="center">
            {localization.forgotPasswordExplanation ||
              'We will send you a email with a link to reset your password'}
          </Text>

          <Box mt={5} width="100%">
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
              <Button isFullWidth size="lg" type="submit">
                {localization.sendPasswordResetLink ||
                  'Send password reset link'}
              </Button>
            </NewForm>
          </Box>

          <Button mt={4} variant="link" onClick={onLoginInstead}>
            {localization.loginInstead || 'Log in instead'}
          </Button>
        </>
      )}

      {hasSubmitted && (
        <Result
          mt={4}
          status="success"
          title={localization.forgotPasswordSuccess || 'Reset link sent'}
          description={
            localization.forgotPasswordSuccessExplanation ||
            'If the email you entered is registered in our system, you will get an email with a reset link'
          }
        />
      )}
    </BaseSection>
  );
};
