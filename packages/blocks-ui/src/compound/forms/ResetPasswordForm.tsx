import React, { useContext } from 'react';
import { Button } from '../../basic/Button';
import { Box } from '../../basic/Box';
import { Heading, Paragraph } from '../../basic/Typography';
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
      <Heading textAlign="center" size="large" as="h1" mb={2}>
        {localization.resetPassword || 'Reset password'}
      </Heading>
      <Paragraph color="contentTertiary" textAlign="center" size="small">
        {localization.resetPasswordExplanation ||
          'Set your email and new password in the form below'}
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
          <Button width="100%" type="submit">
            {localization.resetPassword || 'Reset password'}
          </Button>
        </NewForm>
      </Box>

      <Button mt={3} kind="minimal" onClick={onLoginInstead}>
        {localization.loginInstead || 'Log in instead'}
      </Button>
    </BaseSection>
  );
};
