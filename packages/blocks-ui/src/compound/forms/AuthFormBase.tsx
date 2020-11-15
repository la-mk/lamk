import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Label, Heading, Paragraph } from '../../basic/Typography';
import { PoweredBy } from '../PoweredBy';
import { Button } from '../../basic/Button';
import { Box } from '../../basic/Box';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';
import { NewForm, FormProps } from '../../basic/NewForm/NewForm';

interface AuthFormBaseProps extends FormProps<any> {
  logoUrl?: string;
  onPrimary: (data?: any) => void;
  onSecondary: (data?: any) => void;
  onForgotPassword?: () => void;
  primaryText: string;
  secondaryText: string;
  forgotPasswordText?: string;
}

export const AuthFormBase = ({
  logoUrl,
  onPrimary,
  onSecondary,
  onForgotPassword,
  primaryText,
  secondaryText,
  forgotPasswordText,
  ...otherProps
}: AuthFormBaseProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      <Heading textAlign="center" size="large" as="h1" mb={3}>
        {primaryText}
      </Heading>
      {logoUrl && (
        <Paragraph color="mutedText.dark" textAlign="center" size="small">
          {localization.authSameAccount} <PoweredBy logoUrl={logoUrl} />
        </Paragraph>
      )}

      <Box mt={3} width="100%">
        <NewForm<any>
          {...otherProps}
          onSubmit={({ formData }) => onPrimary(formData)}
          uiSchema={{
            email: {
              'ui:title': localization.email || 'Email address',
              'ui:options': {
                emphasized: true,
              },
            },
            password: {
              'ui:title': localization.password || 'Password',
              'ui:widget': 'password',
              'ui:placeholder': '********',
              'ui:options': {
                emphasized: true,
              },
            },
          }}
        >
          <Button width="100%" type="submit">
            {primaryText}
          </Button>
        </NewForm>
      </Box>

      <Flex alignItems="center" justifyContent="center" my={3}>
        <Label color="contentTertiary">{localization.or || 'or'}</Label>
      </Flex>

      <Button width="100%" kind="secondary" onClick={onSecondary}>
        {secondaryText}
      </Button>

      {onForgotPassword && (
        <Button mt={3} kind="minimal" onClick={onForgotPassword}>
          {forgotPasswordText}
        </Button>
      )}
    </BaseSection>
  );
};
