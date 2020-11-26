import React, { useContext } from 'react';
import { Button } from '../../basic/Button';
import { Box } from '../../basic/Box';
import { Title, Text } from '../../basic/Typography';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';
import { FormProps, NewForm } from '../../basic/NewForm/NewForm';

export interface ResetPasswordFormProps<T> extends FormProps<T> {
  onLoginInstead: () => void;
}

export const ResetPasswordForm = <T extends any>({
  onLoginInstead,
  ...props
}: ResetPasswordFormProps<T>) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      <Title textAlign="center" level={2} mb={3} fontSize={6}>
        {localization.resetPassword || 'Reset password'}
      </Title>
      <Text color="mutedText.dark" textAlign="center" fontSize={1}>
        {localization.resetPasswordExplanation ||
          'Set your email and new password in the form below'}
      </Text>

      <Box mt={4} width="100%">
        <NewForm<T>
          {...props}
          uiSchema={{
            email: {
              'ui:title': localization.email || 'Email address',
              'ui:options': {
                emphasized: true,
              },
            },
            password: {
              'ui:title': localization.newPassword || 'New password',
              'ui:options': {
                emphasized: true,
              },
              'ui:widget': 'password',
              'ui:placeholder': '**********',
            },
          }}
        >
          <Button isFullWidth size="lg" type="submit">
            {localization.resetPassword || 'Reset password'}
          </Button>
        </NewForm>
      </Box>

      <Button mt={4} variant="link" onClick={onLoginInstead}>
        {localization.loginInstead || 'Log in instead'}
      </Button>
    </BaseSection>
  );
};
